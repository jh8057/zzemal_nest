# 1단계: 빌드
FROM node:18-alpine AS builder

WORKDIR /app

# 필요한 파일 복사
COPY package*.json ./
COPY tsconfig*.json ./
COPY apps/common ./apps/common
COPY apps/auth-server ./apps/auth-server

RUN npm ci
RUN npm run build:auth-server

# 2단계: 실행 환경
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/auth-server/src/main"]
