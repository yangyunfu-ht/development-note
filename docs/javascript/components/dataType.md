## JavaScript 数据类型

JavaScript 是一种**弱类型**（或称动态类型）语言，这意味着变量没有类型限制，可以随时赋予不同类型的值。

JavaScript 的数据类型分为两大类：**基本数据类型 (Primitive)** 和 **引用数据类型 (Reference)**。

### 1. 基本数据类型

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

### 2. 引用数据类型

引用数据类型存储在**堆内存 (Heap)** 中，栈内存中只存储了一个指向堆内存的**指针**（地址）。

- **Object**：最基础的引用类型（普通对象、数组、函数、日期等都属于 Object）。
  - `Array`
  - `Function`
  - `Date`
  - `RegExp`

### 3. 存储区别：栈 vs 堆

- **基本类型**：直接存储值。赋值时是**值拷贝**，互不影响。
- **引用类型**：存储的是引用地址。赋值时是**地址拷贝**，修改新变量会影响原变量。

```javascript
// 基本类型：值拷贝
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 (不受影响)

// 引用类型：地址拷贝
let obj1 = { name: "Alice" };
let obj2 = obj1;
obj2.name = "Bob";
console.log(obj1.name); // "Bob" (受影响)
```

### 4. 类型检测

#### (1) typeof

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

#### (2) instanceof

用于检测引用类型，判断构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```javascript
[] instanceof Array        // true
{} instanceof Object       // true
new Date() instanceof Date // true

// 缺陷：不能检测基本类型
123 instanceof Number      // false
```

#### (3) Object.prototype.toString.call() (推荐)

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

#### (4) 手写实现instanceOf

```javascript
function myInstanceOf(left, right) {
  if (typeof left !== "object" || left === null) {
    return false;
  }
  let proto = left.__proto__;
  while (proto !== null) {
    if (proto === right.prototype) {
      return true;
    }
    proto = proto.__proto__;
  }
  return false;
}
```
