"""Validate uploaded documents before parsing."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import PurePosixPath, PureWindowsPath

from app.core.config import Settings
from app.ingestion.exceptions import EmptyFileError, FileTooLargeError, UnsupportedFileTypeError

SUPPORTED_EXTENSIONS: frozenset[str] = frozenset(
    {".pdf", ".docx", ".txt", ".md", ".markdown"}
)

EXTENSION_TO_DOCUMENT_TYPE: dict[str, str] = {
    ".pdf": "pdf",
    ".docx": "docx",
    ".txt": "txt",
    ".md": "markdown",
    ".markdown": "markdown",
}


@dataclass(frozen=True, slots=True)
class FileValidationResult:
    """Safe, normalized metadata for a validated upload."""

    filename: str
    extension: str
    document_type: str
    size_bytes: int


def sanitize_filename(filename: str | None) -> str:
    """Return a basename-only filename; never trust user path segments."""
    if not filename or not filename.strip():
        raise EmptyFileError("Filename is missing.")

    # Strip directory components from both POSIX and Windows-style paths.
    name = PureWindowsPath(filename.replace("\x00", "")).name
    name = PurePosixPath(name).name
    name = name.strip()

    if not name or name in {".", ".."}:
        raise EmptyFileError("Filename is invalid.")

    # Cap extremely long filenames for safe metadata storage.
    if len(name) > 255:
        stem = PurePosixPath(name).stem[:200]
        suffix = PurePosixPath(name).suffix[:20]
        name = f"{stem}{suffix}"

    return name


def get_extension(filename: str) -> str:
    """Return a lowercase file extension including the leading dot."""
    suffix = PurePosixPath(filename).suffix.lower()
    if not suffix:
        raise UnsupportedFileTypeError("(none)")
    return suffix


def validate_upload(
    *,
    filename: str | None,
    content: bytes,
    settings: Settings,
    content_type: str | None = None,
) -> FileValidationResult:
    """Validate filename, extension, emptiness, and size limits."""
    safe_name = sanitize_filename(filename)
    extension = get_extension(safe_name)

    if extension not in SUPPORTED_EXTENSIONS:
        raise UnsupportedFileTypeError(extension)

    if not content:
        raise EmptyFileError("Uploaded file is empty.")

    max_size_bytes = settings.max_document_size_mb * 1024 * 1024
    size_bytes = len(content)
    if size_bytes > max_size_bytes:
        raise FileTooLargeError(size_bytes=size_bytes, max_size_bytes=max_size_bytes)

    # MIME type is advisory only; extension + parser decide compatibility.
    _ = content_type

    return FileValidationResult(
        filename=safe_name,
        extension=extension,
        document_type=EXTENSION_TO_DOCUMENT_TYPE[extension],
        size_bytes=size_bytes,
    )
