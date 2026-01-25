# JavaScript 闭包 (Closure)

## 1. 什么是闭包？

闭包（Closure）是指**一个函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是闭包**。

简单来说，**闭包让你可以在一个内层函数中访问到其外层函数的作用域**。

## 2. 闭包的基本原理

在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。

### 示例代码

```javascript
function makeFunc() {
  var name = "Mozilla";
  function displayName() {
    console.log(name);
  }
  return displayName;
}

var myFunc = makeFunc();
myFunc(); // 输出 "Mozilla"
```

**解析：**
虽然 `makeFunc` 已经执行完毕，但 `myFunc` 依然能够访问 `name` 变量。这是因为 `myFunc` 变成了闭包，它包含了 `displayName` 函数本身以及创建该函数时的词法环境（其中包含 `name` 变量）。

## 3. 闭包的实际应用

### 3.1 数据封装与私有变量

JavaScript（在 ES6 类私有属性普及前）通常使用闭包来模拟私有方法。

```javascript
function createCounter() {
  let count = 0; // 私有变量，外部无法直接访问

  return {
    increment: function () {
      count++;
      return count;
    },
    decrement: function () {
      count--;
      return count;
    },
    getValue: function () {
      return count;
    },
  };
}

const counter = createCounter();
console.log(counter.getValue()); // 0
console.log(counter.increment()); // 1
console.log(counter.count); // undefined (无法直接访问)
```

### 3.2 柯里化 (Currying) 与 函数工厂

```javascript
function makeAdder(x) {
  return function (y) {
    return x + y;
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(2)); // 7
console.log(add10(2)); // 12
```

### 3.3 在循环中的应用（经典面试题）

**问题代码：**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
// 输出：6, 6, 6, 6, 6
```

原因：`var` 声明的变量是函数作用域（这里是全局），`setTimeout` 回调执行时循环已结束，`i` 变成了 6。

**解决方法 1：使用闭包 (IIFE)**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function timer() {
      console.log(j);
    }, j * 1000);
  })(i);
}
```

**解决方法 2：使用 `let` (块级作用域)**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
```

## 4. 闭包的缺点与内存泄露

### 4.1 内存消耗

闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题。

**解决方法**：在退出函数之前，将不使用的局部变量删除（设为 `null`）。

### 4.2 内存泄露示例

在 IE9 之前的版本中，如果闭包的作用域链中保存着一个 HTML 元素，那么就意味着该元素将无法被销毁。

```javascript
function assignHandler() {
  var element = document.getElementById("someElement");
  element.onclick = function () {
    console.log(element.id);
  };
}
```

`element` 引用了 `onclick` 函数，而 `onclick` 函数（闭包）又引用了 `element`，形成循环引用。

**修复：**

```javascript
function assignHandler() {
  var element = document.getElementById("someElement");
  var id = element.id;

  element.onclick = function () {
    console.log(id);
  };

  element = null; // 解除引用
}
```

## 5. 总结

- **优点**：
  - 保护函数内的变量安全（实现封装）。
  - 在内存中维持一个变量。
- **缺点**：
  - 常驻内存，增加内存使用量。
  - 使用不当可能导致内存泄露。
