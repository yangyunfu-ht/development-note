# Rollup 打包工具

Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。

## 核心特性

- **Tree Shaking**: Rollup 本机支持 ES6 模块，并能静态分析代码中的 import，排除未使用的代码。
- **Scope Hoisting**: 将所有模块的代码放入同一个作用域中，减少函数声明和闭包开销。
- **插件机制**: 强大的插件系统，支持各种文件类型和转换。

## 基础配置

```js
// rollup.config.js
export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  }
};
```
