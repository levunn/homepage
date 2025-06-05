#!/bin/bash

# コンテナの作業ディレクトリに移動
cd /app

# Reactアプリケーションのサブディレクトリ名
REACT_APP_DIR="my-react-app" # ← ここでサブディレクトリ名を定義

# Reactプロジェクトがまだ初期化されていないかチェックします。
# node_modules ディレクトリが指定のサブディレクトリ内に存在しない場合を初期化のトリガーとします。
if [ ! -d "${REACT_APP_DIR}/node_modules" ]; then
  echo "--- Reactプロジェクトを初期化中 ---"
  # npx create-react-app をサブディレクトリ内に実行します。
  # これにより、/app/${REACT_APP_DIR} ディレクトリにReactプロジェクトの骨組みが生成されます。
  npx create-react-app ${REACT_APP_DIR}

  # サブディレクトリに移動して残りの設定とインストールを行います。
  cd "${REACT_APP_DIR}"

  # Tailwind CSS の設定ファイルを生成します。
  npx tailwindcss init

  # 生成された tailwind.config.js ファイルを修正します。
  sed -i 's|content: \\[\\]|content: \\["./src/**/*.{js,jsx,ts,tsx}"\\]|g' tailwind.config.js
  sed -i "/extend: {/a\\\t\\t\\t\\tfontFamily: {\\n\\t\\t\\t\\t\\tinter: ['Inter', 'sans-serif'],\\n\\t\\t\\t\\t},\\n\\t\\t\\t\\tcolors: {\\n\\t\\t\\t\\t\\tpolarNight0: '\\#2E3440',\\n\\t\\t\\t\\t\\tpolarNight1: '\\#3B4252',\\n\\t\\t\\t\\t\\tpolarNight2: '\\#434C5E',\\n\\t\\t\\t\\t\\tpolarNight3: '\\#4C566A',\\n\\t\\t\\t\\t\\tsnowStorm0: '\\#D8DEE9',\\n\\t\\t\\t\\t\\tsnowStorm1: '\\#E5E9F0',\\n\\t\\t\\t\\t\\tsnowStorm2: '\\#ECEFF4',\\n\\t\\t\\t\\t\\tfrost0: '\\#8FBCBB',\\n\\t\\t\\t\\t\\tfrost1: '\\#88C0D0',\\n\\t\\t\\t\\t\\tfrost2: '\\#81A1C1',\\n\\t\\t\\t\\t\\tfrost3: '\\#5E81AC',\\n\\t\\t\\t\\t\\tauroraRed: '\\#BF616A',\\n\\t\\t\\t\\t\\tauroraOrange: '\\#D08770',\\n\\t\\t\\t\\t\\tauroraYellow: '\\#EBCB8B',\\n\\t\\t\\t\\t\\tauroraGreen: '\\#A3BE8C',\\n\\t\\t\\t\\t\\tauroraPurple: '\\#B48EAD',\\n\\t\\t\\t\\t}" tailwind.config.js

  # 追加で必要なライブラリ (Three.js, gh-pages) をインストールします。
  # `create-react-app` がインストールする react-scripts 以外に必要です。
  npm install three gh-pages

  # package.json に homepage プロパティと deploy スクリプトを追加/更新します。
  # jq は Dockerfile でインストール済みです。
  jq '.homepage = "https://your-github-username.github.io/homepage"' package.json > temp.json && mv temp.json package.json
  jq '.scripts.predeploy = "npm run build"' package.json > temp.json && mv temp.json package.json
  jq '.scripts.deploy = "gh-pages -d build"' package.json > temp.json && mv temp.json package.json

  echo "--- プロジェクトの初期化が完了しました ---"
else
  echo "--- プロジェクトは既に初期化されています ---"
  # 既に初期化されている場合でも、サブディレクトリに移動
  cd "${REACT_APP_DIR}"
fi

# 最終的に、React開発サーバーを起動します。
exec npm start