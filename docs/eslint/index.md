# ESLint 9 扁平化配置 (Flat Config)

::: tip 简介
ESLint 9 引入了全新的扁平化配置系统（Flat Config），这是 ESLint 有史以来最大的变化。新的配置方式更加直观、模块化，彻底解决了旧版配置中 `extends` 依赖地狱和层叠优先级混乱的问题。配置文件名通常为 `eslint.config.js` (或 `.mjs`, `.cjs`)。
:::

## 1. 扁平化配置核心概念

### 1.1 为什么需要 Flat Config？

- **单一数组**：配置导出一个包含多个配置对象的数组，按顺序合并。
- **显式依赖**：不再使用字符串名称（如 `extends: ["plugin:vue/recommended"]`）去查找插件，而是直接导入 JS 模块。
- **作用域清晰**：每个配置对象可以单独指定 `files` 和 `ignores`，精准控制生效范围。

### 1.2 基础结构

```javascript
// eslint.config.js
import js from "@eslint/js";

export default [
  // 1. 全局忽略
  { ignores: ["dist", "coverage"] },

  // 2. 基础 JS 规则
  js.configs.recommended,

  // 3. 自定义规则
  {
    files: ["src/**/*.js"],
    rules: {
      "no-console": "warn",
    },
  },
];
```

## 2. Vue3 + TypeScript + Vite 配置指南

在 Vue3 项目中，我们需要同时处理 `.vue`, `.ts`, `.js` 文件，并兼容 TypeScript 解析。

### 2.1 安装依赖

```bash
pnpm add -D eslint globals @eslint/js typescript-eslint eslint-plugin-vue
```

### 2.2 配置文件 (`eslint.config.js`)

```javascript
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default [
  // 1. 指定全局文件匹配
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
  },

  // 2. 忽略文件 (等同于 .eslintignore)
  {
    ignores: ["dist/**", "node_modules/**", "public/**"],
  },

  // 3. 语言选项配置 (Globals)
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // 4. 引入推荐配置
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"], // vue3-essential

  // 5. Vue 特殊解析配置 (必须)
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  // 6. 自定义规则
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
];
```

## 3. React + TypeScript + Vite 配置指南

React 项目需要额外处理 JSX/TSX 语法以及 React Hooks 规则。

### 3.1 安装依赖

```bash
pnpm add -D eslint globals @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

### 3.2 配置文件 (`eslint.config.js`)

```javascript
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

export default tseslint.config(
  // 1. 全局忽略
  { ignores: ["dist"] },

  // 2. 扩展推荐配置 (利用 tseslint.config 辅助函数合并)
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // 3. 插件配置
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react,
    },
    // 4. 规则配置
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // React 17+ 不需要引入 React
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },
);
```

## 4. 关键配置详解

### 4.1 languageOptions

替代了旧版的 `env`, `globals`, `parser` 和 `parserOptions`。

- **ecmaVersion**: 指定 ECMAScript 版本 (如 2022, "latest")。
- **sourceType**: 通常为 "module"。
- **globals**: 全局变量，现在通过 `globals` 包引入（如 `globals.browser`）。
- **parser**: 自定义解析器（如 `@typescript-eslint/parser` 或 `vue-eslint-parser`）。

### 4.2 plugins

插件不再通过字符串名称引用，而是直接引入对象。

```javascript
import myPlugin from "eslint-plugin-my-plugin";

export default [
  {
    plugins: {
      custom: myPlugin, // 给插件起别名为 custom
    },
    rules: {
      "custom/rule-name": "error",
    },
  },
];
```

### 4.3 rules

规则配置与旧版保持一致，但优先级逻辑变为：**数组后方的配置覆盖前方**。

```javascript
export default [
  pluginJs.configs.recommended, // 开启 no-console
  {
    rules: {
      "no-console": "off", // 这里覆盖前面的配置，关闭 no-console
    },
  },
];
```

## 5. 迁移旧项目

如果你想将旧项目迁移到 Flat Config，可以使用官方助手：

```bash
npx @eslint/migrate-config .eslintrc.json
```

该命令会尝试将现有的 `.eslintrc` 转换为 `eslint.config.js`。不过，由于插件生态的更新进度不同，手动调整通常是不可避免的。
