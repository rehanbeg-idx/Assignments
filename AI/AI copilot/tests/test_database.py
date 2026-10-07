"""Tests for database connectivity health check.

Requires a running PostgreSQL instance (see docker-compose.yml).
"""

import pytest
from httpx import AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import get_settings


async def _database_is_available() -> bool:
    """Return True if DATABASE_URL accepts a SELECT 1."""
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


@pytest.mark.asyncio
async def test_database_health_endpoint(client: AsyncClient) -> None:
    """GET /api/v1/health/db should succeed when PostgreSQL is running."""
    if not await _database_is_available():
        pytest.skip("PostgreSQL is not available; start it with docker compose up -d")

    response = await client.get("/api/v1/health/db")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["database"] == "connected"
