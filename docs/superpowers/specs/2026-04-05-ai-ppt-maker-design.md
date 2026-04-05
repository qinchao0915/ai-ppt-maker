# AI PPT Maker — Design Spec
Date: 2026-04-05

## Overview

A web-based AI-powered PowerPoint maker. Users describe what they want in natural language; the app generates a multi-slide presentation, shows each slide's generation prompt for review and editing, allows visual in-place editing, and exports to `.pptx`.

---

## Layout

Fixed left-right split panel:

- **Left panel** — Conversation input + Slide Prompt cards list + history picker
- **Right panel** — Slide thumbnail strip (top) + large slide preview (bottom, HTML/CSS rendered)

```
┌─────────────────────────────────────────────────────────────────┐
│  🎨 AI PPT Maker                               [导出 .pptx]     │
├──────────────────────────┬──────────────────────────────────────┤
│  💬 对话 & Prompts        │          📊 幻灯片预览               │
│                          │                                      │
│  ┌──────────────────┐    │  [缩略图1] [缩略图2] [缩略图3] ...   │
│  │ 历史记录 ▾        │    │  ────────────────────────────────   │
│  └──────────────────┘    │  ┌────────────────────────────────┐  │
│                          │  │                                │  │
│  Slide 1  [↺ 重新生成]   │  │   当前幻灯片大图预览            │  │
│  ┌──────────────────┐    │  │   （HTML/CSS 渲染）             │  │
│  │ prompt 内容...   │    │  │   点击元素可直接编辑            │  │
│  └──────────────────┘    │  │                                │  │
│                          │  └────────────────────────────────┘  │
│  Slide 2  [↺ 重新生成]   │                                      │
│  ┌──────────────────┐    │                                      │
│  │ prompt 内容...   │    │                                      │
│  └──────────────────┘    │                                      │
│                          │                                      │
│  ────────────────────    │                                      │
│  [输入框: 描述你的PPT]    │                                      │
│  [发送]                   │                                      │
└──────────────────────────┴──────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| 前端 | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| 后端 | FastAPI (Python) |
| AI | Claude API (Anthropic) with pptx skill instructions |
| PPT 生成 | python-pptx |
| 本地存储 | localStorage (deviceId) + IndexedDB (项目历史) |
| 预览渲染 | HTML/CSS (JSON驱动，无 Office 依赖) |

---

## Data Model

### SlideJSON
```typescript
interface Slide {
  id: string;
  title: string;
  bullets: string[];
  layout: "title-only" | "title-bullets" | "title-image" | "blank";
  style: {
    theme: string;   // e.g. "blue", "dark", "minimal"
    font: string;    // e.g. "sans", "serif"
  };
  prompt: string;    // 用户可见、可编辑的生成 prompt
}
```

### ProjectRecord (IndexedDB)
```typescript
interface ProjectRecord {
  id: string;
  deviceId: string;
  title: string;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
}
```

---

## Core Interaction Flow

1. **用户输入** — 在左栏输入框描述 PPT 需求
2. **大纲生成** — Claude 返回大纲（页数 + 每页标题），用户确认
3. **逐页生成** — 每页生成 SlideJSON + 对应 prompt，流式返回
4. **Prompt 卡片** — 左栏每页显示一张可编辑 prompt 卡片，支持：
   - 直接编辑 prompt 文字
   - 点击"↺ 重新生成"单页重新调用 Claude
5. **可视化预览** — 右栏 HTML/CSS 实时渲染，点击元素可直接编辑文字内容
6. **导出** — 点击"导出 .pptx"，前端将 SlideJSON[] 发给 FastAPI，python-pptx 生成文件并返回下载

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/outline` | 输入用户描述，返回大纲 |
| POST | `/api/generate` | 输入大纲，流式返回 SlideJSON[] |
| POST | `/api/regenerate/{slide_id}` | 单页重新生成 |
| POST | `/api/export` | SlideJSON[] → .pptx 文件下载 |

---

## History (Local Storage)

- **deviceId**: 首次访问时 `crypto.randomUUID()` 生成，存入 `localStorage`，永久持久化
- **项目列表**: 存入 `IndexedDB`，key 为 `deviceId`
- **UI**: 左上角历史记录下拉，显示最近 20 个项目，点击恢复完整 SlideJSON 状态

---

## UI/UX Guidelines (from UI/UX Pro Max)

- 最小点击区域 44×44px
- 颜色对比度 ≥ 4.5:1
- Prompt 卡片编辑状态有明确 focus ring
- 生成中显示 skeleton loading，避免 CLS
- 支持 `prefers-reduced-motion`
- 幻灯片缩略图点击高亮当前选中页

---

## Out of Scope (MVP)

- 用户账号 / 云端同步
- 多人协作
- 图片上传 / AI 图片生成
- PDF 导出
