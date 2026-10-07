"""Health check endpoints."""

from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import DatabaseError
from app.core.logging import get_logger
from app.db.session import get_db_session
from app.schemas.health import DatabaseHealthResponse, HealthResponse

router = APIRouter()
logger = get_logger(__name__)


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Application health check",
)
async def health_check() -> HealthResponse:
    """Return a simple OK status indicating the API process is running."""
    return HealthResponse(status="ok")


@router.get(
    "/health/db",
    response_model=DatabaseHealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Database connectivity health check",
)
async def database_health_check(
    session: AsyncSession = Depends(get_db_session),
) -> DatabaseHealthResponse:
    """Verify database connectivity with a lightweight SELECT 1 query."""
    try:
        result = await session.execute(text("SELECT 1"))
        value = result.scalar_one()
        if value != 1:
            raise DatabaseError("Unexpected database health check result.")
    except DatabaseError:
        raise
    except Exception as exc:
        logger.error("Database health check failed: %s", exc)
        raise DatabaseError(
            "Database is unavailable.",
            details={"reason": "connectivity_check_failed"},
        ) from exc

    return DatabaseHealthResponse(status="ok", database="connected")
