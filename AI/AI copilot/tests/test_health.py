"""Tests for application health endpoints."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_app_loads() -> None:
    """FastAPI application object should be importable and titled."""
    from app.main import app

    assert app.title == "AI Customer Support Copilot"


@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient) -> None:
    """GET /api/v1/health should return status ok."""
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
