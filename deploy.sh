#!/bin/bash

# === 設定 ===
GITHUB_USER="levunn"
REPO_NAME="homepage"
BRANCH="main"

echo "🚀 ReactアプリのGitHubデプロイスクリプト開始"

# ステージングとコミット
echo "📦 変更をコミット..."
git add .
git commit -m "Deploy: Update and build site"

# プッシュ（mainブランチ）
echo "🚚 ソースコードをGitHubにプッシュ..."
git push -u origin $BRANCH

# npm install（必要に応じて）
echo "📦 依存関係確認..."
npm install

# ビルドとデプロイ
echo "🏗️ Reactアプリをビルドし、GitHub Pagesにデプロイ..."
npm run deploy

echo "🎉 完了！Webサイトはここにあります:"
echo "🔗 https://$GITHUB_USER.github.io/$REPO_NAME/"

# #!/bin/bash

# # === 設定 ===
# GITHUB_USER="levunn"
# REPO_NAME="homepage"
# BRANCH="main"

# # === 初期化 ===
# echo "🚀 ReactアプリのGitHubデプロイスクリプト開始"

# # # Gitリポジトリ初期化（必要な場合）
# # if [ ! -d .git ]; then
# #   echo "🔧 Git初期化..."
# #   git init
# #   git branch -m $BRANCH
# #   git remote add origin git@github.com:$GITHUB_USER/$REPO_NAME.git
# # fi

# # ステージングとコミット
# echo "📦 変更をコミット..."
# git add .
# git commit -m "Deploy: Update and build site"

# # プッシュ
# echo "🚚 GitHubにプッシュ..."
# git push -u origin $BRANCH

# # ビルド
# echo "🏗️ Reactビルド開始..."
# npm install
# npm run build

# echo "✅ 完了！ビルド成果物は ./build にあります。"

# # オプション：gh-pagesにデプロイ（必要なら）
# # echo "🌐 GitHub Pagesにデプロイ..."
# # npm run deploy

# echo "🎉 すべて完了！"
