# JavaScript 数据类型

JavaScript 是一种**弱类型**（或称动态类型）语言，这意味着变量没有类型限制，可以随时赋予不同类型的值。

JavaScript 的数据类型分为两大类：**基本数据类型 (Primitive)** 和 **引用数据类型 (Reference)**。

## 1. 基本数据类型

基本数据类型存储在**栈内存 (Stack)** 中，占据固定大小的空间。目前共有 7 种：

| 类型          | 描述                     | 示例                 |
| :------------ | :----------------------- | :------------------- |
| **String**    | 字符串                   | `'Hello'`, `"World"` |
| **Number**    | 数字（包含整数和浮点数） | `123`, `3.14`, `NaN` |
| **Boolean**   | 布尔值                   | `true`, `false`      |
| **Null**      | 空值（表示“无”的对象）   | `null`               |
| **Undefined** | 未定义（声明但未赋值）   | `undefined`          |
| **Symbol**    | (ES6) 唯一标识符         | `Symbol('id')`       |
| **BigInt**    | (ES10) 任意精度的整数    | `123n`               |

## 2. 引用数据类型

引用数据类型存储在**堆内存 (Heap)** 中，栈内存中只存储了一个指向堆内存的**指针**（地址）。

- **Object**：最基础的引用类型（普通对象、数组、函数、日期等都属于 Object）。
  - `Array`
  - `Function`
  - `Date`
  - `RegExp`

## 3. 存储区别：栈 vs 堆

JavaScript 引擎（如 V8）在执行代码时，会将内存分为**栈内存 (Stack)** 和 **堆内存 (Heap)** 两部分。

### (1) 栈内存 (Stack)

- **存储内容**：基本数据类型的值、引用数据类型的**引用地址**（指针）。
- **特点**：
  - 线性结构，后进先出 (LIFO)。
  - 空间较小，但存取速度极快。
  - 由系统自动分配和释放（函数执行结束时自动清理）。

### (2) 堆内存 (Heap)

- **存储内容**：引用数据类型的**实际对象**（如 `{ name: 'Alice' }`）。
- **特点**：
  - 树状/网状结构，杂乱无序。
  - 空间较大，可以动态调整。
  - 存取速度较慢（需要先从栈中获取地址，再到堆中查找）。
  - 由 JavaScript 引擎的**垃圾回收机制 (GC)** 进行管理和回收。

### (3) 内存模型示意图

假设执行以下代码：

```javascript
let a = 10;
let b = "Hello";
let obj = { name: "Alice", age: 18 };
```

内存中的表现如下：

| 变量名 | 栈内存 (Stack)        | 堆内存 (Heap)                                         |
| :----- | :-------------------- | :---------------------------------------------------- |
| `a`    | `10`                  |                                                       |
| `b`    | `"Hello"`             |                                                       |
| `obj`  | `0x0012ff` (内存地址) | `Address: 0x0012ff` <br> `{ name: "Alice", age: 18 }` |

### (4) 赋值行为的区别

- **基本类型赋值（传值）**：
  在栈内存中开辟新的空间，将**值**复制一份。修改新变量不会影响旧变量。

  ```javascript
  let a = 10;
  let b = a; // 复制值
  b = 20;
  console.log(a); // 10 (a 不受 b 影响)
  ```

- **引用类型赋值（传址）**：
  在栈内存中复制一份**引用地址**，两个变量指向堆内存中的同一个对象。修改其中一个，另一个也会受影响。

  ```javascript
  let obj1 = { name: "Alice" };
  let obj2 = obj1; // 复制地址
  obj2.name = "Bob";
  console.log(obj1.name); // "Bob" (obj1 也指向同一对象)
  ```

### (5) 特殊情况：闭包中的变量

虽然基本类型通常存储在栈中，但如果一个基本类型的变量被**闭包 (Closure)** 引用，它可能会被存储在**堆**中，以保证在外部函数执行完毕后，该变量依然可以被访问。

### (6) 垃圾回收与内存泄漏 (GC & Memory Leak)

- **栈内存**：由系统自动分配和释放。函数执行结束，栈内存自动回收，一般不会有内存泄漏问题。
- **堆内存**：由 JavaScript 引擎的垃圾回收器（GC）管理。
  - **GC 机制**：常见的算法有**标记-清除 (Mark-Sweep)**。当对象不再被引用（可达性分析）时，会被 GC 回收。
  - **内存泄漏**：如果代码逻辑导致不再需要的对象依然被引用（例如：未清理的定时器、闭包的不当使用、全局变量堆积），GC 无法回收，会导致**内存泄漏 (Memory Leak)**，最终可能导致页面卡顿或崩溃。

### (7) 栈溢出 (Stack Overflow)

- **栈空间有限**：栈内存空间通常比较小（例如 Chrome V8 默认约 1MB 左右，取决于平台）。
- **递归调用**：如果函数递归调用层级过深，或者死循环调用，会不断向栈中压入新的执行上下文，直到超出栈的大小限制，抛出 `Maximum call stack size exceeded` 错误。

## 4. 类型检测

### (1) typeof

适用于检测基本类型（除了 `null`）。

```javascript
typeof "abc"; // "string"
typeof 123; // "number"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof Symbol(); // "symbol"
typeof 10n; // "bigint"

typeof function () {}; // "function" (特殊)

// 缺陷：
typeof null; // "object" (历史遗留 bug)
typeof []; // "object"
typeof {}; // "object"
```

### (2) instanceof

用于检测引用类型，判断构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```javascript
[] instanceof Array        // true
{} instanceof Object       // true
new Date() instanceof Date // true

// 缺陷：不能检测基本类型
123 instanceof Number      // false
```

### (3) Object.prototype.toString.call() (推荐)

最准确的检测方式，可以区分所有类型。

```javascript
const getType = (val) => Object.prototype.toString.call(val).slice(8, -1);

getType(123); // "Number"
getType("abc"); // "String"
getType(null); // "Null"
getType(undefined); // "Undefined"
getType([]); // "Array"
getType({}); // "Object"
getType(new Date()); // "Date"
```
