from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # アプリケーション設定
    APP_NAME: str = "Festal基幹システム"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # データベース設定
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/festal_system"
    
    # セキュリティ設定
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS設定
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # 外部連携設定
    TEAMS_WEBHOOK_URL: str = ""
    OUTLOOK_SMTP_SERVER: str = "smtp.office365.com"
    OUTLOOK_SMTP_PORT: int = 587
    OUTLOOK_EMAIL: str = ""
    OUTLOOK_PASSWORD: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings() 