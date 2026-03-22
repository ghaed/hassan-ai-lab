import json
import httpx
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from backend.config import settings
from backend.models.schemas import ChatRequest

router = APIRouter()

# In-memory history (per-process, resets on restart)
_history: list[dict] = []


@router.get("/models")
async def list_models():
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{settings.ollama_host}/api/tags")
        resp.raise_for_status()
        data = resp.json()
    return {"models": [m["name"] for m in data.get("models", [])]}


@router.post("/chat")
async def chat(req: ChatRequest):
    model = req.model or settings.default_model
    messages = [m.model_dump() for m in req.messages]

    # Persist user turn
    if messages and messages[-1]["role"] == "user":
        _history.append(messages[-1])

    async def stream():
        assistant_content = []
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                "POST",
                f"{settings.ollama_host}/api/chat",
                json={"model": model, "messages": messages, "stream": True},
            ) as resp:
                async for line in resp.aiter_lines():
                    if not line:
                        continue
                    chunk = json.loads(line)
                    delta = chunk.get("message", {}).get("content", "")
                    if delta:
                        assistant_content.append(delta)
                        yield f"data: {json.dumps({'delta': delta})}\n\n"
                    if chunk.get("done"):
                        _history.append({"role": "assistant", "content": "".join(assistant_content)})
                        yield "data: [DONE]\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")


@router.get("/history")
async def history():
    return {"history": _history}
