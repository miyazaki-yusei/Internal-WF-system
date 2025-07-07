# Festal基幹システム

売上管理・成績・請求書作成・経理台帳の一気通貫システム

## システム構成

- **フロントエンド**: Next.js (React) + TypeScript + Tailwind CSS
- **バックエンド**: FastAPI (Python) + SQLAlchemy
- **データベース**: PostgreSQL
- **インフラ**: AWS (予定)

## 主な機能

1. **売上管理機能**
   - 売上/コスト管理
   - 予算管理
   - 顧客管理

2. **成績管理機能**
   - 個人/事業部全体の実績表示
   - インセンティブ金額自動算出

3. **請求書自動発行**
   - 請求書の自動生成
   - メール自動送付
   - 請求書管理

4. **経理管理台帳自動記帳**
   - 請求情報の自動反映
   - 入金管理

## 開発環境のセットアップ

### 前提条件

- Node.js 18以上
- Python 3.8以上
- PostgreSQL (開発時は任意)

### フロントエンド起動

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

または、Windowsの場合は `start-frontend.bat` をダブルクリック

### バックエンド起動

```bash
cd backend

# 依存関係のインストール
pip install -r requirements.txt

# 開発サーバー起動
python main.py
```

または、Windowsの場合は `start-backend.bat` をダブルクリック

## アクセスURL

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8000
- **API ドキュメント**: http://localhost:8000/docs

## プロジェクト構造

```
社内sys/
├── docs/                    # 設計書
├── src/                     # フロントエンド (Next.js)
│   ├── app/                # App Router
│   ├── components/         # 共通コンポーネント
│   └── lib/               # ユーティリティ
├── backend/                # バックエンド (FastAPI)
│   ├── app/
│   │   ├── api/           # API エンドポイント
│   │   ├── core/          # 設定・共通機能
│   │   └── db/            # データベース関連
│   └── main.py
├── start-frontend.bat      # フロントエンド起動スクリプト
├── start-backend.bat       # バックエンド起動スクリプト
└── README.md
```

## 開発タスク

現在の開発状況は `docs/08_システム構築タスク一覧.md` で管理しています。

## ライセンス

社内利用専用 