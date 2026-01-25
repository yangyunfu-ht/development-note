# 箭头函数 vs 普通函数

ES6 引入了箭头函数（Arrow Functions），它提供了一种更简洁的函数写法。除了语法上的不同，它在行为上也与普通函数（Function Declaration / Expression）有显著区别。

## 1. 语法更加简洁

箭头函数省略了 `function` 关键字，如果是单行返回，还可以省略 `{}` 和 `return`。

```javascript
// 普通函数
const add = function (a, b) {
  return a + b;
};

// 箭头函数
const add = (a, b) => a + b;
```

## 2. 没有自己的 `this` (核心区别)

- **普通函数**: `this` 指向**调用该函数的对象**。在全局环境下调用指向 `window` (严格模式下为 `undefined`)。
- **箭头函数**: 没有自己的 `this`，它会**捕获定义时上下文中的 `this`** 作为自己的 `this`。一旦捕获，`this` 指向就固定了，不会被 `call`, `apply`, `bind` 改变。

```javascript
const obj = {
  name: "Alice",
  // 普通函数
  sayHello: function () {
    setTimeout(function () {
      console.log("Normal:", this.name); // this 指向 Window (或 undefined)
    }, 100);
  },
  // 箭头函数
  sayHi: function () {
    setTimeout(() => {
      console.log("Arrow:", this.name); // this 继承自 sayHi 的作用域 (即 obj)
    }, 100);
  },
};

obj.sayHello(); // Normal: undefined
obj.sayHi(); // Arrow: Alice
```

## 3. 没有 `arguments` 对象

- **普通函数**: 内部可以使用 `arguments` 对象访问所有传入的参数。
- **箭头函数**: 没有 `arguments` 对象。如果需要访问所有参数，可以使用 ES6 的**剩余参数 (Rest Parameters)** `...args`。

```javascript
// 普通函数
function normal() {
  console.log(arguments);
}
normal(1, 2); // Arguments [1, 2, ...]

// 箭头函数
const arrow = (...args) => {
  console.log(args);
};
arrow(1, 2); // [1, 2]
```

## 4. 不能作为构造函数 (不能使用 `new`)

- **普通函数**: 可以作为构造函数，通过 `new` 关键字创建实例。
- **箭头函数**: 没有 `[[Construct]]` 方法，使用 `new` 调用会抛出错误。也没有 `prototype` 属性。

```javascript
const Person = (name) => {
  this.name = name;
};

// TypeError: Person is not a constructor
const p = new Person("Bob");
```

## 5. 不能使用 `yield` 关键字

- **箭头函数**: 不能用作 Generator 函数，不能使用 `yield` 关键字。

## 总结

| 特性          | 普通函数                       | 箭头函数                           |
| :------------ | :----------------------------- | :--------------------------------- |
| **this**      | 动态绑定，指向调用者           | 静态绑定，指向定义时的上下文       |
| **arguments** | 有                             | 无 (使用 `...args`)                |
| **构造函数**  | 可以 (new)                     | 不可以                             |
| **prototype** | 有                             | 无                                 |
| **适用场景**  | 对象方法、构造函数、动态上下文 | 回调函数、保持 this 指向、简短函数 |
