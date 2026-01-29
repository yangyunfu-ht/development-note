# 浏览器本地存储详解

在现代前端开发中，浏览器存储是必不可少的一部分。它允许我们将数据存储在用户的浏览器中，用于持久化用户偏好、缓存数据、管理会话状态等。

常见的浏览器本地存储方案主要包括：**Cookie**、**LocalStorage**、**SessionStorage** 和 **IndexedDB**。

## 1. Cookie

**定义**：Cookie 是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。

**特点**：

- **容量小**：通常限制在 4KB 左右。
- **自动携带**：每次 HTTP 请求都会携带在 Header 中（如果不注意控制大小，会浪费带宽）。
- **过期控制**：可以设置过期时间（Expires 或 Max-Age）。如果不设置，默认为会话级（关闭浏览器失效）。
- **安全性**：虽然可以通过 `HttpOnly` 标志防止 JavaScript 访问（防御 XSS），但仍以明文形式传输（除非使用 HTTPS）。

**应用场景**：

- 身份认证（Session ID、Token）。
- 个性化设置（如用户自定义的主题）。
- 追踪分析（如 Google Analytics）。

**代码示例**：

```javascript
// 设置 Cookie
document.cookie =
  "username=John Doe; expires=Thu, 18 Dec 2026 12:00:00 UTC; path=/";

// 获取 Cookie (需要自行解析字符串)
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
```

## 2. LocalStorage

**定义**：HTML5 引入的 Web Storage API 之一，用于持久化的本地存储。

**特点**：

- **容量大**：通常为 5MB 左右（不同浏览器略有差异）。
- **持久存储**：除非主动删除，否则数据永远不会过期。
- **仅在客户端**：数据不会随 HTTP 请求发送到服务器。
- **同源限制**：受同源策略限制。

**应用场景**：

- 存储长期稳定的数据（如用户偏好配置、Token）。
- 缓存静态资源或接口数据。

**代码示例**：

```javascript
// 存储
localStorage.setItem("theme", "dark");

// 读取
const theme = localStorage.getItem("theme");

// 删除
localStorage.removeItem("theme");

// 清空所有
localStorage.clear();
```

## 3. SessionStorage

**定义**：HTML5 引入的 Web Storage API 之一，用于临时性的会话存储。

**特点**：

- **容量大**：通常为 5MB 左右。
- **会话级生命周期**：数据只在当前会话（Tab 标签页）期间有效。关闭标签页或窗口后，数据会被清除。
- **独立性**：即使是同一个页面的不同标签页，SessionStorage 也是相互隔离的。
- **仅在客户端**：不参与服务器通信。

**应用场景**：

- 表单数据的临时保存（防止刷新丢失）。
- 一次性的登录信息或临时状态。

**代码示例**：

```javascript
sessionStorage.setItem("tempId", "123456");
const id = sessionStorage.getItem("tempId");
```

## 4. IndexedDB

**定义**：一种低级 API，用于在客户端存储大量的结构化数据（包括文件/Blob）。

**特点**：

- **容量巨大**：通常不少于 250MB，甚至没有上限（取决于硬盘空间）。
- **异步操作**：数据库操作不会阻塞主线程。
- **支持事务**：保证数据的一致性。
- **键值对存储**：支持索引，查询性能高。

**应用场景**：

- 离线应用（PWA）。
- 存储大量数据（如复杂的 CMS 系统、编辑器数据）。
- 性能要求高的应用场景。

---

## 5. 区别对比总结

| 特性             | Cookie             | LocalStorage           | SessionStorage             | IndexedDB              |
| :--------------- | :----------------- | :--------------------- | :------------------------- | :--------------------- |
| **生命周期**     | 可设置，默认会话级 | 永久有效，除非手动删除 | 仅在当前会话（标签页）有效 | 永久有效，除非手动删除 |
| **存储大小**     | 4KB 左右           | 5MB 左右               | 5MB 左右                   | 很大 (>250MB)          |
| **与服务器通信** | 每次请求自动携带   | 不参与                 | 不参与                     | 不参与                 |
| **访问方式**     | `document.cookie`  | `window.localStorage`  | `window.sessionStorage`    | 异步 API               |
| **易用性**       | 难（需自行封装）   | 简单 (Key-Value)       | 简单 (Key-Value)           | 复杂 (类似数据库操作)  |
| **主要用途**     | 身份验证、小量状态 | 长期数据缓存           | 临时数据保存               | 大量结构化数据         |

## 6. 常见面试题：LocalStorage 与 Cookie 的区别？

1. **存储大小**：Cookie 只有 4KB，LocalStorage 有 5MB。
2. **数据交互**：Cookie 会随请求发送到服务器，浪费带宽；LocalStorage 仅在本地存储。
3. **生命周期**：Cookie 有过期时间；LocalStorage 是永久存储。
4. **操作封装**：LocalStorage 有原生 API (`getItem`/`setItem`)，Cookie 需要手动解析字符串。
