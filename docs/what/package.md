# package.json 详解

`package.json` 是 Node.js 项目的核心清单文件，它不仅定义了项目的元数据（名称、版本、作者等），还管理着项目的依赖包、脚本命令、发布配置等关键信息。它是前端工程化和 npm 生态系统的基石。

## 核心字段 (必填)

如果你打算发布包到 npm，以下两个字段是必须的：

### name

项目的名称。

- **作用**：在 npm 注册表中作为唯一标识符。
- **规则**：
  - 全部小写。
  - 必须是 URL 安全的字符（不能包含空格、非 URL 安全字符）。
  - 不能以 `.` 或 `_` 开头。
  - 建议使用 scope 包（如 `@scope/pkg`）以避免命名冲突。

### version

项目的版本号。

- **作用**：遵循 [SemVer (语义化版本控制)](https://semver.org/lang/zh-CN/) 规范。
- **格式**：`主版本号.次版本号.修订号` (MAJOR.MINOR.PATCH)。
  - **主版本号**：不兼容的 API 修改。
  - **次版本号**：向下兼容的功能性新增。
  - **修订号**：向下兼容的问题修正。

```json
{
  "name": "@my-org/awesome-tool",
  "version": "1.0.0"
}
```

## 信息描述字段

这些字段主要用于增强包的可发现性和可读性。

- **description**: 项目简介，会显示在 npm 搜索结果中。
- **keywords**: 关键词数组，有助于在 npm 中被搜索到。
- **author**: 作者信息，格式为 `Name <email> (url)` 或对象形式。
- **contributors**: 贡献者列表（数组）。
- **license**: 开源协议（如 `MIT`, `ISC`, `Apache-2.0`）。
- **homepage**: 项目主页 URL。
- **repository**: 代码仓库地址。
- **bugs**: 问题反馈地址。

```json
{
  "description": "一个极速的构建工具",
  "keywords": ["build", "tool", "fast"],
  "author": "YYF <yyf@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/user/repo.git"
  }
}
```

## 依赖管理字段

### dependencies

**生产环境依赖**。

- 项目运行时所必需的包。
- 当别人安装你的包时，这里的依赖也会被自动安装。

### devDependencies

**开发环境依赖**。

- 仅在开发、测试或构建过程中需要的包（如 `typescript`, `webpack`, `jest`）。
- 生产环境部署或作为依赖被安装时，不会安装这里的包。

### peerDependencies

**同伴依赖**。

- 提示宿主环境需要安装的包，通常用于插件系统（如 React 组件库需要宿主安装 React）。
- npm v7+ 会自动安装 peerDependencies，除非冲突。

### optionalDependencies

**可选依赖**。

- 即使安装失败，npm 也会继续安装过程。适用于跨平台差异较大的包（如 `fsevents`）。

### engines

指定项目运行所需的 Node.js 或 npm 版本范围。

- **作用**：防止用户在不兼容的环境中运行项目。

```json
{
  "dependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  },
  "peerDependencies": {
    "react": ">=16.8.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 脚本与配置

### scripts

定义可通过 `npm run <command>` 执行的脚本命令。

- **作用**：封装复杂的命令，统一构建、测试、部署流程。
- **生命周期脚本**：如 `preinstall`, `postinstall`, `prepublish` 等，会在特定事件前后自动执行。

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "prepare": "husky install" // 依赖安装后自动执行
  }
}
```

### config

用于设置脚本中使用的环境变量。

```json
{
  "config": {
    "port": "8080"
  }
}
// 脚本中可通过 process.env.npm_package_config_port 访问
```

## 入口与导出 (Exports)

决定了当别人 `import` 或 `require` 你的包时，实际加载的是哪个文件。

### main

**CommonJS 入口**。

- 历史悠久的字段，Node.js 默认查找的文件。

### module

**ES Module 入口**。

- 打包工具（Webpack/Rollup）优先识别的字段，用于 Tree Shaking。

### browser

**浏览器环境入口**。

- 指定在浏览器端使用时替换某些 Node.js 特有的模块。

### exports (现代标准)

**条件导出**。

- Node.js v12.16+ 支持。
- 提供了更精细的控制，可以限制用户只能访问特定的内部路径，并根据引用方式（`require` vs `import`）返回不同的文件。

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./utils": "./dist/utils.mjs" // 允许 import 'pkg/utils'
  }
}
```

## 发布配置

### files

指定发布到 npm 时包含的文件白名单。

- 类似于 `.gitignore` 的反向作用。
- `package.json`, `README.md`, `LICENSE` 默认包含。

### private

如果设为 `true`，npm 会拒绝发布此包。

- **作用**：防止私有项目被意外发布到公共仓库。

### publishConfig

发布时的配置覆盖。

- 常用于指定发布的 registry（如发布 scope 包到 npm 公共仓库）。

```json
{
  "files": ["dist", "README.md"],
  "private": false,
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

## 其他重要字段

### workspaces

**Monorepo 工作区配置**。

- 允许在根目录下管理多个子包，共享 `node_modules`。

```json
{
  "workspaces": ["packages/*", "apps/*"]
}
```

### sideEffects

**副作用标记**。

- 用于 Webpack 等工具的 Tree Shaking 优化。
- `false` 表示所有文件都是纯函数，没有副作用（如修改全局变量、CSS 引入等），可以安全地移除未使用的导出。
- 如果有 CSS 文件，通常配置为 `["*.css"]`。

```json
{
  "sideEffects": false
  // 或者
  // "sideEffects": ["*.css", "*.scss"]
}
```

### type

指定 `.js` 文件的默认模块系统。

- `"commonjs"` (默认): `.js` 当作 CommonJS 处理。
- `"module"`: `.js` 当作 ES Module 处理。

```json
{
  "type": "module"
}
```
