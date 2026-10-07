"""Document ingestion orchestration service."""

from __future__ import annotations

import hashlib
import uuid
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.core.exceptions import DatabaseError, NotFoundError
from app.core.logging import get_logger
from app.db.models.chunk import Chunk
from app.db.models.document import Document
from app.ingestion.chunkers.semantic import SemanticChunker
from app.ingestion.cleaners.text_cleaner import clean_parsed_document
from app.ingestion.exceptions import EmptyFileError, InvalidDocumentError
from app.ingestion.parsers import get_parser
from app.ingestion.schemas import ParsedDocument, PreparedChunk
from app.ingestion.validators.file_validator import FileValidationResult, validate_upload
from app.schemas.documents import (
    DocumentDetailResponse,
    DocumentListResponse,
    DocumentSummary,
    IngestionResponse,
)

logger = get_logger(__name__)


class DocumentIngestionService:
    """Coordinate validation, parsing, cleaning, chunking, and persistence."""

    def __init__(
        self,
        session: AsyncSession,
        settings: Settings | None = None,
    ) -> None:
        self.session = session
        self.settings = settings or get_settings()
        self.chunker = SemanticChunker(
            chunk_size=self.settings.chunk_size,
            chunk_overlap=self.settings.chunk_overlap,
        )

    async def ingest_bytes(
        self,
        *,
        content: bytes,
        filename: str | None,
        content_type: str | None = None,
    ) -> IngestionResponse:
        """Run the full ingestion pipeline for an uploaded file."""
        validation = validate_upload(
            filename=filename,
            content=content,
            settings=self.settings,
            content_type=content_type,
        )
        logger.info(
            "Document ingestion started: filename=%s type=%s size_bytes=%s",
            validation.filename,
            validation.document_type,
            validation.size_bytes,
        )

        parser = get_parser(validation.extension)
        logger.info("Parser selected: %s", parser.__class__.__name__)

        parsed = parser.parse(content, filename=validation.filename)
        logger.info(
            "Extraction completed: filename=%s sections=%s",
            validation.filename,
            len(parsed.sections),
        )

        cleaned = clean_parsed_document(parsed)
        if not cleaned.raw_text.strip() or not cleaned.sections:
            raise EmptyFileError("Document contains no usable text after cleaning.")

        content_hash = compute_content_hash(cleaned.raw_text)
        existing = await self._find_by_hash(content_hash)
        if existing is not None:
            chunk_count = await self._count_chunks(existing.id)
            logger.info(
                "Duplicate detected: filename=%s document_id=%s",
                validation.filename,
                existing.id,
            )
            return IngestionResponse(
                document_id=existing.id,
                filename=validation.filename,
                status="duplicate",
                chunk_count=chunk_count,
                duplicate=True,
                warnings=cleaned.warnings,
            )

        prepared_chunks = self.chunker.chunk(cleaned)
        if not prepared_chunks:
            raise InvalidDocumentError("Chunking produced no content.")

        logger.info(
            "Chunking completed: filename=%s chunk_count=%s",
            validation.filename,
            len(prepared_chunks),
        )

        try:
            document = await self._persist(cleaned, validation, content_hash, prepared_chunks)
            await self.session.commit()
        except Exception as exc:
            await self.session.rollback()
            logger.error(
                "Ingestion failed during persistence: filename=%s error=%s",
                validation.filename,
                type(exc).__name__,
            )
            raise DatabaseError("Failed to persist ingested document.") from exc

        logger.info(
            "Document ingestion completed: filename=%s document_id=%s chunks=%s",
            validation.filename,
            document.id,
            len(prepared_chunks),
        )
        return IngestionResponse(
            document_id=document.id,
            filename=validation.filename,
            status="ingested",
            chunk_count=len(prepared_chunks),
            duplicate=False,
            warnings=cleaned.warnings,
        )

    async def list_documents(
        self,
        *,
        limit: int = 50,
        offset: int = 0,
    ) -> DocumentListResponse:
        """Return a lightweight paginated document listing."""
        limit = min(max(limit, 1), 100)
        offset = max(offset, 0)

        total = await self.session.scalar(select(func.count()).select_from(Document))
        chunk_count_subq = (
            select(Chunk.document_id, func.count(Chunk.id).label("chunk_count"))
            .group_by(Chunk.document_id)
            .subquery()
        )
        stmt = (
            select(Document, func.coalesce(chunk_count_subq.c.chunk_count, 0))
            .outerjoin(chunk_count_subq, Document.id == chunk_count_subq.c.document_id)
            .order_by(Document.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        rows = (await self.session.execute(stmt)).all()
        items = [
            DocumentSummary(
                id=document.id,
                title=document.title,
                source=document.source,
                document_type=document.document_type,
                chunk_count=int(chunk_count),
                created_at=document.created_at,
                updated_at=document.updated_at,
            )
            for document, chunk_count in rows
        ]
        return DocumentListResponse(items=items, total=int(total or 0), limit=limit, offset=offset)

    async def get_document(self, document_id: uuid.UUID) -> DocumentDetailResponse:
        """Return document metadata and chunk count."""
        document = await self.session.get(Document, document_id)
        if document is None:
            raise NotFoundError(f"Document not found: {document_id}")

        chunk_count = await self._count_chunks(document.id)
        return DocumentDetailResponse(
            id=document.id,
            title=document.title,
            source=document.source,
            document_type=document.document_type,
            content_hash=document.content_hash,
            metadata=document.metadata_ or {},
            chunk_count=chunk_count,
            created_at=document.created_at,
            updated_at=document.updated_at,
        )

    async def delete_document(self, document_id: uuid.UUID) -> None:
        """Delete a document and cascaded chunks."""
        document = await self.session.get(Document, document_id)
        if document is None:
            raise NotFoundError(f"Document not found: {document_id}")
        try:
            await self.session.delete(document)
            await self.session.commit()
        except Exception as exc:
            await self.session.rollback()
            raise DatabaseError("Failed to delete document.") from exc
        logger.info("Document deleted: document_id=%s", document_id)

    async def _find_by_hash(self, content_hash: str) -> Document | None:
        stmt = select(Document).where(Document.content_hash == content_hash)
        return (await self.session.execute(stmt)).scalar_one_or_none()

    async def _count_chunks(self, document_id: uuid.UUID) -> int:
        result = await self.session.scalar(
            select(func.count()).select_from(Chunk).where(Chunk.document_id == document_id)
        )
        return int(result or 0)

    async def _persist(
        self,
        cleaned: ParsedDocument,
        validation: FileValidationResult,
        content_hash: str,
        prepared_chunks: list[PreparedChunk],
    ) -> Document:
        document_metadata: dict[str, Any] = {
            **(cleaned.metadata or {}),
            "original_filename": validation.filename,
            "size_bytes": validation.size_bytes,
            "warnings": cleaned.warnings,
            "chunk_size": self.settings.chunk_size,
            "chunk_overlap": self.settings.chunk_overlap,
            "chunk_unit": "characters",
        }
        document = Document(
            title=cleaned.title[:512],
            source=validation.filename,
            document_type=validation.document_type,
            content_hash=content_hash,
            metadata_=document_metadata,
        )
        self.session.add(document)
        await self.session.flush()

        for prepared in prepared_chunks:
            chunk_metadata = {
                **prepared.metadata,
                "document_id": str(document.id),
            }
            self.session.add(
                Chunk(
                    document_id=document.id,
                    content=prepared.content,
                    chunk_index=prepared.chunk_index,
                    metadata_=chunk_metadata,
                    token_count=None,  # tokenizers arrive in a later phase
                )
            )
        await self.session.flush()
        return document


def compute_content_hash(normalized_content: str) -> str:
    """Return a SHA-256 hex digest of normalized document content."""
    return hashlib.sha256(normalized_content.encode("utf-8")).hexdigest()
