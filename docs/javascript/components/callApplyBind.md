# call、apply、bind 的区别

在 JavaScript 中，`call`、`apply` 和 `bind` 都是 `Function.prototype` 上的方法，它们的作用都是**改变函数执行时的 `this` 指向**。

## 1. 区别概览

| 特性         | call                       | apply                           | bind                         |
| :----------- | :------------------------- | :------------------------------ | :--------------------------- |
| **参数形式** | 参数列表 (arg1, arg2, ...) | 数组或类数组对象 ([arg1, arg2]) | 参数列表 (arg1, arg2, ...)   |
| **执行时机** | **立即执行**函数           | **立即执行**函数                | **返回一个新函数**，稍后执行 |
| **返回值**   | 函数调用的结果             | 函数调用的结果                  | 绑定了 `this` 的新函数       |

## 2. 详细对比

### call

- **语法**: `func.call(thisArg, arg1, arg2, ...)`
- **参数**: 第一个参数是 `this` 指向的对象，后续参数是传递给函数的参数列表。
- **执行**: 立即调用该函数。

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: "Alice" };

greet.call(person, "Hello", "!"); // 输出: Hello, Alice!
```

### apply

- **语法**: `func.apply(thisArg, [argsArray])`
- **参数**: 第一个参数是 `this` 指向的对象，第二个参数是一个数组（或类数组对象）。
- **执行**: 立即调用该函数。

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: "Bob" };

greet.apply(person, ["Hi", "."]); // 输出: Hi, Bob.
```

### bind

- **语法**: `func.bind(thisArg, arg1, arg2, ...)`
- **参数**: 与 `call` 类似，第一个参数是 `this` 指向，后续是预置参数（柯里化）。
- **执行**: **不会立即执行**，而是返回一个永久绑定了 `this` 的新函数。

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: "Charlie" };

const boundGreet = greet.bind(person, "Hey");
boundGreet("?"); // 输出: Hey, Charlie?
```

## 3. 使用场景

### 使用 `apply` 进行数组操作

利用 `apply` 将数组展开为参数列表的特性（ES6 之前常用）。

```javascript
const numbers = [5, 6, 2, 3, 7];

// 求最大值
const max = Math.max.apply(null, numbers);
// ES6 写法: Math.max(...numbers)

// 数组合并
const arr1 = [1, 2];
const arr2 = [3, 4];
Array.prototype.push.apply(arr1, arr2);
// ES6 写法: arr1.push(...arr2)
```

### 使用 `call` 进行类型判断

利用 `Object.prototype.toString` 来判断精确的数据类型。

```javascript
function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

getType([]); // "Array"
getType(null); // "Null"
getType({}); // "Object"
```

### 使用 `call` 将类数组转数组

```javascript
function list() {
  // arguments 是类数组
  const args = Array.prototype.slice.call(arguments);
  return args;
}
// ES6 写法: Array.from(arguments) 或 [...arguments]
```

### 使用 `bind` 处理回调函数中的 `this`

在 React 类组件或事件监听中常用。

```javascript
class Button {
  constructor() {
    this.message = "Clicked";
    // 绑定 this，否则 clickHandler 中的 this 为 undefined 或 DOM 元素
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    console.log(this.message);
  }
}
```

## 4. 总结

- 如果你想**立即调用**函数，并且参数是**列表**形式，用 `call`。
- 如果你想**立即调用**函数，并且参数是**数组**形式，用 `apply`。
- 如果你想**创建一个新函数**，锁定 `this` 稍后调用，用 `bind`。
