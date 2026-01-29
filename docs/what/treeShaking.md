# Tree Shaking 详解

Tree Shaking（摇树优化）是一个术语，通常用于描述移除 JavaScript 上下文中未引用代码（Dead Code）的过程。

想象一棵树（你的项目），你用力摇晃它（构建过程），枯萎的树叶（未使用的代码）就会掉落下来，剩下的就是绿色的活树叶（真正运行的代码）。

## 1. 核心原理

Tree Shaking 依赖于 **ES Modules (ESM)** 的静态结构特性。

- **静态分析**：ES6 的模块语法（`import` 和 `export`）是静态的，这意味着模块的依赖关系在编译时就能确定，而不需要运行代码。
- **CommonJS 的局限**：CommonJS（`require`）是动态的，模块的导入导出可以在运行时根据条件改变，因此很难进行静态分析和 Tree Shaking。

构建工具（如 Webpack、Rollup、Vite）通过静态分析源码，标记出哪些导出值没有被其他模块使用，并在最终打包时将其剔除。

## 2. 作用与优势

- **减少代码体积**：移除大量未使用的库代码和业务代码，显著减小 Bundle 大小。
- **提升加载速度**：文件更小，网络传输更快，浏览器解析和执行时间更短。
- **优化性能**：特别是对于移动端用户，减少带宽消耗和电量消耗。

## 3. 如何实现 Tree Shaking

现代构建工具通常都内置了 Tree Shaking 功能，但需要满足特定条件。

### 3.1 前提条件

1. **使用 ES Modules**：确保你的代码和依赖库使用 `import/export` 语法。
2. **构建模式**：通常只在生产环境构建（Production Build）时生效。

### 3.2 在 Webpack 中使用

在 Webpack 4+ 中，`mode: 'production'` 会默认开启 Tree Shaking。

关键配置在于 `package.json` 中的 `sideEffects` 属性。

#### `sideEffects` 配置

构建工具在移除代码时非常谨慎。如果一个文件引入了但没有被使用，工具需要确认移除它是否安全。

**副作用 (Side Effect)** 指的是文件在被导入时执行了某些操作（如修改全局变量、添加 Polyfill、执行 CSS 导入），而不仅仅是导出成员。

- **场景**：

  ```javascript
  import "./utils"; // 仅仅是导入，没有赋值给变量
  ```

  如果 `utils.js` 里面修改了 `window.utils = {}`，这就是副作用。如果 Webpack 把它摇掉了，功能就会挂。

- **配置方法**：
  在 `package.json` 中告诉 Webpack 你的包是否有副作用：

  ```json
  // package.json
  {
    "name": "my-project",
    // 1. 声明所有文件都没有副作用（最激进的优化）
    "sideEffects": false,

    // 2. 或者，声明数组，列出有副作用的文件（不应该被摇掉）
    "sideEffects": [
      "*.css", // CSS 文件通常有副作用（插入 style 标签）
      "./src/polyfill.js"
    ]
  }
  ```

### 3.3 在 Vite / Rollup 中使用

Vite 的生产环境构建基于 **Rollup**。Rollup 默认支持并开启 Tree Shaking。

- Vite 同样遵循 `package.json` 中的 `sideEffects` 属性。
- 确保引入的第三方库是 ESM 版本（通常库的 `package.json` 中 `module` 字段指向 ESM 入口）。

## 4. 编写 Tree Shaking 友好的代码

为了最大化 Tree Shaking 的效果，建议遵循以下实践：

### ❌ 避免：将所有东西捆绑在一个对象中导出

```javascript
// math.js
export default {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};

// index.js
import math from "./math";
console.log(math.add(1, 2));
```

这种写法很难被优化，因为 `math` 对象作为一个整体被使用了，构建工具很难判断 `subtract` 是否可以安全移除（对象属性可能被动态访问）。

### ✅ 推荐：使用原子化导出 (Named Exports)

```javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// index.js
import { add } from "./math";
console.log(add(1, 2));
```

此时，`subtract` 函数没有被引用，构建工具可以安全地将其移除。

### ✅ 推荐：使用纯函数

保持函数无副作用（Pure Function），不仅利于测试，也利于 Tree Shaking 识别死代码。

## 5. 总结

| 特性         | 说明                                                              |
| :----------- | :---------------------------------------------------------------- |
| **定义**     | 移除 JavaScript 上下文中未引用的代码。                            |
| **基础**     | 必须基于 **ES Modules** (静态分析)。                              |
| **配置**     | 生产环境默认开启；通过 `package.json` 的 `sideEffects` 辅助判断。 |
| **核心技巧** | 使用具名导出 (Named Exports)，避免默认导出大对象；标记无副作用。  |
