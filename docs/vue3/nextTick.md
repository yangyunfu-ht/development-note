# Vue 3 中的 nextTick 原理

`nextTick` 是 Vue 提供的一个全局 API，常用于在 DOM 更新后执行回调。在 Vue 3 中，它的实现机制更加简洁，主要依赖于 Promise 和浏览器的微任务队列。

## 1. nextTick 的作用

在 Vue 中，**DOM 的更新是异步的**。当响应式数据发生变化时，Vue 并不会立即更新 DOM，而是开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。

这种缓冲机制可以去除重复数据造成的不必要的计算和 DOM 操作。

`nextTick` 的作用就是：**在下次 DOM 更新循环结束之后执行延迟回调**。在修改数据之后立即使用这个方法，获取更新后的 DOM。

### 常见使用场景

- 在 `created` 生命周期钩子中进行 DOM 操作（因为此时 DOM 还没渲染）。
- 在数据变化后，立即获取更新后的 DOM 元素（如获取列表的高度、滚动位置等）。

## 2. 实现原理

Vue 3 的 `nextTick` 实现主要依赖于 **微任务（Microtask）**。

### 核心概念

1. **异步更新队列**：Vue 内部维护了一个队列，用于存储需要更新的组件（副作用函数）。
2. **Scheduler（调度器）**：负责管理任务的执行顺序，确保组件更新任务在微任务队列中执行。
3. **Promise**：`nextTick` 本质上就是返回一个 `Promise`。

### 源码简析 (逻辑抽象)

Vue 3 的 `nextTick` 源码非常精简，大致逻辑如下：

```typescript
const resolvedPromise = Promise.resolve();
let currentFlushPromise: Promise<void> | null = null;

export function nextTick<T = void>(
  this: T,
  fn?: (this: T) => void,
): Promise<void> {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
```

但这只是 `nextTick` 函数本身，真正的魔法在于 Vue 的调度系统（Scheduler）。

当数据变化时：

1. Vue 会将更新任务（effect）推入 `queue` 队列。
2. 调用 `queueFlush()` 尝试刷新队列。
3. `queueFlush` 会创建一个微任务（通过 `Promise.resolve().then(flushJobs)`）。
4. `flushJobs` 负责遍历队列，执行所有的更新任务。

当你调用 `nextTick(fn)` 时：

1. 如果不传回调，它返回一个 Promise。
2. Vue 的更新任务已经被推入微任务队列。
3. `nextTick` 的回调也会被推入微任务队列。
4. 由于队列是先进先出的，Vue 的 DOM 更新任务会先执行，然后才会执行 `nextTick` 的回调。

### 简易实现模型

我们可以用一段简化的代码来模拟这个过程：

```javascript
const queue = [];
let isFlushing = false;
const p = Promise.resolve();

// 模拟组件更新
function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
    queueFlush();
  }
}

function queueFlush() {
  if (isFlushing) return;
  isFlushing = true;
  // 将刷新任务放入微任务队列
  p.then(flushJobs);
}

function flushJobs() {
  console.log("--- 开始更新 DOM ---");
  let job;
  while ((job = queue.shift())) {
    job();
  }
  isFlushing = false;
  console.log("--- DOM 更新结束 ---");
}

// 我们的 nextTick
function nextTick(fn) {
  return fn ? p.then(fn) : p;
}

// 测试
console.log("1. 数据改变");
queueJob(() => console.log("   DOM 更新 1"));
queueJob(() => console.log("   DOM 更新 2"));

console.log("2. 调用 nextTick");
nextTick(() => {
  console.log("3. nextTick 回调执行 (DOM 此时已更新)");
});

console.log("4. 同步代码结束");
```

**输出顺序：**

1. 1. 数据改变
2. 1. 调用 nextTick
3. 1. 同步代码结束
4. --- 开始更新 DOM ---
5. DOM 更新 1
6. DOM 更新 2
7. --- DOM 更新结束 ---
8. 1. nextTick 回调执行 (DOM 此时已更新)

## 3. Vue 2 vs Vue 3 的区别

- **Vue 2**: 采用了 **优雅降级** 的策略。为了兼容各种浏览器，它会按顺序尝试使用 `Promise` -> `MutationObserver` -> `setImmediate` -> `setTimeout` 来创建异步任务。
- **Vue 3**: 直接使用 `Promise.resolve().then()`。因为 Vue 3 不再支持 IE11，而现代浏览器都支持 Promise，所以不再需要复杂的降级策略，实现更加简洁。

## 总结

1. `nextTick` 利用了浏览器的 **微任务（Microtask）** 机制。
2. Vue 的响应式系统会将 DOM 更新任务推入微任务队列。
3. `nextTick` 的回调会被追加到同一个微任务队列的尾部。
4. 因此，`nextTick` 的回调总是在 DOM 更新完成后执行。
