from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.api.v1.api import api_router
from app.db.session import engine
from app.db.base import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 起動時の処理
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # 終了時の処理
    await engine.dispose()

app = FastAPI(
    title="Festal基幹システム API",
    description="売上管理・成績・請求書作成・経理台帳の一気通貫システム",
    version="1.0.0",
    lifespan=lifespan
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# APIルーターの追加
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Festal基幹システム API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 