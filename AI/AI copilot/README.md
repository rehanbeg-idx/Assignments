# AI Customer Support Copilot

Backend for an AI-powered customer support copilot. The system will eventually ingest support documents, retrieve relevant chunks with hybrid search, and generate cited answers with Gemini — orchestrated via LangGraph.

## Current phase

**Phase 2 — Document ingestion** (built on completed Phase 1)

- Upload and ingest PDF, DOCX, TXT, and Markdown
- Validation, extraction, cleaning, structure-aware chunking
- SHA-256 duplicate detection
- Persist documents + chunks in PostgreSQL
- Document list / detail / delete APIs

**Embeddings are not generated during Phase 2.**

## Architecture (current)

```
Upload → Validate → Parse → Normalize/Clean → Hash → Deduplicate
      → Semantic chunk (characters) → PostgreSQL (documents + chunks)
```

```
Client → FastAPI (/api/v1/...) → Health + Documents routes
                              → Ingestion service
                              → Async SQLAlchemy → PostgreSQL (+ pgvector extension)
```

## Prerequisites

- Python 3.12+
- Local PostgreSQL (Windows install is fine)
- Git (optional)

## Setup (Windows / PowerShell)

### 1. Create and activate a virtual environment

```powershell
cd "c:\Assignments\AI\AI copilot"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 2. Install dependencies

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configure `.env`

```
DATABASE_URL="postgresql+asyncpg://postgres:YOUR_PASSWORD@localhost:5432/support_copilot"

MAX_DOCUMENT_SIZE_MB=20
CHUNK_SIZE=1000
CHUNK_OVERLAP=150
```

`CHUNK_SIZE` and `CHUNK_OVERLAP` are measured in **characters** (not tokens).

### 4. Prepare local PostgreSQL

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE support_copilot;"
alembic upgrade head
```

### 5. Start FastAPI

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 6. Run tests

```powershell
pytest -v
```

Database-backed tests skip automatically if PostgreSQL is unreachable.

## Phase 2 — Document ingestion

### Supported types

| Extension | Type |
|-----------|------|
| `.pdf` | PDF (text extraction; no OCR) |
| `.docx` | Word |
| `.txt` | Plain text |
| `.md`, `.markdown` | Markdown |

Unsupported types (e.g. `.xlsx`) are rejected with a clear error.

### Ingestion flow

1. File validation (extension, emptiness, size)
2. Parser selection via registry
3. Extraction into structured sections
4. Text normalization / cleaning (deterministic; no LLM)
5. SHA-256 hash of normalized content
6. Duplicate check (`content_hash` unique)
7. Structure-aware chunking
8. Transactional persistence of document + chunks

### Chunking strategy

- Deterministic, structure-aware (headings → sections → paragraphs → sentences)
- **Not** embedding-based
- Size unit: **characters**
- Defaults: `CHUNK_SIZE=1000`, `CHUNK_OVERLAP=150`
- Overlap must be `< CHUNK_SIZE` (validated at settings load)

### Duplicate detection

Normalized document text → SHA-256 → `documents.content_hash`.  
Re-uploading the same content returns `status="duplicate"` without inserting new rows.

### Upload example

```powershell
curl.exe -X POST "http://localhost:8000/api/v1/documents" -F "file=@.\tests\fixtures\sample.txt"
```

### Delete example

```powershell
curl.exe -X DELETE "http://localhost:8000/api/v1/documents/<document_id>"
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | App name + helpful links |
| GET | `/api/v1/health` | API liveness |
| GET | `/api/v1/health/db` | DB connectivity check |
| POST | `/api/v1/documents` | Ingest upload (`multipart/form-data`) |
| GET | `/api/v1/documents` | List documents (`limit`, `offset`) |
| GET | `/api/v1/documents/{document_id}` | Document details + chunk count |
| DELETE | `/api/v1/documents/{document_id}` | Delete document and cascaded chunks |

## Project layout

```
app/
  main.py
  core/                   # Settings, logging, exceptions
  db/                     # Engine, session, models
  api/                    # health + documents routers
  schemas/                # API response models
  ingestion/
    service.py            # Orchestration
    parsers/              # PDF, DOCX, TXT, Markdown
    cleaners/             # Text normalization
    chunkers/             # Structure-aware chunking
    validators/           # Upload validation
  embeddings/             # Phase 3+
  retrieval/              # Phases 4–6
  ...
tests/
  fixtures/               # Synthetic sample documents
```

## Intentionally not implemented yet

- Voyage AI embeddings / vector columns
- Vector search, BM25, RRF, reranking
- Gemini LLM calls
- LangGraph orchestration
- Conversation APIs
- Safety / escalation
- Evaluation harness
- OCR for scanned PDFs
- Frontend, Redis, Celery, auth, cloud deployment

## Notes

- Embedding dimension is **not** hardcoded; the `chunks` table has no vector column until Phase 3.
- Gemini is the only planned LLM; Voyage AI is the only planned embedding provider.
- Put secrets only in `.env` (gitignored). Do not paste secrets into chat.
