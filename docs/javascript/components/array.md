## JavaScript 数组方法

JavaScript 的 `Array.prototype` 提供了大量操作数组的方法。根据**是否修改原数组**这一核心特性，可以将它们分为两类：**Mutator Methods（修改器方法）** 和 **Accessor/Iteration Methods（访问/迭代方法）**。

### 1. 会修改原数组的方法 (Mutator Methods)

这些方法会直接改变调用它们的数组对象本身。

| 方法          | 描述                                                 | 返回值                   |
| :------------ | :--------------------------------------------------- | :----------------------- |
| **push()**    | 向数组末尾添加一个或多个元素                         | 新数组的**长度**         |
| **pop()**     | 删除数组末尾的最后一个元素                           | 被删除的**元素**         |
| **unshift()** | 向数组开头添加一个或多个元素                         | 新数组的**长度**         |
| **shift()**   | 删除数组开头的第一个元素                             | 被删除的**元素**         |
| **splice()**  | 添加或删除数组中的元素                               | 被删除元素组成的**数组** |
| **sort()**    | 对数组元素进行排序                                   | 排序后的**原数组**引用   |
| **reverse()** | 颠倒数组中元素的顺序                                 | 颠倒后的**原数组**引用   |
| **fill()**    | 用一个固定值填充数组中从起始索引到终止索引的全部元素 | 修改后的**原数组**       |

```javascript
// 修改原数组示例
const arr = [1, 2, 3];

arr.push(4); // arr: [1, 2, 3, 4]
arr.pop(); // arr: [1, 2, 3]
arr.splice(1, 1, "a"); // arr: [1, 'a', 3] (索引1开始删除1个，插入'a')
arr.reverse(); // arr: [3, 'a', 1]
```

### 2. 不会修改原数组的方法 (Accessor Methods)

这些方法不会改变原数组，而是返回一个新的数组或特定的值。

| 方法              | 描述                               | 返回值                   |
| :---------------- | :--------------------------------- | :----------------------- |
| **concat()**      | 合并两个或多个数组                 | **新数组**               |
| **slice()**       | 截取数组的一部分（浅拷贝）         | 截取出的**新数组**       |
| **join()**        | 将数组所有元素连接成一个字符串     | **字符串**               |
| **indexOf()**     | 查找元素在数组中第一次出现的索引   | **索引** (未找到返回 -1) |
| **lastIndexOf()** | 查找元素在数组中最后一次出现的索引 | **索引** (未找到返回 -1) |
| **includes()**    | 判断数组是否包含某个值 (ES7)       | **Boolean**              |
| **flat()**        | 扁平化嵌套数组 (ES10)              | 扁平化后的**新数组**     |

```javascript
// 不修改原数组示例
const nums = [1, 2, 3];

const newNums = nums.concat([4, 5]); // nums: [1, 2, 3], newNums: [1, 2, 3, 4, 5]
const part = nums.slice(0, 1); // nums: [1, 2, 3], part: [1]
const str = nums.join("-"); // nums: [1, 2, 3], str: "1-2-3"
```

### 3. 迭代方法 (Iteration Methods)

大多数迭代方法**不会**修改原数组（除非在回调函数中显式地修改它）。

| 方法            | 描述                                                                   | 返回值                          |
| :-------------- | :--------------------------------------------------------------------- | :------------------------------ |
| **forEach()**   | 对数组的每个元素执行一次提供的函数                                     | `undefined`                     |
| **map()**       | 创建一个新数组，其结果是该数组中的每个元素调用一次提供的函数后的返回值 | **新数组**                      |
| **filter()**    | 创建一个新数组，包含所有通过测试的元素                                 | **新数组**                      |
| **reduce()**    | 对数组中的每个元素执行一个 reducer 函数，将其结果汇总为单个返回值      | **累计值**                      |
| **some()**      | 测试数组中是不是至少有 1 个元素通过了被提供的函数测试                  | **Boolean**                     |
| **every()**     | 测试一个数组内的所有元素是否都能通过某个指定函数的测试                 | **Boolean**                     |
| **find()**      | 返回数组中满足提供的测试函数的第一个元素的值                           | **元素** (未找到返回 undefined) |
| **findIndex()** | 返回数组中满足提供的测试函数的第一个元素的索引                         | **索引** (未找到返回 -1)        |

```javascript
// 迭代方法示例
const list = [1, 2, 3, 4];

// map 返回新数组
const doubled = list.map((x) => x * 2); // [2, 4, 6, 8]

// filter 返回新数组
const evens = list.filter((x) => x % 2 === 0); // [2, 4]

// reduce 汇总
const sum = list.reduce((acc, curr) => acc + curr, 0); // 10
```

### 4. ES2023 新增非破坏性方法

ES2023 引入了一组对应于 `sort`, `reverse`, `splice` 的新方法，它们**不会修改原数组**，而是返回一个新的副本。

- `toSorted()`: 对应 `sort()`
- `toReversed()`: 对应 `reverse()`
- `toSpliced()`: 对应 `splice()`
- `with(index, value)`: 对应 `arr[index] = value` 的非破坏性版本

```javascript
const origin = [3, 1, 2];
const sorted = origin.toSorted();

console.log(origin); // [3, 1, 2] (未改变)
console.log(sorted); // [1, 2, 3] (新数组)
```

### 5. 手写实现Array.prototype.map

```javascript
Array.prototype.myMap = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError("Array.prototype.myMap called on null or undefined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  const O = Object(this);
  /**
   * Object(this) 将 this 转换为对象
   * 作用：将 this 转换为对象，确保可以调用对象的方法
   * 示例：Object([1, 2, 3]) // [1, 2, 3]
   * 作用：确保可以调用数组的方法，如 length
   * 示例：Object([1, 2, 3]).length // 3
   */
  const len = O.length >>> 0;
  /**
   * >>> 无符号右移运算符
   * 作用：将操作数的二进制表示向右移动指定的位数，移动后左侧用0填充
   * 效果：将一个数转换为无符号32位整数
   * 示例：5 >>> 0 // 5
   * -5 >>> 0 // 4294967291
   */
  const result = [];
  for (let i = 0; i < len; i++) {
    if (i in O) {
      A[i] = callback.call(thisArg, O[i], i, O);
    }
  }
  return result;
};

// 测试
const nums = [1, 2, 3];
const doubled = nums.myMap((x) => x * 2); // [2, 4, 6]
```

### 6、手写实现Array.prototype.filter

```javascript
Array.prototype.myFilter = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError("Array.prototype.myFilter called on null or undefined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  const O = Object(this);
  const len = O.length >>> 0;
  const result = [];
  for (let i = 0; i < len; i++) {
    if (i in O) {
      const element = O[i];
      if (callback.call(thisArg, element, i, O)) {
        result.push(element);
      }
    }
  }
  return result;
};

// 测试
const nums = [1, 2, 3, 4, 5];
const evens = nums.myFilter((x) => x % 2 === 0); // [2, 4]
```

### 7、手写实现Array.prototype.reduce

```javascript
Array.prototype.myReduce = function (callback, initialValue) {
  if (this == null) {
    throw new TypeError("Array.prototype.myReduce called on null or undefined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  const O = Object(this);
  const len = O.length >>> 0;
  let accumulator = initialValue;
  for (let i = 0; i < len; i++) {
    if (i in O) {
      if (accumulator === undefined) {
        accumulator = O[i];
      } else {
        accumulator = callback.call(undefined, accumulator, O[i], i, O);
      }
    }
  }
  return accumulator;
};

// 测试
const nums = [1, 2, 3, 4, 5];
const sum = nums.myReduce((acc, curr) => acc + curr, 0); // 15
```
