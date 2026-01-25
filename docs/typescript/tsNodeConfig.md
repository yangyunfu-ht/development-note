# tsconfig.node.json 配置详解

在 Vite 等现代前端项目中，`tsconfig.node.json` 专门用于配置**运行在 Node.js 环境下的代码**的编译选项。

## 1. 为什么需要 tsconfig.node.json？

项目中的某些文件（如 `vite.config.ts`, `vitest.config.ts` 以及自定义脚本）是运行在 Node.js 环境中的，而不是浏览器环境。

- **运行环境差异**：
  - Node 环境代码需要 Node 的类型定义 (`@types/node`)。
  - Node 环境代码通常使用 CommonJS 或 ES Modules (Node 规范)，不需要 DOM API。
- **避免类型冲突**：如果将 DOM 类型库和 Node 类型库混合在同一个配置文件中，可能会导致全局变量冲突（例如 `setTimeout` 返回值类型不同）。

因此，将 Node 环境的配置单独抽离到 `tsconfig.node.json` 是最佳实践。

---

## 2. Vue 3 + Vite 配置示例

以下是 Vue 3 + Vite 项目中典型的 `tsconfig.node.json` 配置：

```json
{
  "extends": "@vue/tsconfig/tsconfig.node.json",
  "include": [
    "vite.config.*",
    "vitest.config.*",
    "cypress.config.*",
    "nightwatch.conf.*",
    "playwright.config.*"
  ],
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"]
  }
}
```

### 关键字段解析

| 字段                 | 值                       | 含义与作用                                                                                   |
| :------------------- | :----------------------- | :------------------------------------------------------------------------------------------- |
| **extends**          | `@vue/tsconfig/...`      | 继承 Vue 官方推荐的 Node 环境基础配置。                                                      |
| **include**          | `["vite.config.*", ...]` | 明确指定哪些文件属于 Node 环境（通常是各种配置文件）。                                       |
| **composite**        | `true`                   | 启用项目引用，允许被根 `tsconfig.json` 引用。                                                |
| **module**           | `ESNext`                 | 使用现代 ES 模块语法（Vite 默认支持 ESM 配置）。                                             |
| **moduleResolution** | `Bundler`                | 使用现代打包工具的模块解析策略。                                                             |
| **types**            | `["node"]`               | 显式包含 Node.js 的类型定义，避免污染全局空间（如果没有这个，可能需要手动在文件中 import）。 |

---

## 3. React + Vite 配置示例

以下是 React + Vite 项目中典型的 `tsconfig.node.json` 配置：

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 关键字段解析

| 字段                             | 值                   | 含义与作用                                        |
| :------------------------------- | :------------------- | :------------------------------------------------ |
| **moduleResolution**             | `bundler`            | 配合 Vite 使用，确保能正确解析包的 `exports`。    |
| **allowSyntheticDefaultImports** | `true`               | 允许默认导入没有默认导出的模块（Node 环境常见）。 |
| **include**                      | `["vite.config.ts"]` | 仅包含 Vite 配置文件。                            |

---

## 4. 常见问题

### 1. 为什么 `tsconfig.node.json` 中没有 `lib: ["DOM"]`？

- 因为这些代码运行在 Node.js 环境中，不存在 DOM 对象（如 `window`, `document`）。如果引入 DOM 库，可能会在编写 Node 脚本时意外使用了浏览器 API，导致运行时错误。

### 2. 根目录的 `tsconfig.json` 是如何引用它的？

- 在根目录的 `tsconfig.json` 中，通过 `references` 字段引用：
  ```json
  {
    "files": [],
    "references": [
      { "path": "./tsconfig.app.json" },
      { "path": "./tsconfig.node.json" }
    ]
  }
  ```
  这样 TypeScript 就能知道项目被分成了两个独立的部分，分别应用不同的规则。

### 3. 如果我有自定义脚本 `scripts/build.ts`，应该加在哪里？

- 应该加在 `tsconfig.node.json` 的 `include` 数组中：
  ```json
  "include": ["vite.config.*", "scripts/**/*"]
  ```
  因为这些脚本通常也是在 Node 环境下运行的。
