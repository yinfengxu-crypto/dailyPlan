# 每日计划 (DailyPlan)

一个前后端一体的每日计划应用，基于 **Next.js (App Router) + React + TypeScript**，数据存储在 **SQLite** 数据库。

## 功能特性

- 📅 每日任务管理：按日期切换（前后天、日历选择器）
- ✅ 任务增删改查：添加、勾选完成、编辑、删除、一键清除已完成
- 🎯 优先级（高/中/低）与计划时间，自动排序
- ⏳ 任务倒计时：选中任务实时显示距离计划时间的倒计时（精确到秒）
- 🎨 16 套主题换肤（8 浅色 + 8 深色），平滑渐变过渡
- 💾 数据持久化到 SQLite 数据库
- 📱 响应式设计，玻璃拟态 UI

## 技术栈

- **前端**：Next.js 16 (App Router)、React 19、TypeScript、原生 CSS（CSS 变量 + `@property`）
- **后端**：Next.js Route Handlers（REST API）
- **数据库**：SQLite（`better-sqlite3`）

## 快速开始

```bash
npm install       # 安装依赖
npm run dev       # 启动开发服务器 http://localhost:3000
```

生产构建与运行：

```bash
npm run build
npm start
```

## 项目结构

```
src/
├── app/
│   ├── api/tasks/            # 任务 REST API
│   │   ├── route.ts          # GET(按日期查询) / POST(新建) / DELETE(清除)
│   │   └── [id]/route.ts     # PATCH(更新) / DELETE(删除)
│   ├── globals.css           # 全局样式 + 主题变量
│   ├── layout.tsx            # 根布局
│   ├── page.tsx              # 首页（服务端组件）
│   └── icon.svg              # 图标
├── components/
│   ├── DailyPlan.tsx         # 主应用（客户端）
│   ├── TaskList.tsx / TaskItem.tsx
│   ├── AddTaskForm.tsx / ProgressBar.tsx
│   ├── DatePicker.tsx / ThemePicker.tsx
│   └── Countdown.tsx         # 任务倒计时
├── hooks/
│   ├── useTasks.ts           # 任务数据获取与 CRUD
│   ├── useNow.ts             # 每秒时钟
│   └── useLocalStorage.ts    # 主题偏好
├── lib/
│   └── db.ts                 # SQLite 连接与建表
├── themes.ts / types.ts / quotes.ts
└── utils/date.ts
```

数据库文件生成于 `data/dailyplan.db`（已加入 `.gitignore`）。

## API 接口

| 方法   | 路径                          | 说明                          |
|--------|-------------------------------|-------------------------------|
| GET    | `/api/tasks?date=YYYY-MM-DD`  | 获取某天所有任务              |
| POST   | `/api/tasks`                  | 新建任务                      |
| PATCH  | `/api/tasks/:id`              | 更新任务（标题/状态/优先级/时间）|
| DELETE | `/api/tasks/:id`              | 删除单个任务                  |
| DELETE | `/api/tasks?date=...&completedOnly=1` | 清除某天已完成任务   |
