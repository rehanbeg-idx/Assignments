"""Common parser interface for document extraction."""

from __future__ import annotations

from abc import ABC, abstractmethod

from app.ingestion.schemas import ParsedDocument


class DocumentParser(ABC):
    """Parse binary document bytes into a structured ParsedDocument."""

    @abstractmethod
    def parse(self, content: bytes, *, filename: str) -> ParsedDocument:
        """Extract structured content from raw file bytes."""
