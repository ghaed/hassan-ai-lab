from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.routes.chat import router

app = FastAPI(title="Hassan AI Lab")

app.include_router(router, prefix="/api")

# Serve the built React frontend
_dist = Path(__file__).parent.parent / "frontend" / "dist"

if _dist.exists():
    app.mount("/assets", StaticFiles(directory=_dist / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def spa_fallback(full_path: str):
        return FileResponse(_dist / "index.html")
