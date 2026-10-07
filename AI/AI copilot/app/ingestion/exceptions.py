"""Ingestion-specific exceptions mapped to HTTP via AppError handlers."""

from __future__ import annotations

from typing import Any

from app.core.exceptions import AppError


class IngestionError(AppError):
    """Base ingestion error."""

    def __init__(
        self,
        message: str,
        *,
        status_code: int = 400,
        code: str = "ingestion_error",
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(
            message,
            status_code=status_code,
            code=code,
            details=details,
        )


class UnsupportedFileTypeError(IngestionError):
    """Uploaded file extension is not supported."""

    def __init__(self, extension: str) -> None:
        super().__init__(
            f"Unsupported file type: {extension}",
            status_code=400,
            code="unsupported_file_type",
            details={"extension": extension},
        )


class FileTooLargeError(IngestionError):
    """Uploaded file exceeds the configured size limit."""

    def __init__(self, size_bytes: int, max_size_bytes: int) -> None:
        super().__init__(
            "File exceeds the maximum allowed size.",
            status_code=413,
            code="file_too_large",
            details={
                "size_bytes": size_bytes,
                "max_size_bytes": max_size_bytes,
            },
        )


class EmptyFileError(IngestionError):
    """Uploaded file is empty or contains only whitespace."""

    def __init__(self, message: str = "Uploaded file is empty.") -> None:
        super().__init__(message, status_code=400, code="empty_file")


class DocumentParsingError(IngestionError):
    """Parser failed to extract usable content."""

    def __init__(self, message: str = "Failed to parse document.") -> None:
        super().__init__(message, status_code=422, code="document_parsing_error")


class DocumentAlreadyExistsError(IngestionError):
    """Document with the same content hash already exists."""

    def __init__(
        self,
        message: str = "Document already exists.",
        *,
        document_id: str | None = None,
    ) -> None:
        details: dict[str, Any] = {}
        if document_id is not None:
            details["document_id"] = document_id
        super().__init__(
            message,
            status_code=409,
            code="document_already_exists",
            details=details,
        )


class InvalidDocumentError(IngestionError):
    """Document content is invalid after parsing/cleaning."""

    def __init__(self, message: str = "Document content is invalid.") -> None:
        super().__init__(message, status_code=422, code="invalid_document")
