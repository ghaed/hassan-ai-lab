# Hassan AI Lab

A local AI chat interface built with React + FastAPI + Ollama.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, SSE streaming |
| Backend | FastAPI, Python 3.11+ |
| LLM runtime | Ollama (`http://localhost:11434`) |
| Default model | `deepseek-r1:14b` |

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env       # then edit as needed
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## API Reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/models` | List available Ollama models |
| `POST` | `/api/chat` | Stream a chat response (SSE) |
| `GET` | `/api/history` | Retrieve conversation history |

### POST `/api/chat`

**Request body:**
```json
{
  "model": "deepseek-r1:14b",
  "messages": [
    { "role": "user", "content": "Hello!" }
  ]
}
```

**Response:** `text/event-stream` — each event is a JSON chunk `{ "delta": "..." }`, terminated by `data: [DONE]`.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_HOST` | `http://localhost:11434` | Ollama server URL |
| `DEFAULT_MODEL` | `deepseek-r1:14b` | Model used when none specified |
