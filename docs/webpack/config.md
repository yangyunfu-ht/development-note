# Webpack 配置详解

Webpack 的配置通常在一个名为 `webpack.config.js` 的文件中进行。它本质上是导出一个 JavaScript 对象。

## 1. 核心配置概览

一个完整的 Webpack 配置结构如下：

```javascript
const path = require("path");

module.exports = {
  // 1. 模式 Mode
  mode: "production", // 'development', 'production', 'none'

  // 2. 入口 Entry
  entry: "./src/index.js",

  // 3. 输出 Output
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // 自动清理 dist 目录
  },

  // 4. 模块 Module (Loader)
  module: {
    rules: [
      // 各种 Loader 配置
    ],
  },

  // 5. 插件 Plugins
  plugins: [
    // 各种 Plugin 实例
  ],

  // 6. 解析 Resolve
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".json", ".vue"],
  },

  // 7. 开发服务器 DevServer
  devServer: {
    hot: true,
    port: 3000,
  },

  // 8. 优化 Optimization
  optimization: {
    // 代码分割等优化配置
  },
};
```

---

## 2. Entry (入口)

指定 Webpack 应该使用哪个模块来作为构建其内部依赖图的开始。

### 单入口 (SPA)

```javascript
entry: "./src/index.js";
```

### 多入口 (MPA)

```javascript
entry: {
  app: './src/app.js',
  admin: './src/admin.js'
}
```

---

## 3. Output (输出)

告诉 Webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件。

- **path**: 输出目录的绝对路径。
- **filename**: 输出文件的名称。可以使用占位符如 `[name]` (入口名), `[contenthash]` (根据内容生成的 hash)。
- **clean**: 在生成文件之前清空 output 目录 (Webpack 5+)。

```javascript
output: {
  filename: '[name].[contenthash].js',
  path: path.resolve(__dirname, 'dist'),
  clean: true
}
```

---

## 4. Mode (模式)

通过选择 `development`, `production` 或 `none` 之中的一个，来设置 `mode` 参数，你可以启用 Webpack 内置在相应环境下的优化。

- **development**: 会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `development`。启用 `NamedChunksPlugin` 和 `NamedModulesPlugin`。
- **production**: 会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `production`。启用 `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin`, `TerserPlugin` 等。

---

## 5. Module (模块/Loader)

决定了如何处理不同类型的模块。最常用的是 `rules` 数组，用于配置 Loader。

每个规则通常包含：

- **test**: 匹配文件的正则表达式。
- **use**: 使用哪些 Loader（从右向左执行）。
- **exclude**: 排除某些文件夹（如 `node_modules`）。

```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: "asset/resource", // Webpack 5 内置资源处理
    },
  ];
}
```

---

## 6. Plugins (插件)

用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })];
```

---

## 7. Resolve (解析)

配置模块如何解析。

- **alias**: 创建 import 或 require 的别名，确保存储路径更简单。
- **extensions**: 自动解析确定的扩展名，引入模块时不带扩展名。

```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src')
  },
  extensions: ['.js', '.vue', '.json']
}
```

---

## 8. DevServer (开发服务器)

`webpack-dev-server` 提供了一个简单的 web server，并且能够实时重新加载。

- **static**: 告诉服务器从哪里提供内容。
- **compress**: 启用 gzip 压缩。
- **port**: 指定端口。
- **hot**: 启用模块热替换 (HMR)。
- **proxy**: 配置代理，解决开发环境跨域问题。

```javascript
devServer: {
  static: './dist',
  port: 8080,
  hot: true,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      pathRewrite: { '^/api': '' }
    }
  }
}
```

---

## 9. Optimization (优化)

Webpack 4+ 引入了 `optimization` 属性，用于手动配置和覆盖默认的优化。

- **splitChunks**: 代码分割，提取公共代码或第三方库。
- **minimizer**: 允许你通过提供一个或多个定制的 `TerserPlugin` 实例，覆盖默认压缩工具(minimizer)。

```javascript
optimization: {
  splitChunks: {
    chunks: "all"; // 对同步和异步代码都进行分割
  }
}
```

---

## 10. Devtool (SourceMap)

控制是否生成，以及如何生成 source map。

- **source-map**: 生成独立的 .map 文件，最详细但最慢。
- **eval-source-map**: 每个模块使用 eval() 执行，并且 source map 转换为 DataUrl 后添加到 eval() 中。开发环境推荐。
- **hidden-source-map**: 生成 .map 文件，但不引用它。

```javascript
// 开发环境
devtool: "eval-source-map";

// 生产环境
devtool: "source-map";
```
