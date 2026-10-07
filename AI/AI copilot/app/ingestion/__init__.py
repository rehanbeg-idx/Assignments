"""Document ingestion pipeline (Phase 2).

Embeddings are intentionally not generated here.
"""

from app.ingestion.service import DocumentIngestionService, compute_content_hash

__all__ = ["DocumentIngestionService", "compute_content_hash"]
