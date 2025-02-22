FROM node:18

WORKDIR /app

# 앱 의존성 설치
COPY package*.json ./
RUN npm install

# 앱 소스 복사
COPY . .

# 포트 설정
EXPOSE 3000

# 앱 실행
CMD ["node", "server.js"] 