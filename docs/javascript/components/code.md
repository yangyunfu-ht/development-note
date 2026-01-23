# JavaScript 高频手写面试题

本页汇总了 JavaScript 面试中常见的手写代码题，涵盖了 `this` 绑定、原型、异步编程、函数式编程等核心概念。

## 1. 实现 call, apply, bind

这三个方法用于改变函数的 `this` 指向。

### 实现 `call`

- **原理**: 将函数作为对象的属性调用，`this` 自然指向该对象。
- **步骤**:
  1.  判断调用对象是否为函数。
  2.  处理 `context`，若为空则指向 `window` (非严格模式)。
  3.  将函数设为 `context` 的属性（使用 `Symbol` 避免属性冲突）。
  4.  执行函数并传入参数。
  5.  删除属性，返回结果。

```javascript
Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }

  // context 为 null 或 undefined 时指向 window，否则指向 Object(context)
  context = context ? Object(context) : window;

  // 使用 Symbol 防止属性冲突
  const fn = Symbol("fn");
  context[fn] = this;

  const result = context[fn](...args);

  delete context[fn];
  return result;
};
```

### 实现 `apply`

- **区别**: `apply` 接收数组作为参数。

```javascript
Function.prototype.myApply = function (context, args) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }

  context = context ? Object(context) : window;
  const fn = Symbol("fn");
  context[fn] = this;

  // 处理 args 是否存在
  const result = args ? context[fn](...args) : context[fn]();

  delete context[fn];
  return result;
};
```

### 实现 `bind`

- **特点**: 返回一个新函数，支持柯里化（预置参数），且返回的函数可以作为构造函数（此时 `this` 失效，指向实例）。

```javascript
Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }

  const self = this;

  return function F(...newArgs) {
    // 如果被 new 调用，this 指向实例（F 的实例），此时忽略 context
    // 否则指向 context
    if (this instanceof F) {
      return new self(...args, ...newArgs);
    }
    return self.apply(context, [...args, ...newArgs]);
  };
};
```

## 2. 实现 new 操作符

`new` 运算符用于创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

- **步骤**:
  1.  创建一个新对象。
  2.  将新对象的原型 (`__proto__`) 指向构造函数的 `prototype`。
  3.  将构造函数的 `this` 绑定到新对象并执行。
  4.  如果构造函数返回引用类型对象，则返回该对象；否则返回新对象。

```javascript
function myNew(constructor, ...args) {
  // 1. 创建新对象
  const obj = {};

  // 2. 链接原型
  Object.setPrototypeOf(obj, constructor.prototype);
  // 或者 obj.__proto__ = constructor.prototype;

  // 3. 绑定 this 并执行
  const result = constructor.apply(obj, args);

  // 4. 返回结果
  // 如果构造函数显式返回了一个对象或函数，则返回该结果
  // 否则返回创建的新对象
  return result instanceof Object ? result : obj;
}

// 测试
function Person(name) {
  this.name = name;
}
const p = myNew(Person, "Tom");
console.log(p.name); // Tom
```

## 3. 实现 instanceof

`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```javascript
function myInstanceof(left, right) {
  // 基本类型直接返回 false
  if (typeof left !== "object" || left === null) return false;

  // 获取对象的原型
  let proto = Object.getPrototypeOf(left);

  while (true) {
    // 原型链尽头
    if (proto === null) return false;

    // 找到目标原型
    if (proto === right.prototype) return true;

    // 继续向上查找
    proto = Object.getPrototypeOf(proto);
  }
}
```

## 4. 函数柯里化 (Currying)

柯里化是将一个多参数的函数转换成多个单参数的函数的技术。

```javascript
function curry(fn, ...args) {
  // fn.length 获取函数形参个数
  return args.length >= fn.length
    ? fn(...args)
    : (...newArgs) => curry(fn, ...args, ...newArgs);
}

// 测试
function add(a, b, c) {
  return a + b + c;
}
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
```

## 5. 数组扁平化 (Array Flatten)

将多维数组转换为一维数组。

### 递归实现

```javascript
function flatten(arr) {
  return arr.reduce((prev, curr) => {
    return prev.concat(Array.isArray(curr) ? flatten(curr) : curr);
  }, []);
}
```

### 指定深度扁平化

```javascript
function flattenByDepth(arr, depth = 1) {
  if (depth === 0) return arr;
  return arr.reduce((prev, curr) => {
    return prev.concat(
      Array.isArray(curr) ? flattenByDepth(curr, depth - 1) : curr,
    );
  }, []);
}
```

### 利用 ES6 flat

```javascript
const arr = [1, [2, [3]]];
arr.flat(Infinity);
```

## 6. 数组去重

### Set (最推荐)

```javascript
const unique = (arr) => [...new Set(arr)];
```

### Filter + indexOf

```javascript
const unique = (arr) =>
  arr.filter((item, index) => arr.indexOf(item) === index);
```

### Map (性能更好)

```javascript
function unique(arr) {
  const map = new Map();
  return arr.filter((item) => !map.has(item) && map.set(item, 1));
}
```

## 7. 发布订阅模式 (EventEmitter)

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 订阅事件
  on(type, callback) {
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push(callback);
  }

  // 取消订阅
  off(type, callback) {
    if (!this.events[type]) return;
    this.events[type] = this.events[type].filter((cb) => cb !== callback);
  }

  // 只执行一次
  once(type, callback) {
    const one = (...args) => {
      callback(...args);
      this.off(type, one);
    };
    this.on(type, one);
  }

  // 触发事件
  emit(type, ...args) {
    if (!this.events[type]) return;
    this.events[type].forEach((cb) => cb(...args));
  }
}
```

## 8. 解析 URL 参数

将 URL 查询字符串解析为对象。

```javascript
function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)?.[1]; // 获取 ? 后面的字符串
  if (!paramsStr) return {};

  const paramsArr = paramsStr.split("&");
  const paramsObj = {};

  paramsArr.forEach((param) => {
    if (/=/.test(param)) {
      // 处理有值的参数
      let [key, val] = param.split("=");
      val = decodeURIComponent(val); // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转数字

      if (paramsObj.hasOwnProperty(key)) {
        // 如果已有该 key，转为数组
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else {
        paramsObj[key] = val;
      }
    } else {
      // 处理无值的参数
      paramsObj[param] = true;
    }
  });

  return paramsObj;
}
```

## 9. 图片懒加载

原理：监听滚动事件，判断图片是否进入可视区域。

```javascript
function lazyLoad() {
  const imgs = document.querySelectorAll("img[data-src]");
  const viewHeight = window.innerHeight;

  imgs.forEach((img) => {
    const rect = img.getBoundingClientRect();
    // 这里的 0 可以换成缓冲区高度，比如 100 提前加载
    if (rect.top < viewHeight) {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    }
  });
}

// 结合节流使用
window.addEventListener("scroll", throttle(lazyLoad, 200));
```

或者使用 `IntersectionObserver` API (现代浏览器推荐)：

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll("img[data-src]").forEach((img) => {
  observer.observe(img);
});
```

## 10. 组合函数 (Compose)

将多个函数组合成一个函数，从右向左执行。

```javascript
function compose(...fns) {
  if (fns.length === 0) return (arg) => arg;
  if (fns.length === 1) return fns[0];

  return fns.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args)),
  );
}

// 测试
const fn1 = (x) => x + 10;
const fn2 = (x) => x * 2;
const fn3 = (x) => x - 1;

// fn3 -> fn2 -> fn1 : (3 - 1) * 2 + 10 = 14
const res = compose(fn1, fn2, fn3)(3);
console.log(res); // 14
```
