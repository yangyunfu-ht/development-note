# Webpack 中 Loader 和 Plugin

## 1. 本质区别

| 维度         | Loader                                                             | Plugin                                                               |
| :----------- | :----------------------------------------------------------------- | :------------------------------------------------------------------- |
| **本质**     | **翻译官**。它是一个函数，用于转换代码。                           | **多面手**。它是一个类（Class），通过钩子函数影响构建流程。          |
| **职责**     | 将非 JS 文件（如 .css, .vue, .png）转换为 Webpack 认识的 JS 模块。 | 解决 Loader 无法实现的其他功能（如：压缩、资源管理、环境变量注入）。 |
| **执行时机** | 在模块编译阶段（从入口开始解析依赖时）执行。                       | 贯穿整个编译周期，从启动到输出都有对应的钩子。                       |
| **配置方式** | 在 `module.rules` 中配置，针对特定文件类型                         | 在 `plugins` 数组中配置，通常需要 `new` 实例                         |
| **底层机制** | 导出一个函数，接收源文件内容，返回转换结果                         | 是一个类，需要实现 `apply` 方法，利用 `compiler` 钩子                |

## 2. Loader：专注转换

Webpack 默认只认识 **JavaScript** 和 **JSON** 文件。Loader 的存在就是为了实现“万物皆模块”。

- **单一职责：** 一个 Loader 只做一件事（例如 sass-loader 只负责把 Sass 转成 CSS）。
- **链式调用：** Loader 支持组合使用，执行顺序是 从右往左 或 从下往上。

```javascript
// 配置示例
module: {
  rules: [
    {
      test: /\.scss$/,
      use: [
        "style-loader", // 3. 将 JS 中的样式插入到 DOM
        "css-loader", // 2. 将 CSS 转为 CommonJS 模块
        "sass-loader", // 1. 将 Sass 转为 CSS
      ],
    },
  ];
}
```

## 3. Plugin：专注流程控制

Plugin 并不直接操作单个文件，它通过监听 Webpack 编译过程中的**生命周期**钩子（Lifecycle Hooks）来执行复杂的任务。

- **功能更广：** 它能接触到 Webpack 的 compiler（编译器实例）和 compilation（当前的构建上下文）。
- **配置方式：** 在 plugins 数组中通过 new 实例化。

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    // 自动生成 HTML 并自动引入打包后的 JS
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    // 进度条显示插件
    new WebpackBar(),
  ],
};
```

## 4. 形象类比

- **Loader** 就像是语言翻译： 如果你给 Webpack 这本“书”喂了一段德语（CSS），它看不懂，这时候你需要德语翻译（css-loader）把它翻成中文（JS）。

- **Plugin** 就像是整容手术/包装工： 书翻好了之后，Plugin 可以跑过来给这本书加个封面（HtmlWebpackPlugin），或者把书里的废话删掉压缩体积（UglifyJSPlugin），甚至在书的末尾盖个戳（BannerPlugin）。

## 5. 避坑指南

很多初学者会混淆：“为什么提取 CSS 要先用 Loader 再用 Plugin？”

- **Loader 阶段**：负责识别 .css 文件并把它带进 JS 世界。
- **Plugin 阶段**：负责在最后关头，把这些已经被带进 JS 的样式强行“抠”出来，存成独立的文件。

## 6. 自定义 Loader

loader的本质就是**导出一个 JavaScript 函数**。

### 1. 场景设定

假设我们要处理一种后缀为 .txt 的文件，它的内容是简单的变量声明，比如： `message = "Hello Gemini"`

我们希望 Loader 把它转换成 JS 代码： `export default "Hello Gemini"`

### 2. 实现自定义 Loader

创建一个 txt-loader.js：

```javascript
/**
 * @param {string|Buffer} source 资源文件的内容
 * @return {string} 转换后的 JS 代码
 */
module.exports = function (source) {
  // 1. 获取内容逻辑
  // source 是 'message = "Hello Gemini"'
  const value = source.split("=")[1]?.trim();

  // 2. 返回一个符合 JS 语法的字符串
  // 这样 Webpack 才能把它当成一个模块处理
  return `export default ${value};`;
};
```

### 3. 如何在 Webpack 中配置

```javascript
// webpack.config.js
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: [
          {
            // 指向你本地的 loader 文件
            loader: path.resolve(__dirname, "./loaders/txt-loader.js"),
            options: {
              // 你可以传入一些自定义参数
              prefix: "Vite",
            },
          },
        ],
      },
    ],
  },
};
```

### 4. 获取 Loader 中的参数

通常使用 `loader-utils`（旧版）或 `this.getOptions()`（新版 Webpack 5）。

```javascript
module.exports = function (source) {
  const options = this.getOptions();
  console.log("配置的参数：", options.prefix);
  return source;
};
```

## 7. 自定义 Plugin

Plugin 的本质是**挂载到 Webpack 生命钩子上的监听器**。

### 1. Plugin的基本结构

一个 Webpack Plugin 由以下部分组成：

1. 一个 JavaScript 命名函数或 Class（类）。
2. 在原型上定义一个 apply 方法。
3. 指定一个 绑定到 Webpack 自身的事件钩子。
4. 处理 Webpack 内部实例状态的数据。
5. 功能完成后调用 Webpack 提供的 callback（如果是异步钩子）。

### 2. 手写一个**版权声明**插件

这个插件的功能是：在所有生成的 .js 文件头部自动注入一行版权信息注释。

```javascript
class BannerPlugin {
  constructor(options = {}) {
    // 1. 接收自定义参数
    this.banner = options.banner || "Copyright 2026 Gemini Inc.";
  }

  // 2. Webpack 会调用 apply 方法并传入 compiler 对象
  apply(compiler) {
    // 3. 找到合适的钩子：processAssets (处理资源)
    // 这是 Webpack 5 推荐的在输出前修改文件的钩子
    compiler.hooks.thisCompilation.tap("BannerPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "BannerPlugin",
          // 阶段：在基本优化之后
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        (assets) => {
          // 4. 遍历所有打包出的文件
          Object.keys(assets).forEach((fileName) => {
            if (fileName.endsWith(".js")) {
              // 5. 读取旧内容并拼接新内容
              const oldSource = assets[fileName].source();
              const newSource = `/*! ${this.banner} */\n` + oldSource;

              // 6. 更新资源内容
              compilation.updateAsset(
                fileName,
                new compiler.webpack.sources.RawSource(newSource),
              );
            }
          });
        },
      );
    });
  }
}

module.exports = BannerPlugin;
```

### 3. 如何使用这个插件

```javascript
// webpack.config.js
const BannerPlugin = require("./plugins/BannerPlugin");

module.exports = {
  plugins: [
    new BannerPlugin({
      banner: "Built by Gemini - 2026",
    }),
  ],
};
```

### 4. 核心对象解读：Compiler vs Compilation

理解 Plugin 的关键在于区分这两个对象：

- **Compiler (大管家)：** Webpack 启动时创建的单例对象。它包含了 Webpack 环境的所有配置信息（options, loaders, plugins）。只要 Webpack 不停，它就一直存在。

- **Compilation (单次任务)：** 代表一次资源构建的过程。在开发模式下，每次修改代码触发热更新，都会产生一个新的 Compilation。它能访问到当前的模块资源、编译后的产物、变化的文件等。

### 5. 常用钩子类型

| 钩子名      | 类型              | 触发时机                               |
| :---------- | :---------------- | :------------------------------------- |
| environment | SyncHook          | 准备环境时（最早）                     |
| compile     | SyncHook          | 开始编译前                             |
| make        | AsyncParallelHook | 真正的递归解析和编译阶段               |
| emit        | AsyncSeriesHook   | 即将把文件写入磁盘前（Webpack 4 常用） |
| done        | SyncHook          | 编译彻底完成                           |
