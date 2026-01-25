# 从输入 URL 到页面渲染的全过程

这是一个非常经典的前端面试题，它涵盖了计算机网络、浏览器原理等多个领域的知识。整个过程可以大致分为以下几个阶段：

1.  **URL 解析**
2.  **DNS 查询**
3.  **TCP 连接**
4.  **HTTP 请求**
5.  **服务器处理**
6.  **浏览器渲染**
7.  **断开连接**

---

## 1. URL 解析

浏览器首先会判断你输入的是一个合法的 URL 还是一个搜索关键词。

- **合法 URL**：直接使用该 URL。
- **搜索关键词**：使用默认搜索引擎拼接成搜索 URL。

此外，浏览器还会检查 URL 是否包含非 ASCII 字符，如果有则进行编码（Encode）。

**URL 结构**：
`protocol://host:port/path?query#fragment`

- `protocol`: 协议（http, https）
- `host`: 域名或 IP
- `port`: 端口（http 默认为 80, https 默认为 443）
- `path`: 路径
- `query`: 查询参数
- `fragment`: 锚点

---

## 2. DNS 查询 (Domain Name System)

浏览器需要知道域名对应的 IP 地址才能建立连接。DNS 查询过程如下（从近到远）：

1.  **浏览器缓存**：检查浏览器自身的 DNS 缓存。
2.  **系统缓存**：检查操作系统 hosts 文件或 DNS 缓存。
3.  **路由器缓存**：检查路由器的 DNS 缓存。
4.  **ISP DNS 缓存**：检查互联网服务提供商（ISP）的 DNS 服务器缓存。
5.  **递归查询**：
    - **根域名服务器**：返回顶级域名（.com, .cn）服务器地址。
    - **顶级域名服务器**：返回权威域名服务器地址。
    - **权威域名服务器**：返回最终的 IP 地址。

---

## 3. TCP 连接 (三次握手)

拿到 IP 地址后，浏览器与服务器建立 TCP 连接。为了确保双方都能收发数据，需要进行三次握手：

1.  **第一次握手 (SYN)**：客户端发送 SYN 包，进入 SYN_SEND 状态。
    - _客户端：我要连你了，听得到吗？_
2.  **第二次握手 (SYN + ACK)**：服务器收到 SYN，回复 SYN+ACK 包，进入 SYN_RECV 状态。
    - _服务器：听到了，我也要连你，你听得到吗？_
3.  **第三次握手 (ACK)**：客户端收到 SYN+ACK，回复 ACK 包，进入 ESTABLISHED 状态。
    - _客户端：听到了，那我们要开始传输数据了。_

> **为什么是三次？** 为了防止已失效的连接请求报文段突然又传送到了服务端，因而产生错误。

---

## 4. 发送 HTTP 请求

连接建立后，浏览器发送 HTTP 请求报文。

**请求报文结构**：

- **请求行**：方法 (GET/POST)、URL、协议版本。
- **请求头**：Host, User-Agent, Cookie, Content-Type 等。
- **请求体**：POST 请求携带的数据。

---

## 5. 服务器处理请求

服务器收到请求后，经过逻辑处理（如查询数据库），返回 HTTP 响应报文。

**响应报文结构**：

- **状态行**：协议版本、状态码 (200, 404, 500)、状态描述。
- **响应头**：Content-Type, Content-Length, Set-Cookie, Cache-Control 等。
- **响应体**：HTML 内容、JSON 数据等。

**常见状态码**：

- `2xx`: 成功 (200 OK)
- `3xx`: 重定向 (301 永久重定向, 302 临时重定向, 304 资源未修改)
- `4xx`: 客户端错误 (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found)
- `5xx`: 服务器错误 (500 Internal Server Error, 502 Bad Gateway)

---

## 6. 浏览器渲染 (Critical Rendering Path)

浏览器收到 HTML 后，开始解析和渲染。这是一个渐进的过程。

### 6.1 构建 DOM 树

解析 HTML 文档，将标签转换成 DOM 节点，生成 **DOM Tree**。

- 遇到 `<script>` 会暂停解析（除非有 `async` 或 `defer` 属性），下载并执行 JS。

### 6.2 构建 CSSOM 树

解析 CSS（包括外部样式表和内部样式），生成 **CSSOM Tree** (CSS Object Model)。

- CSS 解析不阻塞 HTML 解析，但会阻塞渲染。

### 6.3 生成渲染树 (Render Tree)

将 DOM Tree 和 CSSOM Tree 合并，生成 **Render Tree**。

- `display: none` 的节点不会出现在 Render Tree 中。
- `visibility: hidden` 的节点会出现在 Render Tree 中（占据空间）。

### 6.4 布局 (Layout / Reflow)

计算 Render Tree 中每个节点在屏幕上的确切位置和大小。

- 这个过程也叫 **回流 (Reflow)**。

### 6.5 绘制 (Paint / Repaint)

将节点的颜色、背景、边框、阴影等绘制到屏幕上。

- 这个过程也叫 **重绘 (Repaint)**。

### 6.6 合成 (Composite)

浏览器将不同的图层（Layer）进行合成，最终显示在屏幕上。

- 使用 `transform: translateZ(0)` 或 `will-change` 可以开启硬件加速，创建新的图层。

> **回流 vs 重绘**：
>
> - **回流必将引起重绘，重绘不一定引起回流。**
> - 改变布局（宽、高、位置）触发回流。
> - 改变外观（颜色、背景）触发重绘。

---

## 7. 断开连接 (四次挥手)

数据传输完毕后，断开 TCP 连接。

1.  **第一次挥手**：客户端发送 FIN，进入 FIN_WAIT_1。
    - _客户端：我发完了，我要挂了。_
2.  **第二次挥手**：服务器收到 FIN，回复 ACK，进入 CLOSE_WAIT。
    - _服务器：知道了，但我可能还有话没说完，你先等等。_
3.  **第三次挥手**：服务器数据发完了，发送 FIN，进入 LAST_ACK。
    - _服务器：我也发完了，挂了吧。_
4.  **第四次挥手**：客户端收到 FIN，回复 ACK，进入 TIME_WAIT。
    - _客户端：好的，挂了。_

> **为什么是四次？** 因为 TCP 是全双工的，关闭连接时，客户端发送 FIN 只是表示客户端不再发送数据了，但还可以接收数据；服务器收到 FIN 后，可能还有数据要发送，所以先回复 ACK，等所有数据都发完了，再发送 FIN。

---

## 总结图示

```mermaid
graph TD
    A[输入 URL] --> B{URL 解析}
    B --> C[DNS 查询]
    C --> D[TCP 三次握手]
    D --> E[发送 HTTP 请求]
    E --> F[服务器处理响应]
    F --> G[浏览器渲染]
    G --> H[解析 HTML -> DOM Tree]
    G --> I[解析 CSS -> CSSOM Tree]
    H & I --> J[生成 Render Tree]
    J --> K[Layout (布局)]
    K --> L[Paint (绘制)]
    L --> M[Composite (合成)]
    M --> N[TCP 四次挥手]
```
