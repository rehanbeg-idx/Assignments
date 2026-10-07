"""Document parsers and registry."""

from __future__ import annotations

from app.ingestion.exceptions import UnsupportedFileTypeError
from app.ingestion.parsers.base import DocumentParser
from app.ingestion.parsers.docx import DOCXParser
from app.ingestion.parsers.markdown import MarkdownParser
from app.ingestion.parsers.pdf import PDFParser
from app.ingestion.parsers.txt import TXTParser

_PARSER_REGISTRY: dict[str, DocumentParser] = {
    ".pdf": PDFParser(),
    ".docx": DOCXParser(),
    ".txt": TXTParser(),
    ".md": MarkdownParser(),
    ".markdown": MarkdownParser(),
}


def get_parser(extension: str) -> DocumentParser:
    """Return the parser registered for a lowercase extension."""
    parser = _PARSER_REGISTRY.get(extension.lower())
    if parser is None:
        raise UnsupportedFileTypeError(extension)
    return parser


__all__ = [
    "DocumentParser",
    "DOCXParser",
    "MarkdownParser",
    "PDFParser",
    "TXTParser",
    "get_parser",
]
