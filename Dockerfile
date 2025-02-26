FROM node:18

# 빌드 도구 및 sqlite3 의존성 설치
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 앱 의존성 설치
COPY package*.json ./
RUN npm install --build-from-source

# 앱 소스 복사
COPY . .

# 데이터베이스 디렉토리 생성
RUN mkdir -p /app/data

# SQLite 데이터베이스 파일 위치 설정
ENV SQLITE_DB_PATH=/app/data/visitors.db

# 포트 설정
EXPOSE 3000

# 앱 실행
CMD ["node", "server.js"] 