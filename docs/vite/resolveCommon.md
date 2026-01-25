# Vite 中 CommonJS 模块的处理与使用

Vite 作为一个基于 ES Modules (ESM) 的构建工具，在开发服务器启动时，默认将所有代码视为原生 ESM 并在浏览器中执行。然而，现有的 npm 生态中仍存在大量的 CommonJS (CJS) 格式的包。

Vite 提供了一套完善的机制来处理这些 CJS 模块，确保它们能在 ESM 环境中正常工作。

## 1. 依赖预构建 (Dependency Pre-bundling)

这是 Vite 处理 CommonJS 依赖的核心机制。

当你启动 `vite` 开发服务器时，Vite 会首先进行**依赖预构建**。它使用 **esbuild** 扫描你的源码，发现所有导入的依赖项。

- **CommonJS 转 ESM**：如果 Vite 发现某个依赖是 CommonJS 格式（例如 React），esbuild 会自动将其转换为 ESM 格式。
- **性能优化**：将许多内部模块的 CJS 包捆绑成单个 ESM 模块，减少网络请求。

**示例**：

```javascript
// 你的代码 (ESM)
import React from "react";

// React 本身发布的是 CommonJS 格式，
// 但 Vite 会在预构建阶段将其转换为 ESM，
// 所以浏览器收到的是转化后的 ESM 模块。
```

此过程是自动的，通常无需配置。相关的缓存文件存放在 `node_modules/.vite` 目录中。

### 进阶配置：optimizeDeps

虽然 Vite 的自动扫描很强大，但有时也需要手动干预。可以在 `vite.config.ts` 中配置 `optimizeDeps`。

#### optimizeDeps.include

默认情况下，Vite 只会扫描 `node_modules` 中的依赖。如果你有一个巨大的 CJS 依赖，或者动态导入的依赖没有被自动发现，可以强制包含它。

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ["linked-dep", "some-library/sub-package"],
  },
});
```

#### optimizeDeps.exclude

如果你确定某个包已经是 ESM 格式，或者不希望它被预构建，可以将其排除。

```typescript
export default defineConfig({
  optimizeDeps: {
    exclude: ["your-esm-package"],
  },
});
```

## 2. 在源码中引入 CommonJS 模块

### 引入第三方 CJS 库

你可以直接使用 `import` 语法引入 CommonJS 格式的第三方库，Vite 会自动处理兼容性。

```javascript
import _ from "lodash"; // lodash 是 CJS
import moment from "moment"; // moment 也是 CJS

console.log(_.join(["a", "b"], "~"));
```

### 引入本地 CJS 文件

如果你的项目中存在 `.js` 文件是 CommonJS 格式（使用 `module.exports`），Vite 可能会报错，因为 Vite 默认将 `.js` 文件视为 ESM。

**推荐做法**：
将本地文件重构为 ESM 格式（使用 `export default` 或 `export const`）。

**必须使用 CJS 的情况**：
如果必须在源码中使用 CJS 文件，可以将文件后缀改为 `.cjs`（Node.js 标准），Vite 会识别该后缀并进行适当处理（但在浏览器端直接运行 CJS 仍需注意兼容性，通常建议迁移）。

## 3. 在源码中使用 `require` 语法

Vite 面向现代浏览器，而浏览器原生不支持 `require`。因此，**在 Vite 项目的源码中直接使用 `require` 通常会报错**：

```
Uncaught ReferenceError: require is not defined
```

### 解决方案

#### 方案 A：使用 `import` 代替 (推荐)

绝大多数 `require` 场景都可以用静态 `import` 或动态 `import()` 替代。

```javascript
// ❌ 错误
const data = require("./data.json");

// ✅ 正确 (静态导入)
import data from "./data.json";

// ✅ 正确 (动态导入，对应 require 的动态加载)
const module = await import("./module.js");
```

#### 方案 B：使用 `vite-plugin-commonjs` (迁移过渡)

如果你正在迁移一个老旧的 Webpack 项目，且代码中包含大量 `require` 无法短时间重构，可以使用社区插件。

1. 安装插件：

   ```bash
   pnpm add -D vite-plugin-commonjs
   ```

2. 配置 `vite.config.ts`：

   ```typescript
   import { defineConfig } from "vite";
   import commonjs from "vite-plugin-commonjs";

   export default defineConfig({
     plugins: [commonjs()],
   });
   ```

   该插件会在构建时将 `require` 转换为 ESM 的导入代码。

## 4. 常见问题与排查

### 问题 1: "The requested module ... does not provide an export named 'default'"

**原因**：你尝试使用 `import foo from 'dep'` (默认导入)，但该 CommonJS 模块导出的对象可能不支持 ESM 的默认导出互操作机制。

**解决**：

1. **尝试命名导入**：

   ```javascript
   import { someMethod } from "dep";
   ```

2. **使用 `* as` 语法**：
   ```javascript
   import * as dep from "dep";
   console.log(dep.default || dep);
   ```

### 问题 2: Node.js 内置模块缺失 (process, Buffer)

很多 CommonJS 包是为 Node.js 环境编写的，可能依赖 `process.env` 或 `Buffer`。在浏览器中运行时会报错。

**解决**：使用 `vite-plugin-node-polyfills`。

```bash
pnpm add -D vite-plugin-node-polyfills
```

```typescript
// vite.config.ts
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [nodePolyfills()],
});
```
