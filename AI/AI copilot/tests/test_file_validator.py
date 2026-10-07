"""Tests for upload file validation."""

from pathlib import Path

import pytest

from app.core.config import Settings
from app.ingestion.exceptions import EmptyFileError, FileTooLargeError, UnsupportedFileTypeError
from app.ingestion.validators.file_validator import sanitize_filename, validate_upload

FIXTURES = Path(__file__).parent / "fixtures"


@pytest.fixture
def settings() -> Settings:
    return Settings(
        max_document_size_mb=1,
        chunk_size=1000,
        chunk_overlap=150,
    )


def test_validate_txt(settings: Settings) -> None:
    content = (FIXTURES / "sample.txt").read_bytes()
    result = validate_upload(filename="sample.txt", content=content, settings=settings)
    assert result.document_type == "txt"
    assert result.extension == ".txt"


def test_validate_md(settings: Settings) -> None:
    content = (FIXTURES / "sample.md").read_bytes()
    result = validate_upload(filename="sample.md", content=content, settings=settings)
    assert result.document_type == "markdown"


def test_validate_docx(settings: Settings) -> None:
    content = (FIXTURES / "sample.docx").read_bytes()
    result = validate_upload(filename="sample.docx", content=content, settings=settings)
    assert result.document_type == "docx"


def test_validate_pdf(settings: Settings) -> None:
    content = (FIXTURES / "sample.pdf").read_bytes()
    result = validate_upload(filename="sample.pdf", content=content, settings=settings)
    assert result.document_type == "pdf"


def test_uppercase_extension(settings: Settings) -> None:
    content = (FIXTURES / "sample.txt").read_bytes()
    result = validate_upload(filename="NOTES.TXT", content=content, settings=settings)
    assert result.extension == ".txt"


def test_unsupported_extension(settings: Settings) -> None:
    with pytest.raises(UnsupportedFileTypeError, match=r"\.xlsx"):
        validate_upload(filename="sheet.xlsx", content=b"data", settings=settings)


def test_empty_file(settings: Settings) -> None:
    with pytest.raises(EmptyFileError):
        validate_upload(filename="empty.txt", content=b"", settings=settings)


def test_oversized_file(settings: Settings) -> None:
    content = b"x" * (settings.max_document_size_mb * 1024 * 1024 + 1)
    with pytest.raises(FileTooLargeError):
        validate_upload(filename="big.txt", content=content, settings=settings)


def test_path_components_stripped(settings: Settings) -> None:
    content = b"hello"
    result = validate_upload(
        filename=r"..\..\evil\refund policy.txt",
        content=content,
        settings=settings,
    )
    assert result.filename == "refund policy.txt"
    assert ".." not in result.filename


def test_sanitize_rejects_blank_name() -> None:
    with pytest.raises(EmptyFileError):
        sanitize_filename("   ")
