# 深拷贝与浅拷贝 (Deep & Shallow Clone)

在 JavaScript 中，对于**引用数据类型**（对象、数组），赋值操作（`=`）传递的是**内存地址**（引用）。为了创建独立的副本，我们需要进行拷贝。根据拷贝的层级不同，分为**浅拷贝**和**深拷贝**。

## 1. 概念区别

| 类型                      | 描述                                                                                           | 影响                                             |
| :------------------------ | :--------------------------------------------------------------------------------------------- | :----------------------------------------------- |
| **浅拷贝 (Shallow Copy)** | 只复制对象的第一层属性。如果属性是基本类型，拷贝的是值；如果属性是引用类型，拷贝的是内存地址。 | 修改新对象的**引用类型属性**，**会影响**原对象。 |
| **深拷贝 (Deep Copy)**    | 递归复制对象的所有层级。为所有属性分配新的内存空间。                                           | 新对象和原对象完全独立，修改**互不影响**。       |

## 2. 浅拷贝实现

### (1) Object.assign()

```javascript
const obj = { a: 1, info: { age: 18 } };
const newObj = Object.assign({}, obj);

newObj.a = 2;
newObj.info.age = 20;

console.log(obj.a); // 1 (第一层不受影响)
console.log(obj.info.age); // 20 (第二层受影响)
```

### (2) 扩展运算符 (...)

```javascript
const arr = [1, { name: "Alice" }];
const newArr = [...arr];

newArr[1].name = "Bob";
console.log(arr[1].name); // "Bob"
```

### (3) 数组方法 (slice, concat)

```javascript
const arr = [1, 2, 3];
const newArr = arr.slice(); // 或 arr.concat()
```

## 3. 深拷贝实现

### (1) JSON.parse(JSON.stringify())

这是最简单、最常用的深拷贝方法，适用于普通的数据对象。

```javascript
const obj = { a: 1, info: { age: 18 } };
const newObj = JSON.parse(JSON.stringify(obj));

newObj.info.age = 20;
console.log(obj.info.age); // 18 (完全独立，不受影响)
```

**缺陷**：

1.  无法处理 `undefined`、`Function`、`Symbol`（会被忽略）。
2.  无法处理 `Date`（会变成字符串）、`RegExp`（会变成空对象）。
3.  无法处理**循环引用**（会报错 `TypeError: Converting circular structure to JSON`）。

### (2) structuredClone() (ES2022)

现代浏览器和 Node.js 原生支持的深拷贝 API。它支持循环引用，支持 `Date`、`RegExp`、`Map`、`Set` 等多种类型。

```javascript
const original = { date: new Date(), set: new Set([1]) };
const clone = structuredClone(original);

console.log(clone.date instanceof Date); // true
console.log(clone.set.has(1)); // true
```

**限制**：

- 依然无法克隆函数 (Function)。
- 不保留原型链。

### (3) 手写递归实现 (面试常考)

一个基础的深拷贝函数实现，解决循环引用问题。

```javascript
function deepClone(target, map = new WeakMap()) {
  // 1. 基本类型和 null 直接返回
  if (typeof target !== "object" || target === null) {
    return target;
  }

  // 2. 处理循环引用
  if (map.has(target)) {
    return map.get(target);
  }

  // 3. 处理 Date 和 RegExp
  if (target instanceof Date) return new Date(target);
  if (target instanceof RegExp) return new RegExp(target);

  // 4. 初始化新对象（保留原型链）或数组
  const cloneTarget = Array.isArray(target) ? [] : {};

  // 记录引用关系
  map.set(target, cloneTarget);

  // 5. 递归拷贝属性
  for (const key in target) {
    // 保证只拷贝实例属性，不拷贝原型链属性
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      cloneTarget[key] = deepClone(target[key], map);
    }
  }

  return cloneTarget;
}

// 测试
const obj = {
  num: 1,
  nested: { count: 2 },
  date: new Date(),
  reg: /abc/,
};
obj.self = obj; // 循环引用

const cloned = deepClone(obj);
console.log(cloned.nested === obj.nested); // false (独立)
console.log(cloned.self === cloned); // true (循环引用正常)
```
