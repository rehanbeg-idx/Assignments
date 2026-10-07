"""API tests for document ingestion endpoints.

Database-backed tests skip automatically when PostgreSQL is unavailable.
"""

from __future__ import annotations

from pathlib import Path

import pytest
from httpx import AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import Settings, get_settings

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
async def db_ready() -> None:
    if not await _database_is_available():
        pytest.skip("PostgreSQL is not available")


@pytest.mark.asyncio
async def test_upload_unsupported_file(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/documents",
        files={"file": ("notes.xlsx", b"not-excel", "application/octet-stream")},
    )
    assert response.status_code == 400
    body = response.json()
    assert body["error"]["code"] == "unsupported_file_type"


@pytest.mark.asyncio
async def test_upload_empty_file(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/documents",
        files={"file": ("empty.txt", b"", "text/plain")},
    )
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "empty_file"


@pytest.mark.asyncio
async def test_upload_oversized_file(
    client: AsyncClient,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    tiny = Settings(
        database_url=get_settings().database_url,
        max_document_size_mb=1,
        chunk_size=1000,
        chunk_overlap=150,
    )
    monkeypatch.setattr("app.ingestion.service.get_settings", lambda: tiny)

    content = b"x" * (2 * 1024 * 1024)
    response = await client.post(
        "/api/v1/documents",
        files={"file": ("big.txt", content, "text/plain")},
    )
    assert response.status_code == 413
    assert response.json()["error"]["code"] == "file_too_large"


@pytest.mark.asyncio
async def test_ingest_list_detail_delete_and_duplicate(
    client: AsyncClient,
    db_ready: None,
) -> None:
    content = (FIXTURES / "sample.txt").read_bytes()
    unique_suffix = "phase2-api-unique-marker-001"
    payload = content + f"\n\n{unique_suffix}\n".encode()

    create = await client.post(
        "/api/v1/documents",
        files={"file": ("support-notes.txt", payload, "text/plain")},
    )
    assert create.status_code == 201, create.text
    body = create.json()
    assert body["status"] == "ingested"
    assert body["duplicate"] is False
    assert body["chunk_count"] >= 1
    document_id = body["document_id"]

    duplicate = await client.post(
        "/api/v1/documents",
        files={"file": ("support-notes-copy.txt", payload, "text/plain")},
    )
    assert duplicate.status_code == 200
    dup_body = duplicate.json()
    assert dup_body["duplicate"] is True
    assert dup_body["status"] == "duplicate"
    assert dup_body["document_id"] == document_id

    listing = await client.get("/api/v1/documents")
    assert listing.status_code == 200
    assert listing.json()["total"] >= 1
    assert any(item["id"] == document_id for item in listing.json()["items"])

    detail = await client.get(f"/api/v1/documents/{document_id}")
    assert detail.status_code == 200
    detail_body = detail.json()
    assert detail_body["source"] == "support-notes.txt"
    assert detail_body["chunk_count"] == body["chunk_count"]
    assert "content_hash" in detail_body

    deleted = await client.delete(f"/api/v1/documents/{document_id}")
    assert deleted.status_code == 204

    missing = await client.get(f"/api/v1/documents/{document_id}")
    assert missing.status_code == 404


@pytest.mark.asyncio
async def test_ingest_markdown_when_db_available(
    client: AsyncClient,
    db_ready: None,
) -> None:
    content = (FIXTURES / "sample.md").read_bytes()
    payload = content + b"\n\nUnique markdown marker phase2-md-002\n"
    response = await client.post(
        "/api/v1/documents",
        files={"file": ("guide.md", payload, "text/markdown")},
    )
    assert response.status_code == 201
    document_id = response.json()["document_id"]
    await client.delete(f"/api/v1/documents/{document_id}")
