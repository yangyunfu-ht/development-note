# 浏览器兼容性解决方案 (Compatibility)

在前端开发中，浏览器兼容性问题一直是一个绕不开的话题。随着 ES6+ 新特性和 CSS3 的普及，如何让现代代码在低版本浏览器（如 IE11、旧版 Android WebView）中正常运行，是工程化需要解决的核心问题之一。

## 1. 核心问题分类

兼容性问题主要分为两类：

- **语法兼容性 (Syntax)**: 浏览器无法识别新的语法结构（如箭头函数、`class`、`const/let`）。
- **API 兼容性 (Polyfill)**: 浏览器缺少新的内置对象或方法（如 `Promise`、`Array.from`、`Map`、`Object.assign`）。
- **CSS 兼容性**: 浏览器对 CSS 属性的支持程度不同（如 Flexbox、Grid、CSS 变量），或需要特定的厂商前缀。

## 2. JS 兼容性解决方案

### 2.1 语法转换 (Transpilation)

使用 **Babel** 将 ES6+ 语法转换为 ES5 语法。

- **工具**: `@babel/preset-env`
- **配置**: 在 `.babelrc` 或构建工具配置中指定目标浏览器。

```json
// .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        },
        "useBuiltIns": "usage", // 按需引入 Polyfill
        "corejs": 3
      }
    ]
  ]
}
```

### 2.2 API 垫片 (Polyfill)

对于缺失的 API，需要引入 Polyfill 代码来模拟实现。

- **Core-js**: 最常用的标准库 Polyfill 集合。
- **Regenerator-runtime**: 用于支持 `async/await` 和 `generator` 函数。

### 2.3 动态 Polyfill (了解)

使用如 `polyfill.io` (注意：该服务已被收购，存在安全风险，**不推荐直接使用**，建议自建服务) 根据 User-Agent 动态下发所需的 Polyfill。

## 3. CSS 兼容性解决方案

### 3.1 通用核心：PostCSS 与 Autoprefixer

CSS 兼容性的核心工具是 **PostCSS** 及其插件 **Autoprefixer**。它们会根据 `package.json` 中的 `browserslist` 配置，自动为 CSS 属性添加所需的厂商前缀（如 `-webkit-`, `-moz-`, `-ms-`）。

### 3.2 Vite 项目实战

Vite 内置了对 PostCSS 的支持，我们只需要安装插件并配置即可。

### 步骤 1: 安装依赖

```bash
pnpm add -D autoprefixer
```

### 步骤 2: 配置 PostCSS

方式一：创建 `postcss.config.js` (推荐)

在项目根目录新建文件：

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {},
  },
};
```

方式二：在 `vite.config.ts` 中内联配置

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";

export default defineConfig({
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});
```

### 3.3 Webpack 项目实战

Webpack 需要显式配置 loader 链来处理 PostCSS。

### 步骤 1: 安装依赖

```bash
pnpm add -D postcss-loader autoprefixer css-loader style-loader
```

### 步骤 2: 配置 Webpack

在 `webpack.config.js` 中配置 module rules：

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
        ],
      },
    ],
  },
};
```

## 4. 统一配置中心：Browserslist

无论是 Babel 还是 PostCSS，它们都需要知道"目标浏览器是哪些"。`Browserslist` 就是这样一个统一的配置源。

推荐在 `package.json` 中配置，这样所有工具（Babel, PostCSS, ESLint 等）都能共享同一套规则。

```json
// package.json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8",
    "iOS >= 10",
    "Android >= 4.4"
  ]
}
```

### 常用查询语法

| 规则              | 含义                       |
| :---------------- | :------------------------- |
| `> 1%`            | 全球使用率大于 1% 的浏览器 |
| `last 2 versions` | 所有浏览器的最后两个版本   |
| `not dead`        | 排除已停止维护的浏览器     |
| `iOS >= 10`       | iOS Safari 版本大于等于 10 |

## 5. 最佳实践总结

1.  **统一配置**: 使用 `browserslist` 统一管理目标浏览器范围。
2.  **按需 Polyfill**: 使用 `@babel/preset-env` 的 `useBuiltIns: 'usage'` 选项，只打包代码中实际用到的 Polyfill，减少包体积。
3.  **自动化**: 利用 Vite/Webpack 的生态插件（如 `autoprefixer`）自动处理 CSS 兼容性，不要手动写前缀。
4.  **渐进增强**: 对于极低版本浏览器（如 IE），如果非必要，可以考虑提示用户升级，而不是无限增加 Polyfill 体积。

> **推荐做法**：建议将 PostCSS 配置提取到单独的 `postcss.config.js` 文件中，这样 `webpack.config.js` 中的 loader 配置只需写成 `loader: 'postcss-loader'` 即可，保持配置清洁。

### 3.4 样式重置 (Reset / Normalize)

不同浏览器对标签的默认样式处理不同，需要统一。

- **Normalize.css**: 保留有用的默认样式，修复浏览器 bug。
- **Reset CSS**: 暴力清除所有默认样式。

## 4. 工程化最佳实践

### 4.1 Browserslist

在 `package.json` 中配置 `browserslist` 字段，供 Babel、Autoprefixer 等工具共享目标浏览器范围。

```json
// package.json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead",
    "not ie 11" // 根据项目需求决定是否支持 IE11
  ]
}
```

### 4.2 Vite 解决方案 (`@vitejs/plugin-legacy`)

Vite 默认构建目标是支持原生 ESM 的现代浏览器。如果需要支持低版本浏览器（如 IE11），需要使用官方插件 `@vitejs/plugin-legacy`。

**工作原理**:

1. 构建出两套代码：
   - **Modern Bundle**: 针对现代浏览器，使用 `<script type="module">` 加载，体积小，效率高。
   - **Legacy Bundle**: 针对旧版浏览器，包含完整的 Polyfill 和语法降级代码，使用 `<script nomodule>` 加载。
2. 浏览器根据是否支持 `module` 自动选择加载哪套代码。

**安装**:

```bash
pnpm add -D @vitejs/plugin-legacy terser
```

**配置**:

```typescript
// vite.config.ts
import legacy from "@vitejs/plugin-legacy";

export default {
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"], // 指定兼容目标
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"], // 按需添加额外 Polyfill
    }),
  ],
};
```

### 4.3 Webpack 解决方案

Webpack 通常结合 `babel-loader` 和 `postcss-loader` 处理。

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
        ],
      },
    ],
  },
};
```

## 5. Browserslist 配置详解

Browserslist 是一个在不同前端工具（如 Babel, Autoprefixer, PostCSS）之间共享目标浏览器配置的工具。通过配置它，我们可以避免在每个工具中重复定义目标浏览器。

### 5.1 配置方式

主要有两种配置方式，推荐使用其中一种即可。

**方式一：在 `package.json` 中配置 (推荐)**

```json
{
  "browserslist": ["defaults", "not IE 11"]
}
```

**方式二：创建 `.browserslistrc` 配置文件**

在项目根目录新建 `.browserslistrc` 文件，每行一个查询条件：

```text
# .browserslistrc
defaults
not IE 11
```

### 5.2 常用查询语法 (Query Composition)

Browserslist 支持丰富的查询语法来精确指定目标浏览器。

- **默认集合**:
  - `defaults`: 相当于 `> 0.5%, last 2 versions, Firefox ESR, not dead`。
- **版本号**:
  - `last 2 versions`: 每个浏览器的最后两个版本。
  - `last 2 Chrome versions`: Chrome 的最后两个版本。
  - `iOS 12`: iOS Safari 12。
- **市场占有率**:
  - `> 1%`: 全球使用率大于 1% 的浏览器。
  - `> 5% in CN`: 中国使用率大于 5% 的浏览器。
- **否定与排除**:
  - `not ie <= 8`: 排除 IE 8 及以下。
  - `not dead`: 排除已停止维护的浏览器（如 IE10, BlackBerry）。
- **组合关系**:
  - `or` (默认): 满足任意一个条件即可（逗号分隔也是 or）。
  - `and`: 必须同时满足多个条件。

### 5.3 分环境配置

可以针对开发环境和生产环境设置不同的浏览器范围，以提升开发时的构建速度。

**在 `package.json` 中：**

```json
{
  "browserslist": {
    "production": ["> 0.2%", "not dead", "not op_mini all"],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### 5.4 查看支持的浏览器列表

配置完成后，可以在终端运行以下命令来查看实际匹配到的浏览器版本列表，用于验证配置是否符合预期。

```bash
npx browserslist
```

### 5.5 实战示例：混合版本支持

如果项目对不同浏览器的版本要求不同，例如需要支持较新的 Chrome (90+) 但需要兼容较旧的 Firefox (如 78 ESR)：

```text
Chrome >= 90
Firefox >= 78
```

这表示项目将支持 Chrome 90 及以上版本，以及 Firefox 78 及以上版本。

## 6. 总结

| 方案                 | 适用场景       | 优点                               | 缺点                                   |
| :------------------- | :------------- | :--------------------------------- | :------------------------------------- |
| **Babel + Core-js**  | 通用 JS 兼容   | 生态成熟，配置灵活                 | 配置较繁琐，可能导致包体积增大         |
| **PostCSS**          | CSS 兼容       | 自动化程度高                       | 仅处理语法和前缀，无法解决所有布局差异 |
| **Vite Legacy 插件** | Vue3/Vite 项目 | 开箱即用，智能分包 (Modern/Legacy) | 构建时间稍长，需要生成两套代码         |
| **Browserslist**     | 所有项目       | 统一配置源，工具链共享             | 需根据业务定期更新规则                 |
