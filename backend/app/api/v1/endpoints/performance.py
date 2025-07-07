from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from typing import List
from datetime import datetime

router = APIRouter()

@router.get("/")
async def get_performances(db: AsyncSession = Depends(get_db)):
    """
    成績一覧を取得
    """
    # TODO: 実際のデータベースクエリを実装
    return [
        {
            "id": 1,
            "user_id": 1,
            "username": "田中太郎",
            "month": "2024-01",
            "sales_amount": 500000,
            "incentive_amount": 50000,
            "department": "コンサル事業部",
            "created_at": "2024-01-31T00:00:00"
        },
        {
            "id": 2,
            "user_id": 2,
            "username": "佐藤花子",
            "month": "2024-01",
            "sales_amount": 800000,
            "incentive_amount": 80000,
            "department": "コンサル事業部",
            "created_at": "2024-01-31T00:00:00"
        }
    ]

@router.get("/{performance_id}")
async def get_performance(performance_id: int, db: AsyncSession = Depends(get_db)):
    """
    特定の成績情報を取得
    """
    # TODO: 実際のデータベースクエリを実装
    return {
        "id": performance_id,
        "user_id": 1,
        "username": "田中太郎",
        "month": "2024-01",
        "sales_amount": 500000,
        "incentive_amount": 50000,
        "department": "コンサル事業部",
        "created_at": "2024-01-31T00:00:00"
    }

@router.get("/user/{user_id}")
async def get_user_performance(user_id: int, db: AsyncSession = Depends(get_db)):
    """
    特定ユーザーの成績履歴を取得
    """
    # TODO: 実際のデータベースクエリを実装
    return [
        {
            "id": 1,
            "user_id": user_id,
            "username": "田中太郎",
            "month": "2024-01",
            "sales_amount": 500000,
            "incentive_amount": 50000,
            "department": "コンサル事業部",
            "created_at": "2024-01-31T00:00:00"
        }
    ]

@router.post("/")
async def create_performance(db: AsyncSession = Depends(get_db)):
    """
    新規成績を登録
    """
    # TODO: 実際の成績登録ロジックを実装
    return {"message": "Performance created successfully"}

@router.put("/{performance_id}")
async def update_performance(performance_id: int, db: AsyncSession = Depends(get_db)):
    """
    成績情報を更新
    """
    # TODO: 実際の成績更新ロジックを実装
    return {"message": "Performance updated successfully"}

@router.delete("/{performance_id}")
async def delete_performance(performance_id: int, db: AsyncSession = Depends(get_db)):
    """
    成績を削除
    """
    # TODO: 実際の成績削除ロジックを実装
    return {"message": "Performance deleted successfully"}

@router.get("/summary/department")
async def get_department_summary(db: AsyncSession = Depends(get_db)):
    """
    事業部別成績サマリーを取得
    """
    # TODO: 実際の集計ロジックを実装
    return [
        {
            "department": "コンサル事業部",
            "total_sales": 1300000,
            "total_incentive": 130000,
            "member_count": 2,
            "average_sales": 650000
        }
    ] 