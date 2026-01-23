# Markdown Note - 前端知识体系构建

[![Deploy VitePress site to Pages](https://github.com/your-username/markdownNote/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-username/markdownNote/actions/workflows/deploy.yml)

一个基于 [VitePress](https://vitepress.dev/) 构建的前端知识体系文档项目，旨在系统性地整理和分享前端开发相关的核心概念、技术栈及最佳实践。

## 📚 项目内容

本项目涵盖了前端开发的各个方面，主要包括：

- **前端基础**:
  - **JavaScript**: 深入解析 JS 核心概念（原型链、闭包、Event Loop、Promise 等）、ES6+ 新特性、常用手写函数（防抖、节流、深拷贝、树形结构操作等）。
  - **TypeScript**: 配置详解（tsconfig, tsconfig.app, tsconfig.node）、内置工具类型、类型体操等。
  - **HTML5 / CSS3**: 基础与进阶特性。
- **框架生态**:
  - **Vue 3**: 核心原理、Vue 2 与 Vue 3 差异、最佳实践。
  - **React**: 核心概念与生态。
  - **小程序**: 生命周期、配置与开发指南。
- **工程化**:
  - **构建工具**: Vite, Webpack, Rollup 原理与配置。
  - **规范化**: Prettier 代码风格、ESLint 代码质量、CommitLint 提交规范。

## 🚀 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) (推荐 v18+)
- [pnpm](https://pnpm.io/) (推荐最新版)

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm docs:dev
```

启动后访问 `http://localhost:5173` (或控制台显示的地址) 即可预览文档。

### 构建生产版本

```bash
pnpm docs:build
```

构建产物将输出到 `docs/.vitepress/dist` 目录。

### 本地预览生产构建

```bash
pnpm docs:preview
```

## 📂 目录结构

```
.
├── docs/
│   ├── .vitepress/        # VitePress 配置、主题、缓存
│   ├── css3/              # CSS3 相关文档
│   ├── html5/             # HTML5 相关文档
│   ├── javascript/        # JavaScript 核心与进阶
│   ├── typescript/        # TypeScript 配置与类型
│   ├── vue3/              # Vue 3 生态
│   ├── react/             # React 生态
│   ├── miniprogram/       # 小程序开发
│   ├── vite/              # Vite 构建工具
│   ├── webpack/           # Webpack 构建工具
│   ├── rollup/            # Rollup 构建工具
│   ├── prettier/          # Prettier 配置
│   ├── eslint/            # ESLint 配置
│   ├── commitLint/        # Git 提交规范
│   └── index.md           # 首页配置
├── package.json           # 项目依赖与脚本
├── pnpm-lock.yaml         # 依赖锁定文件
└── README.md              # 项目说明
```

## 🛠️ 部署

本项目配置了 GitHub Actions 自动部署到 GitHub Pages。

1.  确保在 `docs/.vitepress/config.mts` 中设置了正确的 `base` 路径（对应你的仓库名称）。
2.  将代码推送到 `main` 分支。
3.  GitHub Actions 将自动触发构建并将 `docs/.vitepress/dist` 部署到 `gh-pages` 分支（或根据配置的 Pages 源）。

## 📄 License

MIT
