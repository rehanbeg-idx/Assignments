"""Deterministic text normalization and cleaning (no LLM rewriting)."""

from __future__ import annotations

import re
import unicodedata

from app.ingestion.schemas import ParsedDocument, ParsedSection

_CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
_HORIZONTAL_WHITESPACE = re.compile(r"[^\S\n]+")
_EXCESS_BLANK_LINES = re.compile(r"\n{3,}")


class TextCleaner:
    """Normalize and lightly clean extracted document text."""

    def clean_text(self, text: str) -> str:
        """Normalize line endings/whitespace without collapsing paragraphs."""
        if not text:
            return ""

        # Unicode normalize; preserve non-Latin scripts as-is.
        normalized = unicodedata.normalize("NFC", text)
        normalized = normalized.replace("\r\n", "\n").replace("\r", "\n")
        normalized = _CONTROL_CHARS.sub("", normalized)
        normalized = normalized.replace("\ufeff", "")
        normalized = _HORIZONTAL_WHITESPACE.sub(" ", normalized)

        lines = [line.rstrip() for line in normalized.split("\n")]
        normalized = "\n".join(lines)
        normalized = _EXCESS_BLANK_LINES.sub("\n\n", normalized)
        return normalized.strip()

    def clean_section(self, section: ParsedSection) -> ParsedSection | None:
        """Clean a section; drop it if nothing meaningful remains."""
        cleaned_text = self.clean_text(section.text)
        if not cleaned_text:
            return None

        heading = self.clean_text(section.heading) if section.heading else None
        parent = (
            self.clean_text(section.parent_heading) if section.parent_heading else None
        )
        return section.model_copy(
            update={
                "text": cleaned_text,
                "heading": heading or None,
                "parent_heading": parent or None,
            }
        )


def clean_parsed_document(document: ParsedDocument) -> ParsedDocument:
    """Apply cleaning to all sections and rebuild raw_text."""
    cleaner = TextCleaner()
    cleaned_sections: list[ParsedSection] = []
    for index, section in enumerate(document.sections):
        cleaned = cleaner.clean_section(section)
        if cleaned is None:
            continue
        cleaned_sections.append(
            cleaned.model_copy(update={"section_index": index})
        )

    # Re-index after dropping empty sections.
    reindexed = [
        section.model_copy(update={"section_index": i})
        for i, section in enumerate(cleaned_sections)
    ]
    raw_parts: list[str] = []
    for section in reindexed:
        if section.heading and (
            not raw_parts or section.heading not in raw_parts[-1:]
        ):
            # Heading lines are stored on sections; include once in raw text.
            if section.kind == "heading":
                raw_parts.append(section.text)
            else:
                raw_parts.append(section.text)
        else:
            raw_parts.append(section.text)

    raw_text = cleaner.clean_text("\n\n".join(raw_parts))
    title = cleaner.clean_text(document.title) or document.source_filename

    return document.model_copy(
        update={
            "title": title,
            "sections": reindexed,
            "raw_text": raw_text,
        }
    )
