"""Central API router for versioned endpoints."""

from fastapi import APIRouter

from app.api import documents, health

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(documents.router)
