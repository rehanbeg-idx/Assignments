"""Centralized application logging configuration."""

from __future__ import annotations

import logging
import sys

from app.core.config import Settings


def setup_logging(settings: Settings) -> None:
    """Configure root logging for the application.

    Never log secrets (API keys, database passwords, tokens, or PII).
    """
    log_level = getattr(logging, settings.log_level.upper(), logging.INFO)

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )

    # Keep noisy third-party loggers quieter in development
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if settings.debug else logging.WARNING
    )


def get_logger(name: str) -> logging.Logger:
    """Return a named logger."""
    return logging.getLogger(name)
