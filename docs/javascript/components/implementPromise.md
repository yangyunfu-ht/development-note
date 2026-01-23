# 手写 Promise (Implement Promise)

::: tip 提示
手写 Promise 是前端面试中的高频考点，也是深入理解异步编程的关键。本节将带你从零实现一个符合 Promise/A+ 规范的核心代码。
:::

## 1. 核心结构与状态

Promise 本质是一个状态机，拥有三种状态：

- `pending`: 等待中，初始状态
- `fulfilled`: 已成功，最终状态
- `rejected`: 已失败，最终状态

```javascript
class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(executor) {
    this.status = MyPromise.PENDING; // 初始状态
    this.value = null; // 成功返回值
    this.reason = null; // 失败原因
    this.onFulfilledCallbacks = []; // 成功回调队列（处理异步）
    this.onRejectedCallbacks = []; // 失败回调队列（处理异步）

    // 成功处理函数
    const resolve = (value) => {
      // 只有状态为 pending 时才能改变状态
      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.FULFILLED;
        this.value = value;
        // 执行所有暂存的成功回调
        this.onFulfilledCallbacks.forEach((cb) => cb(this.value));
      }
    };

    // 失败处理函数
    const reject = (reason) => {
      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.REJECTED;
        this.reason = reason;
        // 执行所有暂存的失败回调
        this.onRejectedCallbacks.forEach((cb) => cb(this.reason));
      }
    };

    try {
      // 立即执行 executor
      executor(resolve, reject);
    } catch (error) {
      // 如果 executor 执行报错，直接 reject
      reject(error);
    }
  }
}
```

## 2. then 方法实现

`then` 方法是 Promise 的核心，它必须返回一个新的 Promise 以实现链式调用。

**关键点：**

1. **参数检查**：确保 onFulfilled 和 onRejected 是函数，否则提供默认实现（值穿透）。
2. **异步执行**：规范要求 `then` 的回调必须异步执行（使用 `setTimeout` 模拟微任务）。
3. **状态处理**：
   - 如果状态是 `fulfilled`，异步执行 onFulfilled。
   - 如果状态是 `rejected`，异步执行 onRejected。
   - 如果状态是 `pending`，将回调存入队列。
4. **返回值处理**：使用 `resolvePromise` 统一处理回调返回值 `x`。

```javascript
  then(onFulfilled, onRejected) {
    // 1. 参数默认值处理（实现值穿透）
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    // 2. 返回一个新的 Promise
    const promise2 = new MyPromise((resolve, reject) => {
      // 封装重复逻辑
      const handleCallback = (callback, stateValue) => {
        // 模拟微任务
        setTimeout(() => {
          try {
            const x = callback(stateValue);
            // 处理返回值 x
            MyPromise.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      if (this.status === MyPromise.FULFILLED) {
        handleCallback(onFulfilled, this.value);
      } else if (this.status === MyPromise.REJECTED) {
        handleCallback(onRejected, this.reason);
      } else {
        // pending 状态：订阅发布模式
        this.onFulfilledCallbacks.push(() => handleCallback(onFulfilled, this.value));
        this.onRejectedCallbacks.push(() => handleCallback(onRejected, this.reason));
      }
    });

    return promise2;
  }
```

## 3. 核心解析过程 (resolvePromise)

这是 Promise A+ 规范中最复杂的部分，用于处理 `then` 回调的返回值 `x`。

```javascript
  static resolvePromise(promise2, x, resolve, reject) {
    // 1. 循环引用检测
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected for promise'));
    }

    // 2. 如果 x 是 Promise 或 Thenable 对象
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      let called = false; // 防止多次调用
      try {
        const then = x.then;
        if (typeof then === 'function') {
          // x 是一个 Promise，执行它的 then
          then.call(
            x,
            y => {
              if (called) return;
              called = true;
              // 递归解析 y（因为 y 可能还是一个 Promise）
              MyPromise.resolvePromise(promise2, y, resolve, reject);
            },
            r => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          // x 是普通对象/函数
          resolve(x);
        }
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      // 3. x 是普通值
      resolve(x);
    }
  }
```

## 4. 常用静态方法与实例方法

### catch

用于捕获错误，等同于 `then(null, onRejected)`。

```javascript
  catch(onRejected) {
    return this.then(null, onRejected);
  }
```

### finally

无论成功失败都会执行，且不接受参数，通常用于资源清理。

```javascript
  finally(callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback()).then(() => { throw reason })
    );
  }
```

### MyPromise.resolve

返回一个解析后的 Promise。

```javascript
  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }
```

### MyPromise.reject

返回一个拒绝的 Promise。

```javascript
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
```

### MyPromise.all

等待所有 Promise 完成，如果有一个失败则整体失败。

```javascript
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      let count = 0;

      if (promises.length === 0) {
        resolve(result);
        return;
      }

      promises.forEach((p, index) => {
        MyPromise.resolve(p).then(
          value => {
            result[index] = value;
            count++;
            if (count === promises.length) {
              resolve(result);
            }
          },
          reason => {
            reject(reason); // 只要有一个失败，立即失败
          }
        );
      });
    });
  }
```

### MyPromise.race

赛跑机制，返回最先改变状态的 Promise 结果。

```javascript
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(p => {
        MyPromise.resolve(p).then(resolve, reject);
      });
    });
  }
```

## 5. 完整使用示例

```javascript
// 模拟异步操作
const asyncTask = (name, time, success = true) => {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve(`${name} 完成`);
      } else {
        reject(`${name} 失败`);
      }
    }, time);
  });
};

// 1. 基础调用与链式调用
console.log("--- 基础测试 ---");
const p1 = new MyPromise((resolve) => {
  resolve("初始化成功");
});

p1.then((res) => {
  console.log("Step 1:", res);
  return "Step 2 数据";
})
  .then((res) => {
    console.log("Step 2:", res);
    return new MyPromise((r) => setTimeout(() => r("Step 3 异步数据"), 100));
  })
  .then((res) => {
    console.log("Step 3:", res);
  });

// 2. Promise.all 测试
console.log("--- Promise.all 测试 ---");
MyPromise.all([
  asyncTask("任务A", 100),
  asyncTask("任务B", 200),
  "普通值",
]).then((res) => {
  console.log("All 完成:", res); // ["任务A 完成", "任务B 完成", "普通值"]
});

// 3. 错误捕获
console.log("--- 错误捕获测试 ---");
asyncTask("失败任务", 100, false)
  .then((res) => console.log(res))
  .catch((err) => console.error("捕获错误:", err));
```
