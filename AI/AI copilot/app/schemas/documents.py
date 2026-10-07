"""API schemas for document ingestion and management."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class IngestionResponse(BaseModel):
    """Result of a document upload/ingestion attempt."""

    document_id: uuid.UUID
    filename: str
    status: Literal["ingested", "duplicate"]
    chunk_count: int = Field(ge=0)
    duplicate: bool
    warnings: list[str] = Field(default_factory=list)


class DocumentSummary(BaseModel):
    """Lightweight document listing item."""

    id: uuid.UUID
    title: str
    source: str
    document_type: str
    chunk_count: int = 0
    created_at: datetime
    updated_at: datetime


class DocumentListResponse(BaseModel):
    """Paginated document list."""

    items: list[DocumentSummary]
    total: int
    limit: int
    offset: int


class DocumentDetailResponse(BaseModel):
    """Document metadata without full chunk payloads."""

    id: uuid.UUID
    title: str
    source: str
    document_type: str
    content_hash: str
    metadata: dict[str, Any] = Field(default_factory=dict)
    chunk_count: int = 0
    created_at: datetime
    updated_at: datetime
