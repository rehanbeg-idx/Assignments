"""Markdown structure-aware extraction (no HTML conversion)."""

from __future__ import annotations

import re
from pathlib import PurePosixPath

from app.ingestion.exceptions import DocumentParsingError, EmptyFileError
from app.ingestion.parsers.base import DocumentParser
from app.ingestion.schemas import ParsedDocument, ParsedSection

_HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
_LIST_RE = re.compile(r"^(\s*)([-*+]|\d+\.)\s+(.+)$")


class MarkdownParser(DocumentParser):
    """Preserve headings, paragraphs, lists, and fenced code blocks."""

    def parse(self, content: bytes, *, filename: str) -> ParsedDocument:
        try:
            text = content.decode("utf-8-sig")
        except UnicodeDecodeError as exc:
            raise DocumentParsingError(
                "Unable to decode Markdown file as UTF-8."
            ) from exc

        text = text.replace("\r\n", "\n").replace("\r", "\n")
        if not text.strip():
            raise EmptyFileError("Markdown file contains no content.")

        sections: list[ParsedSection] = []
        heading_stack: list[tuple[int, str]] = []
        current_heading: str | None = None
        parent_heading: str | None = None
        section_index = 0
        buffer: list[str] = []
        in_code_block = False

        def flush_buffer(kind: str = "paragraph") -> None:
            nonlocal section_index, buffer
            block = "\n".join(buffer).strip()
            buffer = []
            if not block:
                return
            sections.append(
                ParsedSection(
                    text=block,
                    section_index=section_index,
                    heading=current_heading,
                    parent_heading=parent_heading,
                    kind=kind,
                )
            )
            section_index += 1

        for line in text.split("\n"):
            if line.strip().startswith("```"):
                if in_code_block:
                    buffer.append(line)
                    flush_buffer("code_block")
                    in_code_block = False
                else:
                    flush_buffer("paragraph")
                    in_code_block = True
                    buffer.append(line)
                continue

            if in_code_block:
                buffer.append(line)
                continue

            heading_match = _HEADING_RE.match(line)
            if heading_match:
                flush_buffer("paragraph")
                level = len(heading_match.group(1))
                heading_text = heading_match.group(2).strip()
                while heading_stack and heading_stack[-1][0] >= level:
                    heading_stack.pop()
                parent_heading = heading_stack[-1][1] if heading_stack else None
                heading_stack.append((level, heading_text))
                current_heading = heading_text
                sections.append(
                    ParsedSection(
                        text=heading_text,
                        section_index=section_index,
                        heading=current_heading,
                        parent_heading=parent_heading,
                        kind="heading",
                        metadata={"heading_level": level},
                    )
                )
                section_index += 1
                continue

            list_match = _LIST_RE.match(line)
            if list_match:
                # Keep list items as individual sections for cleaner chunking.
                flush_buffer("paragraph")
                item_text = list_match.group(3).strip()
                sections.append(
                    ParsedSection(
                        text=item_text,
                        section_index=section_index,
                        heading=current_heading,
                        parent_heading=parent_heading,
                        kind="list_item",
                    )
                )
                section_index += 1
                continue

            if not line.strip():
                flush_buffer("paragraph")
                continue

            buffer.append(line)

        flush_buffer("paragraph")

        if not sections:
            raise EmptyFileError("Markdown file contains no content.")

        title = (
            next((s.text for s in sections if s.kind == "heading"), None)
            or PurePosixPath(filename).stem
            or filename
        )

        return ParsedDocument(
            title=title,
            source_filename=filename,
            document_type="markdown",
            sections=sections,
            raw_text="\n\n".join(section.text for section in sections),
            metadata={"section_count": len(sections)},
            warnings=[],
        )
