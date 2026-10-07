"""Database persistence tests for the ingestion service."""

from __future__ import annotations

from pathlib import Path

import pytest
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from app.core.config import get_settings
from app.db.models.chunk import Chunk
from app.db.models.document import Document
from app.db.session import AsyncSessionLocal
from app.ingestion.service import DocumentIngestionService

FIXTURES = Path(__file__).parent / "fixtures"


async def _database_is_available() -> bool:
    settings = get_settings()
    engine = create_async_engine(settings.database_url, pool_pre_ping=True)
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            return result.scalar_one() == 1
    except Exception:
        return False
    finally:
        await engine.dispose()


@pytest.fixture
async def session() -> AsyncSession:
    if not await _database_is_available():
        pytest.skip("PostgreSQL is not available")
    async with AsyncSessionLocal() as db:
        yield db


@pytest.mark.asyncio
async def test_persist_document_and_chunks(session: AsyncSession) -> None:
    service = DocumentIngestionService(session)
    content = (FIXTURES / "sample.txt").read_bytes() + b"\n\npersistence-marker-003\n"

    result = await service.ingest_bytes(content=content, filename="persist.txt")
    assert result.status == "ingested"
    assert result.chunk_count >= 1

    document = await session.get(Document, result.document_id)
    assert document is not None
    assert document.source == "persist.txt"

    chunk_count = await session.scalar(
        select(func.count()).select_from(Chunk).where(Chunk.document_id == document.id)
    )
    assert int(chunk_count or 0) == result.chunk_count

    await service.delete_document(document.id)


@pytest.mark.asyncio
async def test_delete_cascades_chunks(session: AsyncSession) -> None:
    service = DocumentIngestionService(session)
    content = (FIXTURES / "sample.txt").read_bytes() + b"\n\ncascade-marker-004\n"
    result = await service.ingest_bytes(content=content, filename="cascade.txt")
    document_id = result.document_id

    await service.delete_document(document_id)

    remaining = await session.scalar(
        select(func.count()).select_from(Chunk).where(Chunk.document_id == document_id)
    )
    assert int(remaining or 0) == 0
    assert await session.get(Document, document_id) is None
