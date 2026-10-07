"""Centralized application settings via pydantic-settings."""

from functools import lru_cache

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables and .env."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "AI Customer Support Copilot"
    app_env: str = "development"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"

    database_url: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5432/support_copilot"
    )

    gemini_api_key: str = "Place your key here"
    gemini_model: str = "Place your Gemini model here"

    # Voyage AI embeddings (env: VOYAGE_API_KEY, VOYAGE_EMBEDDING_MODEL)
    voyage_api_key: str = "Place your key here"
    voyage_embedding_model: str = "Place your embedding model here"

    log_level: str = "INFO"

    # Connection pool settings (local-dev friendly defaults)
    db_pool_size: int = Field(default=5)
    db_max_overflow: int = Field(default=10)
    db_pool_timeout: int = Field(default=30)

    # Document ingestion (Phase 2)
    # CHUNK_SIZE / CHUNK_OVERLAP are measured in characters (not tokens).
    max_document_size_mb: int = Field(default=20, ge=1)
    chunk_size: int = Field(default=1000, ge=1)
    chunk_overlap: int = Field(default=150, ge=0)

    @model_validator(mode="after")
    def validate_chunk_configuration(self) -> "Settings":
        """Ensure overlap is valid relative to chunk size."""
        if self.chunk_overlap >= self.chunk_size:
            raise ValueError(
                "CHUNK_OVERLAP must be less than CHUNK_SIZE "
                f"(got overlap={self.chunk_overlap}, size={self.chunk_size})."
            )
        return self


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()
