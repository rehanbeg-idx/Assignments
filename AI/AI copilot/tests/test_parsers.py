"""Tests for document parsers."""

from pathlib import Path

import pytest

from app.ingestion.exceptions import DocumentParsingError, EmptyFileError, UnsupportedFileTypeError
from app.ingestion.parsers import get_parser
from app.ingestion.parsers.docx import DOCXParser
from app.ingestion.parsers.markdown import MarkdownParser
from app.ingestion.parsers.pdf import PDFParser
from app.ingestion.parsers.txt import TXTParser

FIXTURES = Path(__file__).parent / "fixtures"


def test_txt_parser_preserves_paragraphs_and_unicode() -> None:
    content = (FIXTURES / "sample.txt").read_bytes()
    parsed = TXTParser().parse(content, filename="sample.txt")
    assert parsed.document_type == "txt"
    assert len(parsed.sections) >= 3
    assert "नमस्ते" in parsed.raw_text
    assert "Refund Policy" in parsed.raw_text


def test_txt_crlf_line_endings() -> None:
    content = b"Line one\r\n\r\nLine two\r\n"
    parsed = TXTParser().parse(content, filename="crlf.txt")
    assert len(parsed.sections) == 2
    assert parsed.sections[0].text == "Line one"


def test_markdown_parser_headings_and_lists() -> None:
    content = (FIXTURES / "sample.md").read_bytes()
    parsed = MarkdownParser().parse(content, filename="sample.md")
    headings = [s for s in parsed.sections if s.kind == "heading"]
    assert headings
    assert any(s.heading == "API Keys" for s in parsed.sections if s.kind != "heading")
    assert any(s.parent_heading == "Authentication" for s in parsed.sections)
    assert "नमस्ते" in parsed.raw_text


def test_docx_parser_structure() -> None:
    content = (FIXTURES / "sample.docx").read_bytes()
    parsed = DOCXParser().parse(content, filename="sample.docx")
    assert parsed.title.startswith("Customer Support")
    assert any(s.kind == "heading" for s in parsed.sections)
    assert any(s.heading == "Refund Policy" for s in parsed.sections)


def test_pdf_parser_extracts_text() -> None:
    content = (FIXTURES / "sample.pdf").read_bytes()
    parsed = PDFParser().parse(content, filename="sample.pdf")
    assert parsed.document_type == "pdf"
    assert "Authentication" in parsed.raw_text
    assert parsed.sections[0].page_number == 1


def test_pdf_no_extractable_text() -> None:
    # Minimal empty-page PDF
    empty_pdf = b"""%PDF-1.4
1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj
2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj
3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer<< /Size 4 /Root 1 0 R >>
startxref
196
%%EOF"""
    with pytest.raises(DocumentParsingError, match="no extractable text"):
        PDFParser().parse(empty_pdf, filename="blank.pdf")


def test_empty_markdown() -> None:
    with pytest.raises(EmptyFileError):
        MarkdownParser().parse(b"   \n\n", filename="empty.md")


def test_parser_registry() -> None:
    assert isinstance(get_parser(".pdf"), PDFParser)
    assert isinstance(get_parser(".MD"), MarkdownParser)
    with pytest.raises(UnsupportedFileTypeError):
        get_parser(".xlsx")
