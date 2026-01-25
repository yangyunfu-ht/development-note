# tsconfig.app.json 配置详解

在现代前端工程（如使用 Vite 创建的项目）中，通常会将 TypeScript 配置文件拆分为多个部分，以适应不同的运行环境（浏览器端和 Node.js 端）。`tsconfig.app.json` 专门用于配置**浏览器端应用代码**的编译选项。

## 1. 为什么需要 tsconfig.app.json？

传统的单一 `tsconfig.json` 难以同时完美支持前端代码（DOM 环境）和构建工具代码（Node 环境）。

- **前端代码**：运行在浏览器，需要 DOM 类型定义，不需要 Node 类型定义。
- **构建脚本**（如 `vite.config.ts`）：运行在 Node.js，需要 Node 类型定义，不需要 DOM 类型定义。

因此，最佳实践是：

1.  **tsconfig.json**：作为入口，使用 `references` 引用其他配置文件。
2.  **tsconfig.app.json**：负责 `src` 目录下的业务代码。
3.  **tsconfig.node.json**：负责 `vite.config.ts` 等工具配置文件。

---

## 2. Vue 3 + Vite 配置示例

以下是 Vue 3 + Vite 项目中典型的 `tsconfig.app.json` 配置：

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "noEmit": true,

    /* 路径别名 (需要与 vite.config.ts 保持一致) */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 关键字段解析

| 字段                 | 值                      | 含义与作用                                                                                    |
| :------------------- | :---------------------- | :-------------------------------------------------------------------------------------------- |
| **extends**          | `@vue/tsconfig/...`     | 继承 Vue 官方推荐的基础配置，包含了解析 `.vue` 文件所需的设置。                               |
| **include**          | `["src/**/*.vue", ...]` | 显式包含 `.vue` 文件，确保 TypeScript 能识别 Vue 组件。                                       |
| **composite**        | `true`                  | 启用**项目引用 (Project References)**，允许该配置被根 `tsconfig.json` 引用，并支持增量构建。  |
| **moduleResolution** | `Bundler`               | 专为打包工具（Vite, Webpack 5+）设计的模块解析策略，支持 `package.json` 中的 `exports` 字段。 |
| **jsx**              | `preserve`              | 在 Vue 中，JSX 通常由 Babel 或 Vite 插件处理，TS 只需保留原样即可。                           |
| **noEmit**           | `true`                  | **不输出编译文件**。Vite 使用 esbuild 进行转译，TS 仅用于类型检查。                           |

---

## 3. React + Vite 配置示例

以下是 React + Vite 项目中典型的 `tsconfig.app.json` 配置：

```json
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### 关键字段解析

| 字段                           | 值          | 含义与作用                                                                                                                   |
| :----------------------------- | :---------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **target**                     | `ES2020`    | 指定编译目标为 ES2020，兼顾现代浏览器特性与兼容性。                                                                          |
| **useDefineForClassFields**    | `true`      | 符合 ECMAScript 标准的类字段实现（与旧版 TS 行为不同）。                                                                     |
| **allowImportingTsExtensions** | `true`      | 允许在 import 语句中显式写 `.ts` / `.tsx` 后缀（需配合 `noEmit: true` 使用）。                                               |
| **isolatedModules**            | `true`      | 强制每个文件作为独立模块编译。这对 Vite (esbuild) 很重要，因为 esbuild 是单文件转译，不支持跨文件类型分析（如 const enum）。 |
| **jsx**                        | `react-jsx` | 使用 React 17+ 的新 JSX 转换（自动引入 `_jsx`，无需手动 `import React`）。                                                   |

---

## 4. 常见问题

### 1. 为什么我的 TS 报错 "Cannot find module '...'"？

- **原因**：可能是 `include` 没包含该文件，或者 `paths` 别名未配置。
- **解决**：检查 `tsconfig.app.json` 的 `include` 数组是否覆盖了报错文件；确认 `paths` 配置与 `vite.config.ts` 中的 `resolve.alias` 一致。

### 2. 什么是 `tsBuildInfoFile`？

- 它是增量编译信息的存储文件。当开启 `composite: true` 时，TS 会生成这个文件来记录上一次编译的状态，从而在下次编译时只重新编译变更的部分，显著提高类型检查速度。

### 3. `moduleResolution: "Bundler"` 和 `"Node"` 有什么区别？

- `Node`：模拟 Node.js 的模块解析算法（查找 `node_modules`，不支持 `exports` 条件导出）。
- `Bundler`：TS 5.0+ 引入，模拟现代打包工具的行为，支持 `package.json` 中的 `exports`，允许导入没有扩展名的文件等，是 Vite 项目的首选。
