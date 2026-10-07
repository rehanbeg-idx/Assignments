"""Tests for text cleaning, hashing, and semantic chunking."""

import pytest
from pydantic import ValidationError

from app.core.config import Settings
from app.ingestion.chunkers.semantic import SemanticChunker
from app.ingestion.cleaners.text_cleaner import TextCleaner, clean_parsed_document
from app.ingestion.schemas import ParsedDocument, ParsedSection
from app.ingestion.service import compute_content_hash


def test_cleaner_whitespace_and_control_chars() -> None:
    cleaner = TextCleaner()
    raw = "Hello\x00   world\r\n\r\n\r\nNext\tline  "
    cleaned = cleaner.clean_text(raw)
    assert "\x00" not in cleaned
    assert "\r" not in cleaned
    assert "Hello world" in cleaned
    assert "\n\n\n" not in cleaned
    assert cleaned.endswith("Next line")


def test_cleaner_preserves_paragraph_boundaries() -> None:
    text = "Refund Policy\n\nCustomers can request a refund within 30 days."
    cleaned = TextCleaner().clean_text(text)
    assert "\n\n" in cleaned
    assert "Refund Policy Customers" not in cleaned


def test_clean_parsed_document_drops_empty_sections() -> None:
    document = ParsedDocument(
        title="Doc",
        source_filename="doc.txt",
        document_type="txt",
        sections=[
            ParsedSection(text="Keep me", section_index=0),
            ParsedSection(text="   ", section_index=1),
        ],
    )
    cleaned = clean_parsed_document(document)
    assert len(cleaned.sections) == 1
    assert cleaned.sections[0].section_index == 0


def test_chunk_small_document() -> None:
    document = ParsedDocument(
        title="Small",
        source_filename="small.txt",
        document_type="txt",
        sections=[ParsedSection(text="Short content.", section_index=0)],
        raw_text="Short content.",
    )
    chunks = SemanticChunker(chunk_size=1000, chunk_overlap=150).chunk(document)
    assert len(chunks) == 1
    assert chunks[0].chunk_index == 0


def test_chunk_exact_size() -> None:
    text = "a" * 100
    document = ParsedDocument(
        title="Exact",
        source_filename="exact.txt",
        document_type="txt",
        sections=[ParsedSection(text=text, section_index=0)],
        raw_text=text,
    )
    chunks = SemanticChunker(chunk_size=100, chunk_overlap=10).chunk(document)
    assert len(chunks) == 1
    assert len(chunks[0].content) == 100


def test_chunk_larger_than_size_with_overlap() -> None:
    paragraphs = [f"Paragraph {i}. " + ("word " * 20) for i in range(10)]
    document = ParsedDocument(
        title="Large",
        source_filename="large.txt",
        document_type="txt",
        sections=[
            ParsedSection(text=p.strip(), section_index=i) for i, p in enumerate(paragraphs)
        ],
        raw_text="\n\n".join(paragraphs),
    )
    chunker = SemanticChunker(chunk_size=200, chunk_overlap=40)
    chunks = chunker.chunk(document)
    assert len(chunks) > 1
    # Overlap seeds the next chunk from the previous chunk's trailing characters.
    previous_tail = chunks[0].content[-40:].lstrip()
    assert previous_tail[:10] in chunks[1].content



def test_heading_metadata_preserved() -> None:
    document = ParsedDocument(
        title="Policy",
        source_filename="policy.md",
        document_type="markdown",
        sections=[
            ParsedSection(
                text="Refund Policy",
                section_index=0,
                heading="Refund Policy",
                kind="heading",
            ),
            ParsedSection(
                text="Customers can request a refund within 30 days of purchase.",
                section_index=1,
                heading="Refund Policy",
                parent_heading="Customer Policies",
                kind="paragraph",
            ),
        ],
    )
    chunks = SemanticChunker(chunk_size=1000, chunk_overlap=50).chunk(document)
    assert chunks
    assert chunks[0].metadata.get("heading") == "Refund Policy"
    assert chunks[0].metadata.get("parent_heading") == "Customer Policies"


def test_very_long_paragraph_is_split() -> None:
    text = ("Sentence number. " * 200).strip()
    document = ParsedDocument(
        title="Long",
        source_filename="long.txt",
        document_type="txt",
        sections=[ParsedSection(text=text, section_index=0)],
        raw_text=text,
    )
    chunks = SemanticChunker(chunk_size=120, chunk_overlap=20).chunk(document)
    assert len(chunks) > 1
    assert all(len(c.content) <= 120 for c in chunks)


def test_invalid_chunker_config() -> None:
    with pytest.raises(ValueError):
        SemanticChunker(chunk_size=100, chunk_overlap=100)


def test_settings_rejects_overlap_ge_size() -> None:
    with pytest.raises(ValidationError):
        Settings(chunk_size=100, chunk_overlap=100)


def test_duplicate_hash_stable() -> None:
    text = "Normalized content for hashing."
    assert compute_content_hash(text) == compute_content_hash(text)
    assert compute_content_hash(text) != compute_content_hash(text + "x")
