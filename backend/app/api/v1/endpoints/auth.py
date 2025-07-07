from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.config import settings
from datetime import timedelta

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    ユーザーログイン
    """
    # TODO: 実際の認証ロジックを実装
    if form_data.username == "admin" and form_data.password == "password":
        return {
            "access_token": "dummy_token",
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/logout")
async def logout():
    """
    ユーザーログアウト
    """
    return {"message": "Successfully logged out"}

@router.get("/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    現在のユーザー情報を取得
    """
    # TODO: 実際のトークン検証ロジックを実装
    return {
        "id": 1,
        "username": "admin",
        "email": "admin@festal.com",
        "role": "admin"
    } 