# syntax=docker/dockerfile:1

# ---------- 构建阶段 ----------
FROM node:22-slim AS builder
WORKDIR /app

# 先复制依赖清单，充分利用 Docker 层缓存
COPY package.json package-lock.json ./
RUN npm ci

# 复制源码并构建
COPY . .
RUN npm run build

# ---------- 运行阶段 ----------
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# 只安装生产依赖（better-sqlite3 会在此下载对应平台的原生二进制）
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# 复制构建产物与配置
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# SQLite 数据目录（用 volume 持久化）
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/tasks/summary').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["npm", "start"]
