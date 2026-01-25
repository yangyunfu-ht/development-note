# JavaScript 中的 this 指向详解

`this` 关键字是 JavaScript 中最复杂的机制之一。它被自动定义在所有函数的作用域中，但它的含义经常让初学者感到困惑。

**一句话总结：`this` 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。**

## 1. 绑定规则

我们需要根据调用位置，按优先级顺序应用以下 4 条规则来确定 `this` 的指向。

### 1.1 默认绑定 (Default Binding)

当函数独立调用（不带任何修饰符）时，`this` 指向全局对象。

- **非严格模式**：指向全局对象 (`window` / `global`)
- **严格模式 (`'use strict'`)**：指向 `undefined`

```javascript
function foo() {
  console.log(this.a);
}

var a = 2;
foo(); // 输出 2 (在浏览器非严格模式下)
```

### 1.2 隐式绑定 (Implicit Binding)

当函数作为某个对象的方法被调用时，`this` 指向那个上下文对象。

```javascript
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo,
};

obj.foo(); // 输出 2
```

**隐式丢失**：
最常见的陷阱是隐式绑定的函数丢失绑定对象，从而回退到默认绑定。

```javascript
var obj = {
  a: 2,
  foo: function () {
    console.log(this.a);
  },
};

var bar = obj.foo; // bar 只是引用了 foo 函数本身
var a = "global";

bar(); // 输出 "global" (浏览器环境)
```

### 1.3 显式绑定 (Explicit Binding)

使用 `call`、`apply` 或 `bind` 方法，强制将 `this` 绑定到指定的对象。

```javascript
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
};

foo.call(obj); // 输出 2
```

- **Hard Binding (硬绑定)**：`bind` 会返回一个新函数，该函数的 `this` 被永久锁定，无法再被修改。

### 1.4 new 绑定 (New Binding)

使用 `new` 关键字调用构造函数时，会发生以下步骤：

1.  创建一个全新的对象。
2.  这个新对象执行 `[[Prototype]]` 连接。
3.  函数调用中的 `this` 会绑定到这个新对象。
4.  如果函数没有返回其他对象，那么 `new` 表达式中的函数调用会自动返回这个新对象。

```javascript
function Foo(a) {
  this.a = a;
}

var bar = new Foo(2);
console.log(bar.a); // 2
```

## 2. 箭头函数 (Arrow Functions)

箭头函数不使用上述的 4 条规则，而是根据外层（函数或者全局）作用域来决定 `this`。
**箭头函数的 `this` 是词法作用域，由定义时的外层作用域决定，且一旦绑定无法修改（`call`/`apply`/`bind` 对箭头函数无效）。**

```javascript
function foo() {
  // 返回一个箭头函数
  return (a) => {
    // this 继承自 foo()
    console.log(this.a);
  };
}

var obj1 = { a: 2 };
var obj2 = { a: 3 };

var bar = foo.call(obj1);
bar.call(obj2); // 输出 2，而不是 3！
```

在箭头函数出现之前，我们通常使用 `var self = this;` 这种 hack 方式来实现相同的效果。

## 3. 优先级

如果一个位置同时应用了多条规则，优先级如下：

1.  **`new` 绑定**
2.  **显式绑定** (`call`, `apply`, `bind`)
3.  **隐式绑定** (`obj.foo()`)
4.  **默认绑定** (独立调用)

## 4. 常见面试题示例

```javascript
var name = "window";
var obj = {
  name: "obj",
  getName: function () {
    return this.name;
  },
};

console.log(obj.getName()); // 'obj' (隐式绑定)
console.log(obj.getName()); // 'obj' (隐式绑定)
console.log((obj.getName = obj.getName)()); // 'window' (赋值表达式返回函数本身，变成独立调用 -> 默认绑定)
```

## 总结流程图

判断 `this` 的流程：

1.  函数是否在 `new` 中调用？如果是，`this` 绑定的是**新创建的对象**。
2.  函数是否通过 `call`、`apply` 或 `bind` 调用？如果是，`this` 绑定的是**指定的对象**。
3.  函数是否在某个上下文对象中调用（`obj.func`）？如果是，`this` 绑定的是**那个上下文对象**。
4.  如果是箭头函数，`this` 继承自**外层作用域**。
5.  否则，使用**默认绑定**（严格模式下是 `undefined`，非严格模式下是全局对象）。
