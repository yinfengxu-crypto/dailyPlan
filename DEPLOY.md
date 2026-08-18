# 部署指南

本项目是 **Next.js 16 (App Router) + SQLite (better-sqlite3)** 全栈应用。部署要点：

1. **必须运行在 Node.js 服务器**（better-sqlite3 是原生模块，且 SQLite 是本地文件）。
2. **`data/` 目录必须持久化**（存放 `dailyplan.db`）。
3. ⚠️ **不适合 Vercel / Netlify 等 Serverless 平台**（无持久磁盘，函数实例会被销毁，本地 SQLite 文件会丢失）。

---

## 方案一：Docker（推荐）

### 1. 构建并启动

```bash
docker compose up -d --build
```

### 2. 常用命令

```bash
docker compose logs -f          # 查看日志
docker compose ps               # 查看状态
docker compose down             # 停止（数据卷保留）
docker compose down -v          # 停止并删除数据卷（会清空数据库！）
```

### 3. 更新部署

```bash
git pull
docker compose up -d --build
```

### 4. 数据备份

```bash
# 数据库就在命名卷里，直接复制出来即可
docker cp dailyplan:/app/data/dailyplan.db ./backup-dailyplan.db
```

---

## 方案二：VPS 手动部署（Node + pm2 + Caddy/Nginx）

### 1. 安装 Node.js 20+

```bash
# 用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22
```

### 2. 上传代码并构建

```bash
git clone <你的仓库地址> dailyPlan
cd dailyPlan
npm ci
npm run build
npm prune --omit=dev   # 构建后移除开发依赖
```

### 3. 用 pm2 常驻运行

```bash
npm i -g pm2
pm2 start npm --name dailyplan -- start   # 等价于 npm start（next start）
pm2 save
pm2 startup   # 开机自启
```

> 也可用 systemd：参考下文示例。

### 4. 反向代理 + HTTPS

**Caddy（最简单，自动 HTTPS）** —— `/etc/caddy/Caddyfile`：

```
your-domain.com {
    reverse_proxy 127.0.0.1:3000
}
```

**Nginx** —— `/etc/nginx/sites-available/dailyplan`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

然后用 `certbot --nginx` 或 `apt install python3-certbot-nginx` 申请 HTTPS。

---

## systemd 服务示例（不装 pm2 时）

`/etc/systemd/system/dailyplan.service`：

```ini
[Unit]
Description=DailyPlan
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/dailyPlan
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now dailyplan
```

## 方案三：GitHub Actions 自动构建（低配 VPS 推荐）

> 适合内存小（1GB 及以下）的 VPS：在 GitHub 服务器上构建镜像，VPS 只拉取运行，不本地编译。

1. 代码推送后，GitHub Actions 自动运行（仓库 Actions 页可看进度）：

```bash
git add -A && git commit -m "update" && git push
```

2. VPS 拉取运行（**不需要 docker build**）：

```bash
cd dailyPlan && git pull
# 私有仓库首次需登录：docker login ghcr.io -u <用户名>
docker compose -f docker-compose.ci.yml up -d
```

3. 更新：`docker compose -f docker-compose.ci.yml pull && docker compose -f docker-compose.ci.yml up -d`

---

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 监听端口 | 3000 |

数据库文件始终位于项目根目录 `data/dailyplan.db`，部署时务必保证该目录可写且被持久化/备份。
