# 1단계: 빌드
FROM node:18-alpine AS builder

WORKDIR /app

# 필요한 파일 복사
COPY package*.json ./
COPY tsconfig*.json ./
COPY apps/common ./apps/common
COPY apps/event-server ./apps/event-server

RUN npm ci
RUN npm run build:event-server

# 2단계: 실행 환경
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3002

CMD ["node", "dist/event-server/src/main"]