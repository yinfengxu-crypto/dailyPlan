# syntax=docker/dockerfile:1

# ===== 基础镜像：预装原生模块编译工具（better-sqlite3 需要） =====
FROM node:22-slim AS base
WORKDIR /app

# 预编译二进制下载失败时，node-gyp 可用这些工具从源码编译
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# 可选镜像加速（构建时通过 --build-arg 传入；中国大陆可换 npmmirror）
ARG NPM_REGISTRY=https://registry.npmjs.org
ARG SQLITE_MIRROR=
RUN npm config set registry "$NPM_REGISTRY" \
    && npm config set fetch-retries 5 \
    && npm config set fetch-timeout 600000
ENV npm_config_better_sqlite3_binary_host_mirror=$SQLITE_MIRROR

# ===== 构建阶段 =====
FROM base AS builder

ENV NEXT_TELEMETRY_DISABLED=1
# 限制 Node 堆内存峰值，配合服务器 swap 使用，避免被 OOM killer 误杀
ENV NODE_OPTIONS=--max-old-space-size=2048

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ===== 运行阶段 =====
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./next.config.mjs

RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/tasks/summary').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["npm", "start"]
