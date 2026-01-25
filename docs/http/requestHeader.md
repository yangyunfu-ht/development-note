# HTTP 请求头 (Request Headers) 详解

HTTP 请求头（Request Headers）是客户端（如浏览器）发送给服务器的附加信息，用于告知服务器关于客户端的环境、请求偏好或身份验证等信息。

## 常见请求头清单

以下是开发中高频使用的 HTTP 请求头及其作用：

| 请求头                | 示例值                               | 作用与适用场景                                                                          |
| :-------------------- | :----------------------------------- | :-------------------------------------------------------------------------------------- |
| **Accept**            | `application/json, text/plain`       | 告知服务器客户端期望接收的数据格式（MIME 类型）。用于**内容协商**。                     |
| **Accept-Encoding**   | `gzip, deflate, br`                  | 告知服务器客户端支持的压缩算法。服务器可据此压缩响应体以节省带宽。                      |
| **Accept-Language**   | `zh-CN,zh;q=0.9,en;q=0.8`            | 告知服务器客户端期望的语言。用于**国际化 (i18n)** 适配。                                |
| **Authorization**     | `Bearer <token>`                     | 包含证明客户端身份的凭证。用于**身份验证**（如 JWT, OAuth）。                           |
| **Cache-Control**     | `no-cache` / `max-age=0`             | 指定请求和响应遵循的缓存机制。用于**控制缓存策略**。                                    |
| **Connection**        | `keep-alive`                         | 决定当前的事务完成后，是否保持网络连接打开。用于**长连接**优化性能。                    |
| **Content-Type**      | `application/json`                   | 告知服务器请求体（Body）的数据格式。**POST/PUT 请求必带**。                             |
| **Cookie**            | `session_id=xyz123`                  | 包含之前由服务器通过 `Set-Cookie` 发送的 HTTP Cookie。用于**会话状态管理**。            |
| **Host**              | `www.example.com`                    | 指定服务器的域名和端口号。**HTTP/1.1 唯一强制要求的请求头**，用于虚拟主机路由。         |
| **If-Modified-Since** | `Wed, 21 Oct 2015 07:28:00 GMT`      | 只有当资源在指定日期之后被修改过，才返回资源。用于**协商缓存** (配合 `Last-Modified`)。 |
| **If-None-Match**     | `"675af34563dc-tr34"`                | 只有当资源的 ETag 与提供的不匹配时，才返回资源。用于**协商缓存** (配合 `ETag`)。        |
| **Origin**            | `http://localhost:8080`              | 说明请求发起的源（协议+域名+端口）。主要用于 **CORS（跨域资源共享）** 校验。            |
| **Referer**           | `http://www.google.com/search?q=...` | 标识请求是从哪个页面链接过来的。常用于**防盗链**或统计分析。                            |
| **User-Agent**        | `Mozilla/5.0 ... Chrome/90.0...`     | 包含发起请求的用户代理软件的应用类型、操作系统、软件开发商以及版本号。                  |

## 核心场景深度解析

### 1. 内容协商 (Content Negotiation)

客户端和服务器约定数据格式的过程。

- **场景**：前端调用 API，期望返回 JSON 格式，而不是 XML 或 HTML。
- **关键头**：`Accept: application/json`
- **服务器响应**：`Content-Type: application/json`

### 2. 身份验证 (Authentication)

最常见的登录鉴权方式。

- **场景**：用户登录后，后续请求需要携带 Token 访问受保护接口。
- **关键头**：`Authorization: Bearer <your_jwt_token>`
- **注意**：不要在 URL 参数中传递 Token，使用 Header 更安全且符合规范。

### 3. 缓存控制 (Caching)

前端性能优化的重要手段。

- **场景**：浏览器刷新页面时，询问服务器资源是否更新。
- **关键头**：
  - `If-None-Match`: 上次响应的 `ETag` 值。
  - `If-Modified-Since`: 上次响应的 `Last-Modified` 时间。
- **结果**：如果资源未变，服务器返回 **304 Not Modified**，不返回包体，极大节省带宽。

### 4. 跨域与安全 (CORS & Security)

- **场景**：前端 (`a.com`) 请求后端 (`b.com`) 接口。
- **关键头**：
  - `Origin`: 浏览器自动携带，告诉服务器我是从哪里发起的。
  - `Referer`: 类似 Origin，但包含具体的路径。常用于图片防盗链（如果 Referer 不是白名单域名，则拒绝访问）。

### 5. 数据提交 (Data Submission)

决定后端如何解析请求体。

- **场景 A (JSON)**：
  - `Content-Type: application/json`
  - Body: `{"name": "Jack", "age": 18}`
- **场景 B (表单提交)**：
  - `Content-Type: application/x-www-form-urlencoded`
  - Body: `name=Jack&age=18`
- **场景 C (文件上传)**：
  - `Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...`
  - Body: 二进制文件流。
