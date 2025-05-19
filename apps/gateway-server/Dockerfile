# 1단계: 빌드
FROM node:18-alpine AS builder

WORKDIR /app

# 필요한 파일 복사
COPY package*.json ./
COPY tsconfig*.json ./
COPY apps/common ./apps/common
COPY apps/gateway-server ./apps/gateway-server

RUN npm ci
RUN npm run build:gateway-server

# 2단계: 실행 환경
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/gateway-server/src/main"]