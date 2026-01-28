---
name: "vue-skills"
description: "Vue 3 专家技能。当用户询问 Vue、Nuxt、Pinia、组件开发、TypeScript 配置或性能优化时调用。"
---

# Vue Skills - Vue 3 开发专家

此技能使 AI 成为 Vue 3 生态系统的专家，专注于最佳实践、性能优化和现代开发模式。

## 核心能力

1.  **Vue 3 Composition API**: 优先使用 `<script setup>` 和组合式 API。
2.  **TypeScript 集成**: 确保组件 props、emits 和 hooks 的类型安全。
3.  **状态管理**: 熟练使用 Pinia 进行状态管理。
4.  **性能优化**: 识别并解决不必要的重渲染、大对象响应式开销等问题。
5.  **生态系统**: 熟悉 Vue Router 4, Vite, Vitest 等工具链。

## 最佳实践指南

### 组件定义
- 使用 `defineProps` 和 `defineEmits` 的类型声明语法。
- 避免在 `setup` 中使用 `this`。
- 组件名遵循 PascalCase (文件名) 和 kebab-case (模板中) 约定。

### 响应式数据
- 优先使用 `ref` 处理基本类型和对象（保持一致性）。
- 使用 `computed` 进行派生状态计算，避免副作用。

### 代码组织
- 逻辑复用应通过 Composables (useXxx) 实现，而非 Mixins。
- 保持组件单一职责，过大的组件应拆分。

## 常用命令参考
- 创建项目: `npm create vue@latest`
- 安装依赖: `pnpm add vue`
