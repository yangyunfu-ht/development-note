## 节流(Throttle)

节流（Throttle）是前端开发中常用的性能优化技术。它的核心思想是：**规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。**

### 为什么需要节流？

与防抖类似，节流也是为了解决高频事件触发导致的性能问题。常见的应用场景包括：

- 滚动加载，监控滚动条位置（`scroll` 事件）
- 窗口大小调整，重新计算布局（`resize` 事件）
- 拖拽操作，计算移动距离（`mousemove` 事件）
- 射击游戏中的发射子弹（限制频率）

### 原理图解

假设我们设置节流时间为 1000ms：

1. 第一次触发事件，立即执行一次。
2. 在接下来的 1000ms 内，无论触发多少次事件，都不会执行。
3. 1000ms 结束后，如果再次触发事件，会再次执行，并重新开始 1000ms 的计时周期。

### 代码实现

#### 时间戳版

使用时间戳实现，当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳(最一开始值设为 0 )，如果大于设置的时间周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。

特点：**第一次触发会立即执行**。

```javascript
/**
 * 节流函数（时间戳版）
 * @param {Function} fn 需要节流执行的函数
 * @param {number} delay 延迟时间（毫秒）
 */
function throttle(fn, delay) {
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastTime > delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}
```

#### 定时器版

当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。

特点：**第一次触发不会立即执行，而是在 delay 后执行**。

```javascript
/**
 * 节流函数（定时器版）
 * @param {Function} fn 需要节流执行的函数
 * @param {number} delay 延迟时间（毫秒）
 */
function throttle(fn, delay) {
  let timer = null;

  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      }, delay);
    }
  };
}
```

#### TypeScript 版本

带有完善类型声明的实现，这里采用**时间戳**的方式，适合大多数立即响应的场景。

```typescript
/**
 * 节流函数
 * @param fn 需要节流执行的函数
 * @param delay 延迟时间（毫秒）
 */
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastTime = 0;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now();
    const context = this;

    if (now - lastTime > delay) {
      fn.apply(context, args);
      lastTime = now;
    }
  };
}
```
