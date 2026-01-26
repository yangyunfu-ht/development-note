# 请求竞态 (Race Condition) 详解

## 1. 什么是请求竞态？

**请求竞态 (Request Race Condition)** 是指在前端交互中，先后发送了多个异步请求，但由于网络延迟等原因，**请求的响应顺序与发送顺序不一致**，导致先发送的请求后返回，从而覆盖了后发送请求的结果，最终 UI 显示了错误（过时）的数据。

### 场景示例：搜索框自动补全

1. 用户输入 "A"，前端发送请求 `req1` (搜索 "A")。
2. 用户继续输入 "B"，变成 "AB"，前端发送请求 `req2` (搜索 "AB")。
3. 理想情况：`req1` 先返回，`req2` 后返回，UI 显示 "AB" 的结果。
4. **竞态情况**：
   - `req2` 响应很快，先返回了。UI 更新为 "AB" 的结果。
   - `req1` 由于网络拥堵，**后返回了**。
   - 前端代码没有处理，直接用 `req1` 的结果更新了 UI。
   - **结果**：输入框里是 "AB"，但列表显示的却是 "A" 的搜索结果。

## 2. 会有什么问题？

1. **数据展示错误**：用户看到的数据与当前操作（或输入）不匹配。
2. **糟糕的用户体验**：用户可能会感到困惑，为什么输入了新的内容，结果却变回了旧的。
3. **潜在的逻辑错误**：如果后续操作依赖于这些数据，可能导致更严重的业务逻辑错误。

## 3. 如何处理请求竞态问题？

解决思路主要有两种：

1. **取消请求**：发送新请求时，取消掉上一个未完成的请求（浏览器不再接收响应，或丢弃响应）。
2. **忽略响应**：请求都发送出去，响应也都接收，但在处理响应时判断：**“这个响应是否已经过时？”** 如果过时则忽略。

## 4. 如何处理？

### 方案一：使用 AbortController (取消请求)

现代浏览器支持 `AbortController` API，可以直接取消 HTTP 请求。

```javascript
let controller;

async function fetchData() {
  // 如果存在正在进行的请求，直接取消
  if (controller) controller.abort();

  controller = new AbortController();

  try {
    const response = await fetch("/api/data", { signal: controller.signal });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("请求被取消了");
    } else {
      // 处理真实错误
    }
  }
}
```

**优势**：

- **节省带宽**：浏览器会真正终止网络请求（如果在发送前或传输中）。
- **更规范**：符合现代 Web 标准。

### 方案二：底层（封装 Axios/Fetch）统一处理

在底层统一处理竞态问题，最优雅的方式是利用 Axios 拦截器（Interceptors）。通过维护一个全局的 Map，我们可以根据请求的 URL、方法、参数 生成唯一的 key，从而精准地识别并取消重复的请求。

```javascript
import axios from "axios";

class RequestManager {
  constructor() {
    this.pendingRequests = new Map();
  }

  // 生成唯一的请求 Key
  generateKey(config) {
    const { method, url, params, data } = config;
    // 这里的 data 可能是对象，需要序列化；如果是 FormData 则需特殊处理
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join(
      "&",
    );
  }

  // 添加请求并取消之前的重复请求
  addPending(config) {
    const key = this.generateKey(config);
    if (this.pendingRequests.has(key)) {
      const controller = this.pendingRequests.get(key);
      controller.abort(); // 取消上一个
      this.pendingRequests.delete(key);
    }

    const controller = new AbortController();
    config.signal = controller.signal; // 绑定取消信号
    this.pendingRequests.set(key, controller);
  }

  // 请求完成后移除记录
  removePending(config) {
    const key = this.generateKey(config);
    if (this.pendingRequests.has(key)) {
      this.pendingRequests.delete(key);
    }
  }
}

const manager = new RequestManager();

const service = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 自动取消重复请求
    manager.addPending(config);
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 请求成功，移除记录
    manager.removePending(response.config);
    return response.data;
  },
  (error) => {
    // 如果是取消请求引起的错误，通常不需要抛给业务层处理
    if (axios.isCancel(error)) {
      console.warn("请求已取消:", error.message);
      return new Promise(() => {}); // 返回一个 pending 状态的 promise 阻止后续 catch
    }
    // 真正发生错误时移除记录
    manager.removePending(error.config || {});
    return Promise.reject(error);
  },
);
```

### 3. 注意事项与优化

- 在实际工业代码中，这种“一刀切”的取消策略会有几个细节问题：

- 白名单机制： 并不是所有请求都要取消。例如“上传文件”或“埋点统计”，即便参数相同也应该允许并发。你可以在 config 中添加一个自定义字段 cancelDuplicate: false 来跳过逻辑。

- 序列化开销： 对巨大的 JSON 对象进行 JSON.stringify 会消耗性能，在极致性能要求的场景下，可以只对 URL 和部分关键参数进行哈希。

- 清理时机： 务必在 response 的成功和失败回调中都调用 removePending，防止内存泄漏。

### 方案三：使用成熟的数据请求库 (推荐)

在实际项目中，推荐使用 **React Query (TanStack Query)** 或 **SWR**。它们内部已经处理了竞态问题。

**React Query 示例**：

```jsx
import { useQuery } from "@tanstack/react-query";

function SearchResults({ query }) {
  // React Query 自动处理了竞态，始终返回与当前 query key 匹配的最新数据
  const { data } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchApi(query),
  });

  return <div>{/* ... */}</div>;
}
```

## 总结

- **请求竞态**是异步操作中常见的问题，会导致 UI 数据不一致。
- 通过**AbortController**（取消过时请求）来解决。
- 最佳实践是使用 **React Query** 或 **SWR** 等库，它们默认提供了竞态处理机制，无需手动编写防御性代码。
