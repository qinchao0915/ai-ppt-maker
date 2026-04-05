from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import outline, generate, regenerate, export

app = FastAPI(title="AI PPT Maker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(outline.router, prefix="/api")
app.include_router(generate.router, prefix="/api")
app.include_router(regenerate.router, prefix="/api")
app.include_router(export.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}
