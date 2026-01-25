# Promise 异步编程

Promise 是 ES6 引入的异步编程解决方案，比传统的解决方案（回调函数）更合理、更强大。它解决了回调地狱（Callback Hell）的问题，使异步代码更加清晰和易于维护。

## 1. 核心概念

Promise 对象代表一个异步操作的最终完成（或失败）及其结果值。它有三种状态：

1.  **Pending（进行中）**：初始状态，既没有被兑现，也没有被拒绝。
2.  **Fulfilled（已成功）**：意味着操作成功完成。
3.  **Rejected（已失败）**：意味着操作失败。

状态改变只有两种可能：

- 从 Pending -> Fulfilled
- 从 Pending -> Rejected

一旦状态改变，就不会再变，任何时候都可以得到这个结果。

## 2. 基本用法

Promise 是一个构造函数，接受一个函数作为参数，该函数的两个参数分别是 `resolve` 和 `reject`。

```javascript
const myPromise = new Promise((resolve, reject) => {
  // 执行异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve("操作成功"); // 将状态修改为 Fulfilled
    } else {
      reject("操作失败"); // 将状态修改为 Rejected
    }
  }, 1000);
});

// 消费 Promise
myPromise
  .then((value) => {
    console.log(value); // "操作成功"
  })
  .catch((error) => {
    console.error(error); // "操作失败"
  })
  .finally(() => {
    console.log("无论成功失败都会执行");
  });
```

## 3. 静态方法

### (1). Promise.all()

用于将多个 Promise 实例，包装成一个新的 Promise 实例。

- 只有所有实例都 Fulfilled，新实例才 Fulfilled。
- 只要有一个实例 Rejected，新实例就 Rejected。

```javascript
const p1 = Promise.resolve(1);
const p2 = new Promise((resolve) => setTimeout(() => resolve(2), 1000));
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3]).then((results) => {
  console.log(results); // [1, 2, 3] (等待 p2 完成后一起返回)
});
```

### (2). Promise.race()

同样是将多个 Promise 实例包装成一个新的 Promise 实例。

- 只要有一个实例率先改变状态（无论是 Fulfilled 还是 Rejected），新实例的状态就跟着改变。

```javascript
const p1 = new Promise((resolve) => setTimeout(() => resolve("慢"), 2000));
const p2 = new Promise((resolve) => setTimeout(() => resolve("快"), 500));

Promise.race([p1, p2]).then((result) => {
  console.log(result); // "快"
});
```

### (3). Promise.allSettled() (ES2020)

等待所有实例都返回结果，不管是 Fulfilled 还是 Rejected。

```javascript
Promise.allSettled([Promise.resolve("成功"), Promise.reject("失败")]).then(
  (results) => {
    console.log(results);
    /*
  [
    { status: 'fulfilled', value: '成功' },
    { status: 'rejected', reason: '失败' }
  ]
  */
  },
);
```

## 4. async / await

ES2017 引入了 async/await，它是 Promise 的语法糖，使异步代码看起来像同步代码。

- `async` 函数返回一个 Promise。
- `await` 只能在 `async` 函数内部使用，等待一个 Promise 解决。

```javascript
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function asyncCall() {
  console.log("开始");
  await delay(1000); // 等待 1 秒
  console.log("结束");
}

asyncCall();
```

## 5.常见面试题：红绿灯

使用 Promise 实现红绿灯交替闪烁：红灯 3s，绿灯 2s，黄灯 1s。

```javascript
function light(color, duration) {
  return new Promise((resolve) => {
    console.log(color);
    setTimeout(resolve, duration);
  });
}

async function trafficLight() {
  while (true) {
    await light("红灯", 3000);
    await light("绿灯", 2000);
    await light("黄灯", 1000);
  }
}

// trafficLight();
```
