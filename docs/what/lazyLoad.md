# 懒加载 (Lazy Loading) 详解

**懒加载 (Lazy Loading)**，也称为按需加载，是一种优化网页或应用性能的技术。它的核心思想是：**推迟加载非关键资源，直到真正需要它们的时候才加载**。

## 1. 什么是懒加载？

在传统的网页加载中，浏览器会一次性请求并下载页面上的所有资源（图片、脚本、样式表等），即使用户可能根本不会滚动到页面的底部查看这些内容。

懒加载则改变了这一行为：它只加载用户当前视口（Viewport）可见的资源。当用户滚动页面，新的内容进入视口即将被看到时，浏览器才去请求这些资源。

## 2. 为什么需要懒加载？（有什么用）

懒加载主要带来以下显著优势：

1. **提升首屏加载速度 (FCP/LCP)**：
   减少了首屏需要下载的资源数量和体积，浏览器可以更快地渲染出用户可见的内容。
2. **节省带宽和流量**：
   对于用户未浏览到的内容，永远不会消耗用户的流量。这对于移动端用户尤为重要。
3. **减轻服务器压力**：
   服务器不需要为每次访问都传输所有资源，降低了并发压力和带宽成本。
4. **优化用户体验**：
   页面响应更快，交互更流畅，减少了“白屏”等待时间。

## 3. 适用场景

懒加载广泛应用于各种资源密集型的场景：

1. **图片懒加载**：
   电商商品列表、长图文文章、图片画廊。这是最常见的应用场景。
2. **路由/组件懒加载**：
   单页应用 (SPA) 中，只有当用户访问某个路由（如 `/about`）时，才加载对应的 JS 代码块。
3. **无限滚动长列表**：
   社交媒体的信息流（Feed），滚动到底部时加载更多数据和 DOM 节点。
4. **第三方库懒加载**：
   体积较大的图表库 (ECharts)、地图 SDK、富文本编辑器等，只有在特定组件显示时才动态导入。

## 4. 实现方案

### 4.1 图片懒加载

#### 方案一：原生 HTML 属性 (推荐)

现代浏览器原生支持 `loading="lazy"` 属性，无需任何 JS。

```html
<img src="image.jpg" loading="lazy" alt="Description" />
```

#### 方案二：Intersection Observer API (通用)

使用 JS 监听元素是否进入视口，性能比传统的 `scroll` 事件监听好得多。

```html
<img
  data-src="image.jpg"
  class="lazy-img"
  src="placeholder.jpg"
  alt="Description"
/>
```

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // 替换真实图片地址
      observer.unobserve(img); // 停止观察
    }
  });
});

document.querySelectorAll(".lazy-img").forEach((img) => {
  observer.observe(img);
});
```

### 4.2 路由懒加载 (SPA)

#### Vue 3 + Vue Router

利用动态 `import()` 语法。

```javascript
const routes = [
  {
    path: "/about",
    name: "About",
    // 只有访问 /about 时才会加载这个组件代码
    component: () => import("../views/About.vue"),
  },
];
```

#### React + React.lazy

```javascript
import React, { Suspense } from "react";

const OtherComponent = React.lazy(() => import("./OtherComponent"));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

### 4.3 列表懒加载 (虚拟列表)

对于成千上万条数据的长列表，仅仅“延迟加载数据”是不够的，DOM 节点过多会导致页面卡顿。此时通常配合 **虚拟列表 (Virtual List)** 技术，只渲染视口内的 DOM 节点。

## 5. 注意事项

- **首屏图片不要懒加载**：首屏可见区域的图片（LCP 元素）应该立即加载，否则会延迟 LCP 时间，影响体验和 SEO。
- **占位图 (Placeholder)**：在图片加载前显示占位图或骨架屏，防止页面布局抖动 (CLS)。
- **SEO 影响**：虽然现代爬虫（如 Googlebot）能执行 JS，但为了保险起见，核心内容最好不要过度依赖懒加载，或者确保有 `<noscript>` 兜底。
