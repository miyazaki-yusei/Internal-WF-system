@echo off
echo Festal基幹システム - バックエンド起動
echo.

cd /d "%~dp0\backend"
echo 現在のディレクトリ: %CD%

echo.
echo 依存関係をインストール中...
call pip install -r requirements.txt

echo.
echo 開発サーバーを起動中...
echo http://localhost:8000 でアクセスできます
echo API ドキュメント: http://localhost:8000/docs
echo.
call python main.py

pause 