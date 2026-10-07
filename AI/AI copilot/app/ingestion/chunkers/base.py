"""Chunker interface."""

from __future__ import annotations

from abc import ABC, abstractmethod

from app.ingestion.schemas import ParsedDocument, PreparedChunk


class DocumentChunker(ABC):
    """Split a parsed document into retrieval-ready chunks."""

    @abstractmethod
    def chunk(self, document: ParsedDocument) -> list[PreparedChunk]:
        """Return ordered chunks for the given document."""
