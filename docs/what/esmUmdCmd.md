# JS 模块化规范：ESM、UMD、CMD 详解

在 JavaScript 发展初期，并没有原生的模块系统。随着前端工程化的发展，出现了多种模块化规范。本文将详细解析 **ESM**、**UMD**、**CMD** 这三种常见的模块规范及其区别。

## 1. CMD (Common Module Definition)

- **背景**: 由国内玉伯（Sea.js 作者）提出的规范，主要用于浏览器端，代表库是 **Sea.js**。
- **核心思想**: **依赖就近**，**延迟执行**。即需要用到某个模块时，才去 `require` 加载和执行。
- **语法**:

  ```javascript
  // 定义模块
  define(function (require, exports, module) {
    // 依赖就近：需要时才声明依赖
    var a = require("./a");
    a.doSomething();

    if (false) {
      var b = require("./b"); // b 模块永远不会被加载/执行
    }

    // 导出接口
    exports.action = function () {};
  });
  ```

- **现状**: 随着 ES6 模块 (ESM) 的普及和构建工具的发展，CMD 已基本退出历史舞台，现在主要存在于维护老旧项目的场景中。

## 2. UMD (Universal Module Definition)

- **定义**: **通用模块定义**。它不是一种全新的规范，而是一套**代码模板**或**语法糖**。
- **目标**: 解决模块兼容性问题。让同一个库既能在 **Node.js (CommonJS)** 环境运行，也能在 **AMD/CMD** 环境运行，还能通过 `<script>` 标签直接在全局变量 (`window`) 中使用。
- **原理**: 在工厂函数外部包裹一层判断逻辑，检测当前环境支持哪种模块系统（AMD? CommonJS? Global?），然后适配对应的导出方式。
- **代码模板**:
  ```javascript
  (function (root, factory) {
    if (typeof define === "function" && define.amd) {
      // AMD 环境 (如 RequireJS)
      define(["b"], factory);
    } else if (typeof module === "object" && module.exports) {
      // CommonJS 环境 (如 Node.js)
      module.exports = factory(require("b"));
    } else {
      // 浏览器全局变量 (root 是 window)
      root.returnExports = factory(root.b);
    }
  })(typeof self !== "undefined" ? self : this, function (b) {
    // 模块的具体实现逻辑
    return {
      action: function () {
        /*...*/
      },
    };
  });
  ```
- **场景**: 开发第三方库（如 Lodash, jQuery, Axios）时，为了让所有开发者都能方便使用，通常会构建一个 UMD 版本。

## 3. ESM (ECMAScript Modules)

- **定义**: ECMAScript 2015 (ES6) 引入的**官方标准**模块系统。
- **特点**:
  - **静态编译**: 在代码编译阶段（而非运行时）就能确定模块的依赖关系，这使得 **Tree Shaking**（摇树优化，去除未引用代码）成为可能。
  - **值的引用 (Live Binding)**: 导入的值是只读引用，如果模块内部改变了导出值，外部也会实时感知到变化（CommonJS 是值的拷贝）。
  - **浏览器原生支持**: 现代浏览器可以通过 `<script type="module">` 直接支持 ESM。
- **语法**:

  ```javascript
  // 导出 (module.js)
  export const name = "ESM";
  export default function () {
    console.log("Default Export");
  }

  // 导入 (main.js)
  import { name } from "./module.js";
  import defaultFunc from "./module.js";
  ```

- **现状**: 现代前端开发的主流（Vite, Webpack, Rollup 默认首选），Node.js 较新版本也已原生支持。

## 4. 区别对比

| 特性             | CMD (Sea.js)       | UMD                   | ESM (ES6)                    | CommonJS (Node) |
| :--------------- | :----------------- | :-------------------- | :--------------------------- | :-------------- |
| **执行时机**     | 运行时             | 运行时                | **编译时** (静态分析)        | 运行时          |
| **加载方式**     | 异步加载，延迟执行 | 兼容各种方式          | 现代浏览器异步加载           | 同步加载        |
| **输出结果**     | 值的拷贝           | 取决于环境            | **值的引用** (Live Binding)  | 值的拷贝        |
| **Tree Shaking** | 不支持             | 不支持                | **支持**                     | 不支持          |
| **主要应用**     | 老旧浏览器项目     | **通用库/组件开发**   | **现代前端项目**             | Node.js 服务端  |
| **依赖处理**     | 依赖就近 (按需)    | 兼容依赖前置/CommonJS | 静态声明 (import 必须在顶层) | 动态加载        |

## 5. 总结

1.  **ESM** 是终极解决方案，也是未来的标准。**做业务开发、新项目首选 ESM**。
2.  **UMD** 是为了兼容性而生的“万能胶水”。**写开源库发布到 npm 时**，通常会打包一个 UMD 版本给老项目或 CDN 使用，同时提供 ESM 版本给构建工具使用。
3.  **CMD** 是历史产物。了解即可，除非维护十年前的老项目，否则**不需要使用**。
