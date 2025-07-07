from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from typing import List

router = APIRouter()

@router.get("/")
async def get_users(db: AsyncSession = Depends(get_db)):
    """
    ユーザー一覧を取得
    """
    # TODO: 実際のデータベースクエリを実装
    return [
        {
            "id": 1,
            "username": "admin",
            "email": "admin@festal.com",
            "role": "admin",
            "department": "管理部"
        },
        {
            "id": 2,
            "username": "user1",
            "email": "user1@festal.com",
            "role": "user",
            "department": "コンサル事業部"
        }
    ]

@router.get("/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """
    特定のユーザー情報を取得
    """
    # TODO: 実際のデータベースクエリを実装
    return {
        "id": user_id,
        "username": "user1",
        "email": "user1@festal.com",
        "role": "user",
        "department": "コンサル事業部"
    }

@router.post("/")
async def create_user(db: AsyncSession = Depends(get_db)):
    """
    新規ユーザーを作成
    """
    # TODO: 実際のユーザー作成ロジックを実装
    return {"message": "User created successfully"}

@router.put("/{user_id}")
async def update_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """
    ユーザー情報を更新
    """
    # TODO: 実際のユーザー更新ロジックを実装
    return {"message": "User updated successfully"}

@router.delete("/{user_id}")
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """
    ユーザーを削除
    """
    # TODO: 実際のユーザー削除ロジックを実装
    return {"message": "User deleted successfully"} 