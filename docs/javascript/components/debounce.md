## 防抖(debounce)

防抖（Debounce）是前端开发中常用的性能优化技术。它的核心思想是：**在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时。**

### 为什么需要防抖？

在前端开发中，某些事件会被频繁触发，例如：

- 输入框的 `input` 事件（搜索联想）
- 窗口的 `resize` 事件
- 页面的 `scroll` 事件

如果这些事件的回调函数中包含复杂的计算或网络请求，频繁触发会导致浏览器性能下降，甚至卡顿。防抖可以有效地减少回调函数的执行次数。

### 原理图解

假设我们设置防抖时间为 500ms：

1. 第一次触发事件，开始计时 500ms。
2. 如果在 500ms 内没有再次触发，倒计时结束，执行回调。
3. 如果在 500ms 内（比如 200ms 时）再次触发，则取消上一次计时，重新开始计时 500ms。

### 代码实现

### 基础版本

这是最简单的防抖实现，包含基本的延时执行逻辑。

```javascript
/**
 * 防抖函数
 * @param {Function} fn 需要防抖执行的函数
 * @param {number} delay 延迟时间（毫秒）
 * @returns {Function}
 */
function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    // 如果此时存在定时器的话，则取消之前的定时器重新记时
    if (timer) {
      clearTimeout(timer);
    }

    // 设置定时器，使事件间隔指定事件后执行
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

#### 立即执行版本

有时候我们需要事件触发时立即执行一次，然后等待 n 秒后才能再次触发执行。

```javascript
/**
 * 防抖函数（支持立即执行）
 * @param {Function} fn 需要防抖执行的函数
 * @param {number} delay 延迟时间
 * @param {boolean} immediate 是否立即执行
 */
function debounce(fn, delay, immediate = false) {
  let timer = null;

  return function (...args) {
    if (timer) clearTimeout(timer);

    if (immediate) {
      // 如果已经执行过，不再执行
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      if (callNow) fn.apply(this, args);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  };
}
```

#### TypeScript 版本

带有完善类型声明的实现，利用泛型保留参数类型。

```typescript
/**
 * 防抖函数
 * @param fn 需要防抖执行的函数
 * @param delay 延迟时间（毫秒）
 * @param immediate 是否立即执行
 */
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate: boolean = false,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;

    if (timer) clearTimeout(timer);

    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      if (callNow) fn.apply(context, args);
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    }
  };
}
```

### 使用示例

#### 1. 搜索框联想

```javascript
const searchInput = document.getElementById("search");

function handleSearch(e) {
  console.log("Searching for:", e.target.value);
  // 发送 API 请求...
}

// 使用防抖，500ms 后执行
const debouncedSearch = debounce(handleSearch, 500);

searchInput.addEventListener("input", debouncedSearch);
```

#### 2. 窗口调整大小

```javascript
function handleResize() {
  console.log("Window resized");
  // 重新计算布局...
}

window.addEventListener("resize", debounce(handleResize, 300));
```

### 推荐库

在实际项目中，建议使用成熟的工具库，如 [Lodash](https://lodash.com/docs/4.17.15#debounce)。

```javascript
import { debounce } from "lodash-es";

const debouncedFn = debounce(() => {
  console.log("Executed!");
}, 1000);
```
