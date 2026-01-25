# Webpack 中 Loader 和 Plugin 的区别

Loader 和 Plugin 是 Webpack 的核心概念，理解它们的区别对于掌握前端工程化至关重要。

## 1. Loader (加载器)

### 1.1 概念

Webpack 本身只能处理 JavaScript 和 JSON 文件。Loader 让 Webpack 能够去处理其他类型的文件（如 CSS、Images、TypeScript、Vue 等），并将它们转换为有效的模块，以供应用程序使用，以及被添加到依赖图中。

### 1.2 作用

- **编译转换**：将非 JS 模块转化为 JS 模块（如 `babel-loader` 将 ES6+ 转为 ES5，`sass-loader` 将 SCSS 转为 CSS）。
- **文件处理**：将文件输出到输出目录，并返回路径（如 `file-loader`）。

### 1.3 运行时机

Loader 在打包构建过程中运行，主要是在模块解析阶段。当 Webpack 遇到不认识的模块时，会根据配置去查找对应的 Loader 进行转换。

### 1.4 常见 Loader

- `babel-loader`: 转换 ES6+ 语法。
- `css-loader`: 处理 CSS 文件中的 `@import` 和 `url()`。
- `style-loader`: 将 CSS 注入到 DOM 的 `<style>` 标签中。
- `sass-loader` / `less-loader`: 预处理器转换。
- `file-loader` / `url-loader`: 处理图片、字体等静态资源。
- `ts-loader`: 将 TypeScript 转换为 JavaScript。

### 1.5 配置示例

Loader 在 `module.rules` 中配置，通常包括 `test`（匹配文件）和 `use`（使用的 Loader，**从右向左/从下向上**执行）。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader", // 2. 将 JS 字符串生成为 style 节点
          "css-loader", // 1. 将 CSS 转化成 CommonJS 模块
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
```

---

## 2. Plugin (插件)

### 2.1 概念

Plugin 是一个扩展器，它直接作用于 Webpack 的**完整构建生命周期**。Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

### 2.2 作用

Plugin 的功能更加强大和灵活，可以执行范围更广的任务：

- 打包优化（压缩代码、代码分割）
- 资源管理（自动生成 HTML、清理输出目录）
- 环境变量注入
- 错误处理

### 2.3 运行时机

Plugin 在整个 Webpack 构建过程中都会运行，从启动到结束。

### 2.4 常见 Plugin

- `HtmlWebpackPlugin`: 自动生成 HTML 文件并注入打包后的 JS。
- `CleanWebpackPlugin`: 每次打包前清理输出目录。
- `MiniCssExtractPlugin`: 将 CSS 提取为单独的文件。
- `DefinePlugin`: 定义环境变量。
- `HotModuleReplacementPlugin`: 模块热替换 (HMR)。

### 2.5 配置示例

Plugin 在 `plugins` 数组中配置，通常需要 `new` 一个实例。

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  plugins: [
    new CleanWebpackPlugin(), // 打包前清理 dist 目录
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 以 index.html 为模板
    }),
  ],
};
```

---

## 3. 核心区别对比

| 维度         | Loader                                     | Plugin                                                |
| :----------- | :----------------------------------------- | :---------------------------------------------------- |
| **概念**     | 转换器（Translator）                       | 扩展器（Extender）                                    |
| **作用**     | 让 Webpack 能加载非 JS 文件，进行源码转换  | 扩展 Webpack 功能，监听生命周期事件                   |
| **运行时机** | 在模块加载和解析阶段运行                   | 在整个构建周期（编译、emit、done等）运行              |
| **配置方式** | 在 `module.rules` 中配置，针对特定文件类型 | 在 `plugins` 数组中配置，通常需要 `new` 实例          |
| **底层机制** | 导出一个函数，接收源文件内容，返回转换结果 | 是一个类，需要实现 `apply` 方法，利用 `compiler` 钩子 |

### 形象比喻

- **Loader** 就像是**翻译官**。Webpack 只能听懂 JavaScript，Loader 负责把其他语言（CSS, TS, Image）翻译成 JavaScript 给 Webpack 听。
- **Plugin** 就像是**管家**。他不负责具体的翻译工作，而是负责统筹全局，比如安排什么时候打扫卫生（Clean），什么时候准备餐具（Html），什么时候把东西打包好（Compress）。

---

## 4. 手写简易示例 (扩展)

### 手写 Loader

Loader 就是一个函数，接收源代码，返回转换后的代码。

```javascript
// my-loader.js
module.exports = function (source) {
  // 将源代码中的 "World" 替换为 "Webpack"
  return source.replace("World", "Webpack");
};
```

### 手写 Plugin

Plugin 是一个类，必须定义 `apply` 方法。

```javascript
// MyPlugin.js
class MyPlugin {
  apply(compiler) {
    // 监听 'done' 事件（编译完成）
    compiler.hooks.done.tap("MyPlugin", (stats) => {
      console.log("打包完成啦！");
    });
  }
}

module.exports = MyPlugin;
```
