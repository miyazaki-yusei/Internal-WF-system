from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, sales, performance, billing

api_router = APIRouter()

# 各エンドポイントのルーターを追加
api_router.include_router(auth.router, prefix="/auth", tags=["認証"])
api_router.include_router(users.router, prefix="/users", tags=["ユーザー管理"])
api_router.include_router(sales.router, prefix="/sales", tags=["売上管理"])
api_router.include_router(performance.router, prefix="/performance", tags=["成績管理"])
api_router.include_router(billing.router, prefix="/billing", tags=["請求管理"]) 