# JavaScript 模块化发展历程

## 1. 为什么需要模块化？

在早期 JavaScript 开发中，代码通常写在一个文件中，或者通过多个 `<script>` 标签引入。随着项目规模扩大，这种方式带来了一系列问题：

- **命名冲突**：所有变量都存在于全局作用域，容易覆盖。
- **依赖管理混乱**：文件加载顺序必须手动维护，依赖关系不明确。
- **代码复用困难**：逻辑耦合严重，难以拆分和复用。

模块化旨在解决这些问题，将代码拆分为独立的模块，明确依赖关系，并隔离作用域。

## 2. 发展阶段

### 2.1 IIFE (立即执行函数)

最原始的模块化方式，利用函数作用域隔离变量。

```javascript
var moduleA = (function () {
  var privateVar = "I am private";

  function method1() {
    console.log(privateVar);
  }

  return {
    method1: method1,
  };
})();

moduleA.method1(); // "I am private"
// console.log(moduleA.privateVar); // undefined
```

### 2.2 CommonJS (Node.js 标准)

2009年，Node.js 采用 CommonJS 规范，标志着 JS 在服务端模块化的成熟。

- **特点**：
  - 同步加载（Synchronous）：适用于服务端，文件在本地磁盘，加载速度快。
  - **运行时加载**：模块在执行时才被分析。
  - **输出拷贝**：输出的是值的拷贝（基本类型）或引用（对象）。
  - 缓存：模块加载一次后会被缓存，后续 `require` 返回缓存结果。

- **语法**：

  ```javascript
  // a.js
  var x = 5;
  var add = function (val) {
    return x + val;
  };
  module.exports = { x, add };

  // b.js
  var moduleA = require("./a.js");
  console.log(moduleA.x); // 5
  ```

### 2.3 AMD (Asynchronous Module Definition)

为了解决浏览器端网络请求延迟问题，RequireJS 提出了 AMD 规范。

- **特点**：
  - **异步加载**：不阻塞浏览器渲染。
  - **依赖前置**：在定义模块时就声明依赖。

- **语法**：

  ```javascript
  // 定义模块
  define(["dependency"], function (dependency) {
    return {
      method: function () {
        dependency.doSomething();
      },
    };
  });

  // 加载模块
  require(["myModule"], function (myModule) {
    myModule.method();
  });
  ```

### 2.4 CMD (Common Module Definition)

SeaJS 提出的规范，国内曾一度流行。

- **特点**：
  - **依赖就近**：用到了再 `require`。
  - 结合了 CommonJS 的写法和 AMD 的异步加载。

- **语法**：

  ```javascript
  define(function (require, exports, module) {
    var a = require("./a");
    a.doSomething();

    var b = require("./b"); // 依赖就近
    b.doSomething();
  });
  ```

### 2.5 UMD (Universal Module Definition)

通用模块定义，旨在兼容 CommonJS、AMD 和全局变量（Browser）。

```javascript
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    // CommonJS
    module.exports = factory(require("jquery"));
  } else {
    // Browser globals
    root.returnExports = factory(root.jQuery);
  }
})(this, function ($) {
  // 模块代码
  return {};
});
```

### 2.6 ES Modules (ESM)

ECMAScript 2015 (ES6) 推出的官方标准，旨在统一服务端和浏览器的模块化方案。

- **特点**：
  - **编译时加载**（静态分析）：在代码运行前就能确定依赖关系，支持 Tree Shaking。
  - **输出引用**：`import` 的变量是只读引用，原模块值改变，引入的值也会变。
  - 异步加载。

- **语法**：

  ```javascript
  // export.js
  export var a = 1;
  export default function () {}

  // import.js
  import { a } from "./export.js";
  import myFunc from "./export.js";
  ```

## 3. CommonJS vs ES Modules

| 特性             | CommonJS                      | ES Modules               |
| :--------------- | :---------------------------- | :----------------------- |
| **加载方式**     | 运行时加载                    | 编译时加载 (静态分析)    |
| **输出方式**     | 值的拷贝 (基本类型)           | 值的动态引用             |
| **加载机制**     | 同步加载                      | 异步加载                 |
| **对象/接口**    | 导出整个对象 `module.exports` | 导出多个接口 `export`    |
| **this 指向**    | 模块顶层指向 `exports`        | 模块顶层指向 `undefined` |
| **Tree Shaking** | 不支持                        | 支持                     |

### 3.1 值的拷贝 vs 引用

**CommonJS (拷贝):**

```javascript
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = { counter, incCounter };

// main.js
var mod = require("./lib");
console.log(mod.counter); // 3
mod.incCounter();
console.log(mod.counter); // 3 (不受影响)
```

**ES Modules (引用):**

```javascript
// lib.mjs
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.mjs
import { counter, incCounter } from "./lib.mjs";
console.log(counter); // 3
incCounter();
console.log(counter); // 4 (实时变化)
```
