"""Application exception hierarchy and FastAPI error handlers."""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.logging import get_logger

logger = get_logger(__name__)


class AppError(Exception):
    """Base application error."""

    def __init__(
        self,
        message: str,
        *,
        status_code: int = 500,
        code: str = "app_error",
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message
        self.status_code = status_code
        self.code = code
        self.details = details or {}
        super().__init__(message)


class NotFoundError(AppError):
    """Resource was not found."""

    def __init__(self, message: str = "Resource not found", **kwargs: Any) -> None:
        super().__init__(message, status_code=404, code="not_found", **kwargs)


class DatabaseError(AppError):
    """Database operation failed."""

    def __init__(self, message: str = "Database error", **kwargs: Any) -> None:
        super().__init__(message, status_code=503, code="database_error", **kwargs)


class ValidationAppError(AppError):
    """Application-level validation failure."""

    def __init__(self, message: str = "Validation error", **kwargs: Any) -> None:
        super().__init__(message, status_code=400, code="validation_error", **kwargs)


def register_exception_handlers(app: FastAPI) -> None:
    """Attach clean JSON error handlers to the FastAPI app."""

    @app.exception_handler(AppError)
    async def handle_app_error(_: Request, exc: AppError) -> JSONResponse:
        logger.warning("Application error [%s]: %s", exc.code, exc.message)
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                    "details": exc.details,
                }
            },
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(_: Request, exc: Exception) -> JSONResponse:
        # Log full detail server-side; keep the client response clean.
        logger.exception("Unhandled exception: %s", exc)
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "internal_server_error",
                    "message": "An unexpected error occurred.",
                    "details": {},
                }
            },
        )
