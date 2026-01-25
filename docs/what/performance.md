# 前端性能优化体系

前端性能优化是一个系统性工程，主要目的是提高页面加载速度和交互响应速度，提升用户体验。

## 1. 性能指标 (Performance Metrics)

在优化之前，我们需要了解衡量的标准。Google 提出的 **Core Web Vitals** 是目前主流的评估指标。

- **FCP (First Contentful Paint)**: 首次内容绘制，页面开始加载到页面中任何内容（文本、图像、Canvas 等）首次呈现在屏幕上的时间。
- **LCP (Largest Contentful Paint)**: 最大内容绘制，视口内最大可见元素（通常是图片或大块文本）渲染的时间。建议控制在 **2.5s** 以内。
- **FID (First Input Delay)**: 首次输入延迟，用户第一次与页面交互（点击链接、按钮等）到浏览器实际能够响应该交互的时间。建议控制在 **100ms** 以内。
- **CLS (Cumulative Layout Shift)**: 累积布局偏移，衡量页面视觉稳定性。建议分数小于 **0.1**。
- **TTI (Time to Interactive)**: 可交互时间，页面内容完全渲染并可响应用户交互的时间。

## 2. 网络层优化 (Network Optimization)

核心思想：**减少请求数量**、**减小资源体积**、**利用缓存**。

### 2.1 减少 HTTP 请求

- **合并文件**：将多个 CSS/JS 文件合并（HTTP/2 下该策略重要性降低）。
- **雪碧图 (Sprite)**：将多个小图标合并为一张大图，减少图片请求。
- **Base64 内联**：小图片（如 < 10KB）转为 Base64 嵌入 HTML/CSS 中。

### 2.2 减小资源体积

- **代码压缩**：使用 UglifyJS, Terser 等工具压缩 JS，cssnano 压缩 CSS。
- **Gzip/Brotli 压缩**：服务端开启 Gzip 或 Brotli 压缩，通常能减小 70% 的体积。
- **Tree Shaking**：移除未使用的代码（Dead Code Elimination），依赖于 ES Module 静态分析。
- **图片优化**：
  - 使用 WebP 等新格式。
  - 压缩图片质量（TinyPNG）。
  - 响应式图片 (`srcset`, `sizes`)。

### 2.3 使用 CDN (Content Delivery Network)

将静态资源（JS, CSS, Image）部署到 CDN，利用就近原则加快资源获取速度。

### 2.4 浏览器缓存策略

- **强缓存**：`Cache-Control: max-age=31536000`, `Expires`。资源在有效期内直接从本地读取，不发请求。
- **协商缓存**：`ETag` / `If-None-Match`, `Last-Modified` / `If-Modified-Since`。向服务器询问资源是否变动，未变动则返回 304。

## 3. 渲染层优化 (Rendering Optimization)

核心思想：**加速关键渲染路径**、**减少重排重绘**。

### 3.1 关键渲染路径 (Critical Rendering Path)

- **CSS 放头部**：CSSOM 构建会阻塞渲染，应尽快加载。
- **JS 放底部或使用 defer/async**：JS 执行会阻塞 DOM 构建。
  ```html
  <!-- defer: 异步加载，HTML 解析完后执行，顺序执行 -->
  <script src="script.js" defer></script>
  <!-- async: 异步加载，加载完立即执行，执行顺序不确定 -->
  <script src="analytics.js" async></script>
  ```

### 3.2 减少回流 (Reflow) 和重绘 (Repaint)

- **回流 (Reflow)**：布局或几何属性改变（width, height, display 等），浏览器需要重新计算布局。开销大。
- **重绘 (Repaint)**：外观属性改变（color, background 等），不影响布局。开销较小。
- **优化策略**：
  - 避免频繁操作 DOM，使用 `DocumentFragment` 批量插入。
  - 使用 `transform` 和 `opacity` 做动画，这些属性会触发 GPU 加速，不会触发回流。
  - 读写分离：避免在循环中连续读写 DOM 属性（导致强制同步布局）。

### 3.3 图片懒加载 (Lazy Loading)

对于非首屏图片，推迟加载，直到滚动到视口附近。

```html
<!-- 原生支持 -->
<img src="image.jpg" loading="lazy" alt="Lazily loaded image" />
```

或者使用 `IntersectionObserver` API 实现。

## 4. 代码层面优化 (Code Optimization)

### 4.1 路由懒加载

在 Vue/React 中，使用动态 import 将路由组件分割成单独的代码块，按需加载。

**Vue Router:**

```javascript
const routes = [
  {
    path: "/about",
    component: () => import("./views/About.vue"),
  },
];
```

**React:**

```javascript
const About = React.lazy(() => import("./About"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <About />
    </Suspense>
  );
}
```

### 4.2 防抖 (Debounce) 与节流 (Throttle)

限制高频事件（resize, scroll, input）的触发频率。

- **防抖**：动作停止后延迟执行（如搜索框输入）。
- **节流**：固定时间间隔执行一次（如滚动监听）。

### 4.3 虚拟列表 (Virtual List)

对于长列表（成百上千条数据），只渲染视口可见区域的 DOM，大幅减少 DOM 节点数量。

## 5. 构建与打包优化 (Build Optimization)

以 Webpack/Vite 为例：

- **Code Splitting**：提取公共代码（Vendor Chunk）。
- **预加载/预获取**：
  - `<link rel="preload">`: 高优先级加载当前页急需资源。
  - `<link rel="prefetch">`: 空闲时加载未来可能用到的资源。

## 6. 性能分析工具

- **Chrome DevTools**:
  - **Network**: 查看资源加载耗时、Waterfall。
  - **Performance**: 录制页面运行情况，分析主线程任务、火焰图。
  - **Lighthouse**: 自动化评分并给出优化建议。
- **Webpack Bundle Analyzer**: 可视化分析打包后的文件体积，找出大文件。
