# AI PPT Maker

AI-powered web app: describe a presentation in natural language → get an editable, exportable `.pptx`.

## Features

- 💬 Natural language input → multi-slide presentation
- 📋 Per-slide editable prompt cards with ↺ regenerate
- 👁 Live HTML/CSS slide preview with click-to-edit
- 📦 Export to `.pptx` via python-pptx
- 🕐 Local history (IndexedDB, no account needed)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python) |
| AI | Claude API (Anthropic) |
| PPT Export | python-pptx |
| Storage | localStorage (deviceId) + IndexedDB |

## Quick Start

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # add your ANTHROPIC_API_KEY
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # adjust API URL if needed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Running Tests

```bash
# Backend
cd backend && source .venv/bin/activate && python -m pytest -v

# Frontend
cd frontend && npm test
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/outline` | Natural language → slide outline |
| POST | `/api/generate` | Outline → streaming SlideJSON (SSE) |
| POST | `/api/regenerate/{id}` | Regenerate a single slide |
| POST | `/api/export` | SlideJSON[] → `.pptx` download |
| GET | `/health` | Health check |

## Project Structure

```
ai_ppt_maker/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── models.py            # Pydantic models
│   ├── prompts.py           # Claude prompt templates
│   ├── routers/             # outline, generate, regenerate, export
│   ├── services/            # claude_client, pptx_builder
│   └── tests/
├── frontend/
│   └── src/
│       ├── app/             # Next.js App Router
│       ├── components/      # layout, left, right, shared
│       ├── lib/             # api, db, deviceId
│       ├── store/           # Zustand store
│       └── types/           # TypeScript types
└── docs/
    └── superpowers/
        ├── specs/
        └── plans/
```
