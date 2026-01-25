# SPA 首屏优化 (FCP)

FCP (First Contentful Paint) 即**首次内容绘制**，标志着浏览器从响应用户输入网络地址，到页面首次在屏幕上渲染内容（文本、图片、SVG 等）的时间点。对于 SPA（单页面应用）而言，由于需要等待 JavaScript 包下载并执行后才能渲染，首屏优化尤为重要。

本文将分别介绍在 **Vite** 和 **Webpack** 项目中如何进行首屏优化。

## 1. 通用优化策略

无论使用哪种构建工具，以下策略都是适用的：

### 1.1 路由懒加载 (Code Splitting)

不要一次性加载所有页面的代码，而是根据路由按需加载。

- **Vue**:

  ```javascript
  const Home = () => import("./views/Home.vue");
  const routes = [{ path: "/", component: Home }];
  ```

- **React**:

  ```javascript
  const Home = React.lazy(() => import("./Home"));
  ```

### 1.2 静态资源 CDN 加速

将第三方库（如 Vue, React, ECharts）和静态资源（图片、字体）部署到 CDN，减少服务器带宽压力，利用 CDN 的边缘节点加速。

### 1.3 开启 HTTP/2

HTTP/2 支持多路复用，可以并行传输多个文件，极大提升了加载大量小文件的速度。

### 1.4 骨架屏 (Skeleton Screen)

在 JS 执行完成前，先展示一个 HTML 结构的骨架屏，减少用户的白屏感知时间。

### 1.5 资源预加载策略 (Resource Hints)

利用浏览器提供的 Resource Hints，我们可以告诉浏览器哪些资源是重要的，需要提前加载。

- **Preload (`<link rel="preload">`)**:
  - **作用**: 告诉浏览器这个资源是**当前页面**高优先级需要的，应该立即下载，但暂时不执行。
  - **场景**: 关键 CSS、首屏大图 (LCP 优化关键)、字体文件、核心 JS 脚本。
  - **示例**:

    ```html
    <!-- 预加载首屏大图 -->
    <link rel="preload" href="hero-image.jpg" as="image" />
    <!-- 预加载字体 (注意必须加 crossorigin) -->
    <link
      rel="preload"
      href="/fonts/main.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    ```

- **Prefetch (`<link rel="prefetch">`)**:
  - **作用**: 告诉浏览器这个资源**未来页面**（如下一页）可能需要，在浏览器空闲时下载。
  - **场景**: 路由懒加载的 JS chunk（如用户可能点击的详情页代码）。

- **Preconnect (`<link rel="preconnect">`)**:
  - **作用**: 提前与第三方域名建立连接（DNS 解析 + TCP 握手 + TLS 协商）。
  - **场景**: CDN 域名、API 域名。
  - **示例**:

    ```html
    <link rel="preconnect" href="https://cdn.example.com" />
    <link rel="dns-prefetch" href="https://cdn.example.com" />
    <!-- 降级兼容 -->
    ```

---

## 2. Vite 项目优化 (Rollup)

Vite 生产环境使用 Rollup 打包，优化主要围绕 Rollup 配置进行。

### 2.1 拆分 vendor (Manual Chunks)

将 `node_modules` 中的第三方依赖拆分为独立的 chunk，利用浏览器缓存。

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 将所有 node_modules 打包到一个 vendor 中
            // return 'vendor';

            // 或者更细粒度的拆分
            if (id.includes("lodash")) return "lodash";
            if (id.includes("vue")) return "vue";
          }
        },
      },
    },
  },
});
```

### 2.2 开启 Gzip/Brotli 压缩

使用 `vite-plugin-compression` 在构建时生成压缩文件。

```bash
pnpm add vite-plugin-compression -D
```

```typescript
// vite.config.ts
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // 大于 10kb 的文件才压缩
      algorithm: "gzip", // 或 'brotliCompress'
      ext: ".gz",
    }),
  ],
});
```

_注意：需 Nginx 配置 `gzip_static on` 支持。_

### 2.3 图片压缩

使用 `vite-plugin-imagemin` 压缩图片资源。

```bash
pnpm add vite-plugin-imagemin -D
```

### 2.4 预加载关键资源

Vite 默认会自动为入口 chunk 及其直接依赖生成 `<link rel="modulepreload">`，这确保了 JS 模块能够被并行加载，避免了深层导入导致的串行加载瀑布流。

**手动预加载非 JS 资源**：
对于字体、首屏 LCP 图片等资源，Vite 不会自动预加载。你需要手动在 `index.html` 中配置，或者使用 `vite-plugin-html` 插件注入。

```html
<!-- index.html -->
<head>
  <!-- 预加载字体，防止字体闪烁 (FOUT) -->
  <link
    rel="preload"
    href="/assets/font.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />

  <!-- 预加载 LCP 图片 (如 Banner 图) -->
  <link rel="preload" href="/assets/hero.png" as="image" />
</head>
```

---

## 3. Webpack 项目优化

### 3.1 SplitChunksPlugin (分包)

Webpack 4+ 内置了 SplitChunksPlugin，用于提取公共代码。

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all", // 对同步和异步代码都进行分割
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: -10, // 优先级
        },
        common: {
          minChunks: 2, // 被引用 2 次以上提取
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

### 3.2 Externals (外部扩展)

将体积巨大的第三方库（如 ECharts, React, Vue）从 bundle 中剥离，改用 CDN 引入。

```javascript
// webpack.config.js
module.exports = {
  externals: {
    vue: "Vue",
    "vue-router": "VueRouter",
    axios: "axios",
  },
};
```

_需要在 `index.html` 中手动引入对应的 CDN script 标签。_

### 3.3 Tree Shaking

确保使用 ES6 模块语法 (`import`/`export`)，并在 `package.json` 中标记 `"sideEffects": false` (如果有副作用的文件需排除)，Webpack 生产模式会自动移除未使用的代码。

### 3.4 Gzip 压缩

使用 `compression-webpack-plugin`。

```javascript
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  plugins: [
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
};
```

### 3.5 提取 CSS

使用 `MiniCssExtractPlugin` 将 CSS 提取为独立文件，利用浏览器并行下载能力，避免 JS 阻塞渲染。

### 3.6 资源预加载插件

使用 `preload-webpack-plugin` (或 `@vue/preload-webpack-plugin`) 自动注入 `<link rel="preload">` 和 `<link rel="prefetch">`。

```javascript
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

module.exports = {
  plugins: [
    new PreloadWebpackPlugin({
      rel: "preload",
      include: "initial", // 预加载初始 chunk
      fileBlacklist: [/\.map$/, /hot-update\.js$/],
    }),
    new PreloadWebpackPlugin({
      rel: "prefetch",
      include: "asyncChunks", // 预取异步 chunk
    }),
  ],
};
```

---

## 4. 分析工具

在优化前，先用工具分析包体积，找出瓶颈。

- **Vite (Rollup)**: `rollup-plugin-visualizer`

  ```bash
  pnpm add rollup-plugin-visualizer -D
  ```

  ```typescript
  import { visualizer } from "rollup-plugin-visualizer";
  // plugins: [visualizer({ open: true })]
  ```

- **Webpack**: `webpack-bundle-analyzer`

  ```bash
  pnpm add webpack-bundle-analyzer -D
  ```

  ```javascript
  const BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
  // plugins: [new BundleAnalyzerPlugin()]
  ```

---

## 5. 总结：资源预加载最佳实践清单

为了最大化首屏加载速度，请遵循以下资源预加载原则：

1. **字体必预加载 (`preload`)**:
    字体文件通常在 CSS 解析后才被发现，容易导致文字闪烁或不可见。使用 `preload` 提前加载字体是提升体验的低成本高收益手段。
    - _注意_: 字体预加载必须带 `crossorigin` 属性。

2. **LCP 图片预加载 (`preload`)**:
    如果首屏最大的内容元素（LCP）是图片（如 Banner 图），务必对其进行 `preload`。这能显著降低 LCP 时间。

3. **CDN 预连接 (`preconnect`)**:
    对于存放静态资源的 CDN 域名，使用 `preconnect` 提前建立连接（DNS+TCP+TLS），减少后续请求的延迟。

4. **按需预取 (`prefetch`)**:
    对于用户下一步**极可能**访问的路由（如登录页跳转到首页，或列表页跳转到详情页），利用 `prefetch` 在浏览器空闲时加载对应资源。

5. **避免过度预加载**:
    `preload` 会占用首屏加载的带宽。只对**首屏关键路径**上必然会用到的资源使用 `preload`。其他资源交给浏览器自动调度或使用 `prefetch`。
