@echo off
echo Festal基幹システム - フロントエンド起動
echo.

cd /d "%~dp0"
echo 現在のディレクトリ: %CD%

echo.
echo 依存関係をインストール中...
call npm install

echo.
echo 開発サーバーを起動中...
echo http://localhost:3000 でアクセスできます
echo.
call npm run dev

pause 