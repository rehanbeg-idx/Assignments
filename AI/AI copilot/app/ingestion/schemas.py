"""Internal Pydantic models for the ingestion pipeline."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class ParsedSection(BaseModel):
    """A structural unit extracted from a source document."""

    text: str
    section_index: int
    page_number: int | None = None
    heading: str | None = None
    parent_heading: str | None = None
    kind: str = "paragraph"
    metadata: dict[str, Any] = Field(default_factory=dict)


class ParsedDocument(BaseModel):
    """Structured output produced by a document parser."""

    title: str
    source_filename: str
    document_type: str
    sections: list[ParsedSection] = Field(default_factory=list)
    raw_text: str = ""
    metadata: dict[str, Any] = Field(default_factory=dict)
    warnings: list[str] = Field(default_factory=list)


class PreparedChunk(BaseModel):
    """Chunk ready for persistence (no embeddings in Phase 2)."""

    content: str
    chunk_index: int
    metadata: dict[str, Any] = Field(default_factory=dict)
    char_count: int = 0
