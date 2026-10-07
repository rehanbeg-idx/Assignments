"""Deterministic structure-aware chunking (character-based, no embeddings)."""

from __future__ import annotations

import re

from app.ingestion.chunkers.base import DocumentChunker
from app.ingestion.schemas import ParsedDocument, ParsedSection, PreparedChunk

_SENTENCE_SPLIT = re.compile(r"(?<=[.!?。？！])\s+")


class SemanticChunker(DocumentChunker):
    """Chunk by section → paragraph → sentence hierarchy using character limits.

    ``chunk_size`` and ``chunk_overlap`` are measured in **characters**.
    """

    def __init__(self, *, chunk_size: int, chunk_overlap: int) -> None:
        if chunk_size <= 0:
            raise ValueError("chunk_size must be > 0")
        if chunk_overlap < 0:
            raise ValueError("chunk_overlap must be >= 0")
        if chunk_overlap >= chunk_size:
            raise ValueError("chunk_overlap must be < chunk_size")
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk(self, document: ParsedDocument) -> list[PreparedChunk]:
        units = self._build_units(document.sections)
        if not units:
            return []

        chunks: list[PreparedChunk] = []
        current_parts: list[str] = []
        current_meta: dict = {
            "headings": set(),
            "parent_headings": set(),
            "page_numbers": set(),
            "section_indexes": [],
        }
        current_len = 0

        def flush() -> None:
            nonlocal current_parts, current_meta, current_len
            if not current_parts:
                return
            content = "\n\n".join(part for part in current_parts if part.strip()).strip()
            if not content:
                current_parts = []
                current_len = 0
                return

            metadata = {
                "source_filename": document.source_filename,
                "document_type": document.document_type,
                "char_count": len(content),
                "chunk_unit": "characters",
            }
            headings = sorted(current_meta["headings"])
            parents = sorted(current_meta["parent_headings"])
            pages = sorted(p for p in current_meta["page_numbers"] if p is not None)
            if headings:
                metadata["heading"] = headings[-1]
                if len(headings) > 1:
                    metadata["headings"] = headings
            if parents:
                metadata["parent_heading"] = parents[-1]
            if pages:
                metadata["page_number"] = pages[0]
                if len(pages) > 1:
                    metadata["page_numbers"] = pages
            if current_meta["section_indexes"]:
                metadata["section_indexes"] = list(current_meta["section_indexes"])

            chunks.append(
                PreparedChunk(
                    content=content,
                    chunk_index=len(chunks),
                    metadata=metadata,
                    char_count=len(content),
                )
            )

            if self.chunk_overlap > 0 and content:
                overlap_text = content[-self.chunk_overlap :].lstrip()
                current_parts = [overlap_text] if overlap_text else []
                current_len = len(overlap_text)
            else:
                current_parts = []
                current_len = 0

            current_meta = {
                "headings": set(),
                "parent_headings": set(),
                "page_numbers": set(),
                "section_indexes": [],
            }

        for unit_text, section in units:
            pieces = self._split_unit(unit_text)
            for piece in pieces:
                piece_len = len(piece)
                separator = 2 if current_parts else 0  # account for "\n\n"
                projected = current_len + separator + piece_len

                if current_parts and projected > self.chunk_size:
                    flush()
                    separator = 2 if current_parts else 0
                    projected = current_len + separator + piece_len
                    # If overlap residue still prevents fitting a normal piece,
                    # drop the residue and start a fresh chunk.
                    if current_parts and projected > self.chunk_size:
                        current_parts = []
                        current_len = 0
                        current_meta = {
                            "headings": set(),
                            "parent_headings": set(),
                            "page_numbers": set(),
                            "section_indexes": [],
                        }
                        separator = 0
                        projected = piece_len

                # Piece itself longer than chunk_size: hard-split without
                # carrying overlap between hard windows (avoids size blow-up).
                if piece_len > self.chunk_size:
                    if current_parts:
                        flush()
                    hard_pieces = self._hard_split(piece)
                    for index, hard_piece in enumerate(hard_pieces):
                        current_parts = [hard_piece]
                        current_len = len(hard_piece)
                        self._merge_meta(current_meta, section)
                        content = hard_piece
                        metadata = {
                            "source_filename": document.source_filename,
                            "document_type": document.document_type,
                            "char_count": len(content),
                            "chunk_unit": "characters",
                        }
                        if section.heading:
                            metadata["heading"] = section.heading
                        if section.parent_heading:
                            metadata["parent_heading"] = section.parent_heading
                        if section.page_number is not None:
                            metadata["page_number"] = section.page_number
                        metadata["section_indexes"] = [section.section_index]
                        chunks.append(
                            PreparedChunk(
                                content=content,
                                chunk_index=len(chunks),
                                metadata=metadata,
                                char_count=len(content),
                            )
                        )
                        current_parts = []
                        current_len = 0
                        current_meta = {
                            "headings": set(),
                            "parent_headings": set(),
                            "page_numbers": set(),
                            "section_indexes": [],
                        }
                        # Seed overlap only after the final hard window.
                        if index == len(hard_pieces) - 1 and self.chunk_overlap > 0:
                            overlap_text = content[-self.chunk_overlap :].lstrip()
                            if overlap_text:
                                current_parts = [overlap_text]
                                current_len = len(overlap_text)
                    continue

                current_parts.append(piece)
                current_len = projected
                self._merge_meta(current_meta, section)

        flush()

        # Ensure chunk indexes are contiguous after overlap handling.
        return [
            chunk.model_copy(update={"chunk_index": index})
            for index, chunk in enumerate(chunks)
        ]

    def _build_units(
        self,
        sections: list[ParsedSection],
    ) -> list[tuple[str, ParsedSection]]:
        """Convert sections into chunkable text units with heading context."""
        units: list[tuple[str, ParsedSection]] = []
        for section in sections:
            text = section.text.strip()
            if not text:
                continue
            if section.kind == "heading":
                # Headings are contextual; attach as a short unit so they
                # appear near following content when size allows.
                units.append((text, section))
                continue
            units.append((text, section))
        return units

    def _split_unit(self, text: str) -> list[str]:
        """Split oversized units by sentences, else return as-is."""
        if len(text) <= self.chunk_size:
            return [text]

        sentences = [s.strip() for s in _SENTENCE_SPLIT.split(text) if s.strip()]
        if len(sentences) <= 1:
            return [text]

        grouped: list[str] = []
        buffer = ""
        for sentence in sentences:
            candidate = f"{buffer} {sentence}".strip() if buffer else sentence
            if buffer and len(candidate) > self.chunk_size:
                grouped.append(buffer)
                buffer = sentence
            else:
                buffer = candidate
        if buffer:
            grouped.append(buffer)
        return grouped

    def _hard_split(self, text: str) -> list[str]:
        """Split text into fixed-size character windows with overlap awareness."""
        size = self.chunk_size
        step = max(1, size - self.chunk_overlap)
        pieces: list[str] = []
        start = 0
        length = len(text)
        while start < length:
            end = min(start + size, length)
            pieces.append(text[start:end])
            if end >= length:
                break
            start += step
        return pieces

    @staticmethod
    def _merge_meta(current_meta: dict, section: ParsedSection) -> None:
        if section.heading:
            current_meta["headings"].add(section.heading)
        if section.parent_heading:
            current_meta["parent_headings"].add(section.parent_heading)
        if section.page_number is not None:
            current_meta["page_numbers"].add(section.page_number)
        current_meta["section_indexes"].append(section.section_index)
