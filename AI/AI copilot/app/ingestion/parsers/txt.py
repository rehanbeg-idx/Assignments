"""Plain-text extraction with resilient decoding."""

from __future__ import annotations

from pathlib import PurePosixPath

from app.ingestion.exceptions import DocumentParsingError, EmptyFileError
from app.ingestion.parsers.base import DocumentParser
from app.ingestion.schemas import ParsedDocument, ParsedSection


class TXTParser(DocumentParser):
    """Parse UTF-8 (and common fallback encodings) plain-text files."""

    def parse(self, content: bytes, *, filename: str) -> ParsedDocument:
        text = _decode_bytes(content)
        # Preserve paragraph boundaries (blank-line separated).
        normalized = text.replace("\r\n", "\n").replace("\r", "\n")
        paragraphs = [p.strip() for p in normalized.split("\n\n") if p.strip()]

        if not paragraphs:
            # Single-block files without blank lines.
            stripped = normalized.strip()
            if not stripped:
                raise EmptyFileError("Text file contains no content.")
            paragraphs = [stripped]

        sections = [
            ParsedSection(
                text=paragraph,
                section_index=index,
                kind="paragraph",
            )
            for index, paragraph in enumerate(paragraphs)
        ]

        title = PurePosixPath(filename).stem or filename
        return ParsedDocument(
            title=title,
            source_filename=filename,
            document_type="txt",
            sections=sections,
            raw_text="\n\n".join(paragraphs),
            metadata={"paragraph_count": len(paragraphs)},
            warnings=[],
        )


def _decode_bytes(content: bytes) -> str:
    """Decode bytes trying UTF-8 first, then common fallbacks."""
    for encoding in ("utf-8-sig", "utf-8", "utf-16", "latin-1"):
        try:
            return content.decode(encoding)
        except UnicodeDecodeError:
            continue
    raise DocumentParsingError("Unable to decode text file with supported encodings.")
