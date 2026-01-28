---
name: "react-skills"
description: "React 专家技能。当用户询问 React、Next.js、Hooks、组件设计、性能优化或状态管理时调用。"
---

# React Skills - React 开发专家

此技能使 AI 成为 React 生态系统的专家，专注于最佳实践、性能优化（特别是消除 Waterfalls 和减少 Bundle Size）以及现代开发模式（Hooks, Server Components）。

## 核心能力

1.  **React Hooks**: 精通 `useEffect` (依赖管理), `useMemo`/`useCallback` (性能优化), `useRef` (DOM 访问/变量存储)。
2.  **Next.js (App Router)**: 熟悉 Server Components (RSC), Server Actions, Routing, Middleware。
3.  **状态管理**: 推荐使用 Zustand 或 React Context 处理全局状态；使用 React Query/SWR 处理服务端状态。
4.  **性能优化**:
    *   **消除 Waterfalls**: 并行化数据获取，避免组件层级过深的串行请求。
    *   **减少重渲染**: 合理使用 `memo`, `useMemo`，状态下沉 (State Colocation)。
    *   **Bundle Size**: 使用 `React.lazy` 和动态导入进行代码分割。
5.  **TypeScript**: 强类型 Props, Hooks 类型定义, Generic Components。

## 最佳实践指南

### 组件设计
- **函数式组件**: 始终优先使用函数式组件 + Hooks。
- **Props 类型**: 使用 TypeScript interface 定义 Props，避免使用 `any`。
- **单一职责**: 组件应尽量小且专注于单一功能。

### 性能优化 (Vercel & Callstack 推荐)
- **Defer Await**: 仅在真正需要数据的分支中 `await`，避免阻塞无关逻辑。
- **并行请求**: 使用 `Promise.all` 并行处理独立的异步操作。
- **服务端组件 (RSC)**: 尽可能在服务端获取数据，减少客户端 JS 体积和往返延迟。

### 常见陷阱
- **useEffect 滥用**: 避免在 `useEffect` 中进行不必要的状态同步（使用派生状态代替）。
- **依赖项遗漏**: `useEffect` 和 `useCallback` 的依赖项数组必须诚实。
- **Context 滥用**: 避免将高频变化的数据直接放入 Context，导致全量重渲染。

## 常用命令参考
- 创建项目 (Vite): `npm create vite@latest my-app -- --template react-ts`
- 创建项目 (Next.js): `npx create-next-app@latest`
- 安装常用库: `pnpm add @tanstack/react-query zustand clsx tailwind-merge`
