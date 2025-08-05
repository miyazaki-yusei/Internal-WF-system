# GitHubリポジトリにプッシュするスクリプト
Write-Host "GitHubリポジトリにプッシュを開始します..." -ForegroundColor Green

# リモートURLを設定
Write-Host "リモートURLを設定中..." -ForegroundColor Yellow
git remote set-url origin https://github.com/miyazaki-yusei/Internal-WF-system.git

# 変更をステージング
Write-Host "変更をステージング中..." -ForegroundColor Yellow
git add .

# コミット
Write-Host "コミット中..." -ForegroundColor Yellow
git commit -m "feat: 予算管理機能の改善とファーム集計UIの修正"

# develop_businessブランチにプッシュ
Write-Host "develop_businessブランチにプッシュ中..." -ForegroundColor Yellow
git push origin develop_business

Write-Host "プッシュが完了しました！" -ForegroundColor Green 