# ベースイメージとしてNode.jsのバージョン20の軽量版を使用します。
FROM node:20-slim

# jq をインストールするためのパッケージリストを更新し、jq をインストールします。
# jq は package.json の編集に必要です。
RUN apt-get update && apt-get install -y --no-install-recommends jq && rm -rf /var/lib/apt/lists/*

# コンテナ内の作業ディレクトリを `/app` に設定します。
WORKDIR /app

# エントリーポイントスクリプトをコンテナ内にコピーします。
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# エントリーポイントスクリプトに実行権限を付与します。
RUN chmod +x /usr/local/bin/entrypoint.sh

# コンテナがリッスンするポート（React開発サーバーのデフォルトポート）を公開します。
EXPOSE 3000

# コンテナが起動したときにデフォルトで実行されるコマンドです。
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]