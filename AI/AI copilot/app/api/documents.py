"""Document ingestion and management API routes."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, File, Query, Response, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.db.session import get_db_session
from app.ingestion.exceptions import EmptyFileError
from app.ingestion.service import DocumentIngestionService
from app.schemas.documents import (
    DocumentDetailResponse,
    DocumentListResponse,
    IngestionResponse,
)

router = APIRouter(prefix="/documents", tags=["documents"])
logger = get_logger(__name__)


def get_ingestion_service(
    session: AsyncSession = Depends(get_db_session),
) -> DocumentIngestionService:
    """Provide an ingestion service bound to the request session."""
    return DocumentIngestionService(session)


@router.post(
    "",
    response_model=IngestionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest a support document",
    responses={
        200: {"description": "Duplicate document already ingested"},
        400: {"description": "Invalid or unsupported upload"},
        413: {"description": "File too large"},
        422: {"description": "Parsing or content error"},
        503: {"description": "Database unavailable"},
    },
)
async def ingest_document(
    response: Response,
    file: UploadFile = File(..., description="PDF, DOCX, TXT, or Markdown file"),
    service: DocumentIngestionService = Depends(get_ingestion_service),
) -> IngestionResponse:
    """Upload and ingest a document into PostgreSQL as metadata + chunks.

    Embeddings are **not** generated in Phase 2.
    """
    if file.filename is None:
        raise EmptyFileError("Filename is missing.")

    content = await file.read()
    result = await service.ingest_bytes(
        content=content,
        filename=file.filename,
        content_type=file.content_type,
    )
    response.status_code = (
        status.HTTP_200_OK if result.duplicate else status.HTTP_201_CREATED
    )
    return result


@router.get(
    "",
    response_model=DocumentListResponse,
    summary="List ingested documents",
)
async def list_documents(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    service: DocumentIngestionService = Depends(get_ingestion_service),
) -> DocumentListResponse:
    """Return basic document metadata (no chunk bodies, no search)."""
    return await service.list_documents(limit=limit, offset=offset)


@router.get(
    "/{document_id}",
    response_model=DocumentDetailResponse,
    summary="Get document details",
    responses={404: {"description": "Document not found"}},
)
async def get_document(
    document_id: uuid.UUID,
    service: DocumentIngestionService = Depends(get_ingestion_service),
) -> DocumentDetailResponse:
    """Return document metadata and chunk count."""
    return await service.get_document(document_id)


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a document and its chunks",
    responses={404: {"description": "Document not found"}},
)
async def delete_document(
    document_id: uuid.UUID,
    service: DocumentIngestionService = Depends(get_ingestion_service),
) -> None:
    """Delete a document; associated chunks are removed via cascade."""
    await service.delete_document(document_id)
