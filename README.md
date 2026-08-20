# 保险营销员成长引擎 (Agent Growth Engine)

一个为保险代理人设计的全面成长管理平台，涵盖业绩看板、团队管理、基本法追踪及 AI 成长建议。

## 技术栈

- React 19 + TypeScript
- Vite 6
- Recharts（数据可视化）
- Motion（动画）
- Lucide React（图标）
- @google/genai（AI 成长建议）

## 本地运行

**前置条件：** 已安装 Node.js。

1. 安装依赖：
   ```bash
   npm install
   ```

2. 配置环境变量：复制 `.env.example` 为 `.env`，并填入你的 Gemini API Key：
   ```bash
   cp .env.example .env
   ```
   ```
   GEMINI_API_KEY=你的_API_KEY
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 构建

```bash
npm run build      # 生产构建
npm run preview    # 预览生产构建
npm run lint       # 类型检查（tsc --noEmit）
```

## 目录结构

- `App.tsx` — 主应用组件
- `components`（`FloatingButton.tsx`、`HongyunZone.tsx`、`MyIncome.tsx`、`TeamPerformance.tsx` 等）— 功能模块
- `services/geminiService.ts` — AI 服务封装
- `constants.tsx` / `types.ts` — 常量与类型定义
