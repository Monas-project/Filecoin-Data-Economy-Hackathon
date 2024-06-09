# Pythonのベースイメージを使用
FROM python:3.11

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係のインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# netcat-openbsdのインストール（修正箇所）
RUN apt-get update && apt-get install -y netcat-openbsd

# アプリケーションのコードをコンテナにコピー
COPY . .

# 新しい手順: 健全性チェックスクリプトを追加
COPY docker/check_ipfs.sh /usr/local/bin/check_ipfs.sh
RUN chmod +x /usr/local/bin/check_ipfs.sh

# アプリケーションを実行
CMD ["/bin/sh", "-c", "/usr/local/bin/check_ipfs.sh && uvicorn main:app --reload --host 0.0.0.0 --port 80"]


