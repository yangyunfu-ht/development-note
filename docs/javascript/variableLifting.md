# 变量提升 (Hoisting)

变量提升（Hoisting）是 JavaScript 引擎中的一种机制，它会将变量声明和函数声明移动到当前作用域的顶部。

这意味着你可以在声明变量或函数之前使用它们。

## 1. var 的提升

使用 `var` 声明的变量会被提升，但**初始化不会被提升**。在声明语句之前访问该变量，其值为 `undefined`。

```javascript
console.log(foo); // undefined
var foo = "Hello";
console.log(foo); // "Hello"

// 实际执行过程相当于：
// var foo;
// console.log(foo);
// foo = 'Hello';
// console.log(foo);
```

## 2. 函数声明的提升

**函数声明**会被完整地提升到作用域顶部。你可以在声明函数之前调用它。

```javascript
sayHi(); // "Hi!"

function sayHi() {
  console.log("Hi!");
}
```

## 3. 函数表达式与提升

**函数表达式**（Function Expression）通常是赋值给一个变量。它们的行为遵循变量提升的规则。

如果使用 `var` 声明函数表达式，变量名被提升，但函数体不提升。

```javascript
sayHello(); // TypeError: sayHello is not a function

var sayHello = function () {
  console.log("Hello!");
};
```

如果使用 `let` 或 `const` 声明函数表达式，同样受暂时性死区（TDZ）限制，无法在声明前调用。

## 4. let 和 const 的提升

`let` 和 `const` 声明的变量**也会被提升**，但它们不会被初始化。

在声明语句之前的区域被称为**暂时性死区（Temporal Dead Zone, TDZ）**。在 TDZ 中访问这些变量会抛出 `ReferenceError`。

```javascript
console.log(bar); // ReferenceError: Cannot access 'bar' before initialization
let bar = "World";
```

## 5. 优先级规则

当函数声明和变量声明同名时，**函数声明的优先级高于变量声明**。函数声明会覆盖同名的变量声明（但不会覆盖变量赋值）。

```javascript
console.log(a); // [Function: a]

var a = 1;
function a() {}

console.log(a); // 1
```

**解析过程**：

1. 引擎首先处理函数声明 `function a() {}`，将其提升。
2. 然后处理变量声明 `var a`，发现 `a` 已经存在（是函数），忽略变量声明，执行变量赋值。
3. 代码执行阶段：
   - `console.log(a)`：输出函数 `a`。
   - `a = 1`：赋值操作，将 `a` 修改为 `1`。
   - `console.log(a)`：输出 `1`。
