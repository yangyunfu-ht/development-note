# JavaScript Math 对象与数值精度

## 1. Math 对象常用方法

`Math` 是 JavaScript 的一个内置对象，提供了一系列数学常数和函数。它不是一个构造函数，所有属性和方法都是静态的。

### 1.1 取整方法

- **`Math.floor(x)`**: 向下取整（返回小于或等于一个给定数字的最大整数）。

  ```javascript

  Math.floor(5.9); // 5
  Math.floor(-5.9); // -6
  
  ```

- **`Math.ceil(x)`**: 向上取整（返回大于或等于一个给定数字的最小整数）。

  ```javascript
  Math.ceil(5.1); // 6
  Math.ceil(-5.1); // -5
  ```

- **`Math.round(x)`**: 四舍五入。

  ```javascript
  Math.round(5.4); // 5
  Math.round(5.5); // 6
  Math.round(-5.5); // -5 (注意：-5.5 向正无穷方向舍入为 -5，但大部分语言通常是 -6，JS 此处特殊)
  // 准确说是“四舍六入五取整”还是“四舍五入”？
  // JS 的 round 是：若小数部分 >= 0.5，则向 +∞ 方向取整；否则向 -∞ 方向取整。
  ```

- **`Math.trunc(x)`** (ES6): 去除小数部分，只保留整数部分。

  ```javascript
  Math.trunc(5.9); // 5
  Math.trunc(-5.9); // -5
  ```

### 1.2 最值与绝对值

- **`Math.max(n1, n2, ...)`**: 返回一组数中的最大值。

  ```javascript
  Math.max(1, 5, 10); // 10
  const arr = [1, 5, 10];
  Math.max(...arr); // 10
  ```

- **`Math.min(n1, n2, ...)`**: 返回一组数中的最小值。

  ```javascript
  Math.min(1, 5, 10); // 1
  ```

- **`Math.abs(x)`**: 返回绝对值。

  ```javascript
  Math.abs(-10); // 10
  ```

### 1.3 随机数

- **`Math.random()`**: 返回 `[0, 1)` 之间的伪随机浮点数。

  ```javascript
  // 生成 [min, max] 之间的随机整数
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  ```

### 1.4 其他常用方法

- **`Math.pow(base, exponent)`**: 返回基数的指数次幂。

  ```javascript
  Math.pow(2, 3); // 8 (2的3次方)
  // ES7 写法
  2 ** 3; // 8
  ```

- **`Math.sqrt(x)`**: 返回数的平方根。

  ```javascript
  Math.sqrt(9); // 3
  ```

## 2. 为什么 0.1 + 0.2 !== 0.3 ？

在 JavaScript 中：

```javascript
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false
```

### 原因分析

1. **IEEE 754 标准**：JavaScript 中的 Number 类型统一使用 **IEEE 754 双精度浮点数 (64位)** 标准存储。
2. **二进制存储**：计算机底层使用二进制存储数据。
    - 整数可以精确转换为二进制。
    - **小数往往无法用有限的二进制位精确表示**。

    例如 `0.1` 转换为二进制是一个无限循环小数：

    ```text
    0.1 (十进制) = 0.00011001100110011... (二进制)
    ```

3. **精度丢失**：
    - **存储时丢失**：由于 64 位存储空间有限（52 位用于存储有效数字），无限循环的二进制必须被截断，导致第一次精度丢失。
    - **运算时丢失**：0.1 和 0.2 做加法时，需要进行对阶运算，又会发生截断，导致第二次精度丢失。

最终结果转换回十进制时，就变成了 `0.30000000000000004`。

## 3. 如何解决精度问题

### 3.1 使用 `toFixed()` (仅用于展示)

`toFixed()` 方法可把 Number 四舍五入为指定小数位数的字符串。

```javascript
const result = 0.1 + 0.2;
console.log(result.toFixed(1)); // "0.3" (注意返回的是字符串)
console.log(parseFloat(result.toFixed(1))); // 0.3
```

### 3.2 转换为整数运算 (推荐)

先将小数乘以 10 的 N 次方转为整数，运算后再除以 10 的 N 次方。

```javascript
function add(num1, num2) {
  // 获取两个数的小数位数
  const r1 = num1.toString().split(".")[1]?.length || 0;
  const r2 = num2.toString().split(".")[1]?.length || 0;
  // 计算放大的倍数
  const m = Math.pow(10, Math.max(r1, r2));

  // 运算并还原
  // 注意：直接乘可能还会有一点点误差，更稳妥是先去点再运算，或者配合 Math.round
  return (Math.round(num1 * m) + Math.round(num2 * m)) / m;
}

console.log(add(0.1, 0.2)); // 0.3
```

### 3.3 使用 Number.EPSILON (ES6)

`Number.EPSILON` 是 JavaScript 表示的最小精度（2 的 -52 次方）。如果两个数的差值小于这个值，我们可以认为它们相等。

```javascript
function isEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}

console.log(isEqual(0.1 + 0.2, 0.3)); // true
```

### 3.4 使用第三方库 (生产环境推荐)

在涉及金额等高精度计算的场景，建议使用成熟的库，如：

- **decimal.js**
- **bignumber.js**
- **mathjs**

```javascript
// 示例 (需安装 decimal.js)
// import Decimal from 'decimal.js';
// const a = new Decimal(0.1);
// const b = new Decimal(0.2);
// console.log(a.plus(b).toNumber()); // 0.3
```
