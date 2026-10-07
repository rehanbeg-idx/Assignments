"""Health check response schemas."""

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Application liveness response."""

    status: str = Field(examples=["ok"])


class DatabaseHealthResponse(BaseModel):
    """Database connectivity response."""

    status: str = Field(examples=["ok"])
    database: str = Field(examples=["connected"])
