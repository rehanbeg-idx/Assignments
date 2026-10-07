"""PDF text extraction using pypdf (no OCR)."""

from __future__ import annotations

from io import BytesIO
from pathlib import PurePosixPath

from pypdf import PdfReader
from pypdf.errors import PdfReadError

from app.ingestion.exceptions import DocumentParsingError
from app.ingestion.parsers.base import DocumentParser
from app.ingestion.schemas import ParsedDocument, ParsedSection


class PDFParser(DocumentParser):
    """Extract per-page text from PDF documents."""

    def parse(self, content: bytes, *, filename: str) -> ParsedDocument:
        try:
            reader = PdfReader(BytesIO(content))
        except PdfReadError as exc:
            raise DocumentParsingError(f"Malformed or unreadable PDF: {filename}") from exc
        except Exception as exc:  # noqa: BLE001 - surface as parsing error
            raise DocumentParsingError(f"Failed to open PDF: {filename}") from exc

        sections: list[ParsedSection] = []
        warnings: list[str] = []
        empty_pages = 0
        section_index = 0

        for page_number, page in enumerate(reader.pages, start=1):
            try:
                page_text = page.extract_text() or ""
            except Exception:  # noqa: BLE001
                page_text = ""
                warnings.append(f"Page {page_number} could not be parsed.")

            page_text = page_text.strip()
            if not page_text:
                empty_pages += 1
                warnings.append(f"Page {page_number} contained no extractable text.")
                continue

            # Split page text into paragraphs while retaining page metadata.
            paragraphs = [p.strip() for p in page_text.split("\n\n") if p.strip()]
            if not paragraphs:
                paragraphs = [page_text]

            for paragraph in paragraphs:
                sections.append(
                    ParsedSection(
                        text=paragraph,
                        section_index=section_index,
                        page_number=page_number,
                        kind="paragraph",
                        metadata={"page_number": page_number},
                    )
                )
                section_index += 1

        if not sections:
            raise DocumentParsingError(
                "PDF contains no extractable text. "
                "It may be scanned or image-based (OCR is not enabled in Phase 2)."
            )

        title = PurePosixPath(filename).stem or filename
        raw_text = "\n\n".join(section.text for section in sections)

        metadata = {
            "page_count": len(reader.pages),
            "empty_page_count": empty_pages,
        }

        return ParsedDocument(
            title=title,
            source_filename=filename,
            document_type="pdf",
            sections=sections,
            raw_text=raw_text,
            metadata=metadata,
            warnings=warnings,
        )
