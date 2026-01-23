## var、let 和 const 的区别

在 ES6（ECMAScript 2015）之前，JavaScript 只有 `var` 一种声明变量的方式。ES6 引入了 `let` 和 `const`，为 JavaScript 带来了块级作用域变量声明。

### 核心差异对比

| 特性              | var                      | let                      | const                        |
| :---------------- | :----------------------- | :----------------------- | :--------------------------- |
| **作用域**        | 函数作用域               | 块级作用域               | 块级作用域                   |
| **变量提升**      | 是（初始化为 undefined） | 否（存在暂时性死区 TDZ） | 否（存在暂时性死区 TDZ）     |
| **重复声明**      | 允许                     | 不允许                   | 不允许                       |
| **重新赋值**      | 允许                     | 允许                     | 不允许（引用类型可修改属性） |
| **必须初始化**    | 否                       | 否                       | 是                           |
| **挂载到 Window** | 是                       | 否                       | 否                           |

### 1. 作用域（Scope）

- **var**：是**函数作用域**。如果在函数外部声明，它是全局变量；如果在函数内部声明，它在整个函数内有效，忽略块级结构（如 `if`, `for`）。
- **let / const**：是**块级作用域**。只在声明它们的代码块 `{}` 内有效。

```javascript
// var 的作用域
if (true) {
  var a = 10;
}
console.log(a); // 10 (泄露到全局)

// let 的作用域
if (true) {
  let b = 20;
}
console.log(b); // ReferenceError: b is not defined
```

### 2. 变量提升（Hoisting）

- **var**：变量声明会被提升到作用域顶部，并初始化为 `undefined`。
- **let / const**：变量声明也会被提升，但在声明语句执行前，处于**暂时性死区（Temporal Dead Zone, TDZ）**，访问会报错。

```javascript
// var
console.log(x); // undefined
var x = 5;

// let
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;
```

### 3. 重复声明

- **var**：允许在同一作用域内重复声明同一个变量。
- **let / const**：不允许在同一作用域内重复声明。

```javascript
var a = 1;
var a = 2; // 没问题

let b = 1;
let b = 2; // SyntaxError: Identifier 'b' has already been declared
```

### 4. Const 的特殊性

`const` 声明的是常量，一旦声明必须立即初始化，且不能重新赋值。

**注意**：`const` 限制的是**变量绑定的引用地址**不可变，而不是值本身不可变。如果 `const` 声明的是对象或数组，其内部属性是可以修改的。

```javascript
const PI = 3.14;
PI = 3.14159; // TypeError: Assignment to constant variable.

const user = { name: "Alice" };
user.name = "Bob"; // 允许修改属性
console.log(user.name); // "Bob"

user = { name: "Charlie" }; // TypeError: Assignment to constant variable.
```

### 最佳实践

1.  **默认使用 `const`**：如果变量不需要重新赋值，一律使用 `const`。这能保证数据不被意外修改。
2.  **需要修改时用 `let`**：例如循环计数器或状态标记。
3.  **避免使用 `var`**：现代 JavaScript 开发中应尽量避免使用 `var`，以减少作用域污染和变量提升带来的困惑。
