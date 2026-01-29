# Rollup 配置详解

Rollup 的配置文件通常是根目录下的 `rollup.config.js`。它导出一个对象（或对象数组），定义了打包过程的各种选项。

## 基础配置结构

```js
// rollup.config.js
export default {
  // 核心输入选项
  input: "src/main.js",

  // 核心输出选项
  output: {
    file: "dist/bundle.js",
    format: "cjs",
    sourcemap: true,
  },

  // 插件
  plugins: [],

  // 外部依赖
  external: [],
};
```

## 核心选项详解

### input (必填)

打包的入口文件。可以是字符串、字符串数组或对象（用于多入口）。

```js
// 单入口
input: 'src/main.js'

// 多入口 (对象形式推荐)
input: {
  main: 'src/main.js',
  vendor: 'src/vendor.js'
}
```

### output (必填)

定义输出文件的位置和格式。可以是一个对象（单输出）或数组（多输出）。

```js
output: [
  // CommonJS (Node.js)
  {
    file: "dist/bundle.cjs.js",
    format: "cjs",
  },
  // ES Module (现代浏览器/打包工具)
  {
    file: "dist/bundle.esm.js",
    format: "es",
  },
  // UMD (浏览器/Node.js 通用)
  {
    file: "dist/bundle.umd.js",
    format: "umd",
    name: "MyBundle", // UMD 格式必须指定 name，作为全局变量名
    globals: {
      jquery: "$", // 告诉 Rollup 全局变量 $ 对应外部依赖 jquery
    },
  },
];
```

**常用 output 选项:**

- `dir`: 输出目录（用于多入口或代码分割）。
- `file`: 输出文件名（仅适用于单入口）。
- `format`: `amd`, `cjs`, `es`, `iife`, `umd`, `system`。
- `sourcemap`: 是否生成 source map (`true`, `false`, `'inline'`)。
- `exports`: 导出模式 (`auto`, `default`, `named`, `none`)。

### external

指定哪些模块不应被打包进 bundle，而是作为外部依赖引入。

```js
// 字符串数组
external: ["react", "react-dom"];

// 正则表达式 (排除 lodash 及其子路径)
external: [/^lodash/];
```

### plugins

Rollup 的插件生态非常丰富，用于处理非 JS 文件、转换代码等。

**常用插件:**

- `@rollup/plugin-node-resolve`: 解析 node_modules 中的模块。
- `@rollup/plugin-commonjs`: 将 CommonJS 模块转换为 ES6。
- `@rollup/plugin-babel`: 使用 Babel 编译代码。
- `@rollup/plugin-typescript`: 支持 TypeScript。
- `@rollup/plugin-terser`: 压缩代码。
- `@rollup/plugin-json`: 支持导入 JSON 文件。

**使用示例:**

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
  plugins: [
    resolve(), // 查找 node_modules
    commonjs(), // 转换 CJS -> ESM
    terser(), // 压缩
  ],
};
```

## 高级配置

### 多入口与代码分割

当 `input` 为多入口或使用了动态导入 (`import()`) 时，Rollup 会自动进行代码分割。此时 `output` 必须使用 `dir` 而不是 `file`。

```js
export default {
  input: {
    app: "src/app.js",
    admin: "src/admin.js",
  },
  output: {
    dir: "dist",
    format: "es",
    entryFileNames: "[name]-[hash].js",
    chunkFileNames: "chunks/[name]-[hash].js",
  },
};
```

### 使用 TypeScript 编写配置

你可以使用 `rollup.config.ts`，需要安装 `rollup` 和 `@rollup/plugin-typescript` 等依赖，并使用 `--configPlugin typescript` 运行。

```bash
npm install -D tslib @rollup/plugin-typescript typescript
```

```ts
// rollup.config.ts
import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
  },
  plugins: [typescript()],
});
```

## 最佳实践

1. **Library 开发**: 推荐同时输出 `esm` (供打包工具使用) 和 `cjs` (供 Node.js 使用) 格式。
2. **Tree Shaking**: 确保 package.json 中 `sideEffects: false` 以获得更好的 Tree Shaking 效果。
3. **Peer Dependencies**: 将 `react` 等宿主环境提供的库设为 `external`，并在 `peerDependencies` 中声明。
