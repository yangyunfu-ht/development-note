# 移动端适配方案详解

随着移动设备的普及，移动端适配成为前端开发中的必备技能。本文将详细介绍移动端适配的核心概念、主流方案以及常见问题的解决方法。

## 1. 核心概念

### 1.1 Viewport (视口)

移动端适配的基础是 `viewport`。如果不设置 viewport，移动浏览器会默认在一个较宽的虚拟视口（通常是 980px）中渲染页面，导致页面被缩放得很小。

标准的 Viewport 设置：

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

- `width=device-width`: 视口宽度等于设备屏幕宽度。
- `initial-scale=1.0`: 初始缩放比例为 1.0。
- `user-scalable=no`: 禁止用户缩放（视需求而定，为了无障碍访问有时建议允许缩放）。

### 1.2 物理像素 vs 逻辑像素

- **物理像素 (Physical Pixels)**: 设备屏幕实际拥有的像素点。
- **逻辑像素 (Logical Pixels / CSS Pixels)**: CSS 中使用的 `px`。
- **设备像素比 (DPR - Device Pixel Ratio)**: `物理像素 / 逻辑像素`。
  - 例如 iPhone 的 Retina 屏幕 DPR 通常为 2 或 3。这意味着 1px 的 CSS 像素由 2x2 或 3x3 个物理像素点渲染，从而显示更清晰。

---

## 2. 主流适配方案

### 2.1 方案一：Rem 适配 (amfe-flexible)

**原理**：
`rem` 是相对于根元素 (`html`) `font-size` 的单位。通过 JavaScript 动态计算屏幕宽度，并将 `html` 的 `font-size` 设置为屏幕宽度的 1/10（或其他比例），从而实现页面元素随屏幕宽度等比缩放。

**工具链**：

- `amfe-flexible` (JS 库，用于动态设置根字体大小)
- `postcss-pxtorem` (PostCSS 插件，自动将 px 转为 rem)

**实现步骤**：

1. **安装依赖**：

    ```bash
    npm i amfe-flexible
    npm i postcss-pxtorem -D
    ```

2. **引入 JS** (在 `main.js` 或入口文件)：

    ```javascript
    import "amfe-flexible";
    ```

3. **配置 PostCSS** (`postcss.config.js`)：

    ```javascript
    module.exports = {
      plugins: {
        "postcss-pxtorem": {
          rootValue: 37.5, // 设计稿宽度的 1/10，例如设计稿 375px 则为 37.5
          propList: ["*"], // 需要转换的属性，* 代表全部
        },
      },
    };
    ```

**优点**：兼容性好（支持旧版安卓/iOS）。
**缺点**：需要引入 JS，有一定的计算开销；在某些机型上可能存在小数点精度导致的 1px 偏差。

### 2.2 方案二：Viewport 适配 (vw/vh) —— **推荐**

**原理**：
`vw` (viewport width) 和 `vh` (viewport height) 是 CSS 原生单位。`1vw` 等于视口宽度的 1%。直接使用 `vw` 单位可以让元素随视口宽度缩放。

**工具链**：

- `postcss-px-to-viewport` (PostCSS 插件，自动将 px 转为 vw)

**实现步骤**：

1. **安装依赖**：

    ```bash
    npm i postcss-px-to-viewport -D
    ```

2. **配置 PostCSS** (`postcss.config.js`)：

    ```javascript
    module.exports = {
      plugins: {
        "postcss-px-to-viewport": {
          viewportWidth: 375, // 设计稿宽度
          unitPrecision: 5, // 指定 `px` 转换为视窗单位值的小数位数
          viewportUnit: "vw", // 指定需要转换成的视窗单位
          selectorBlackList: [".ignore", ".hairlines"], // 指定不转换为视窗单位的类
          minPixelValue: 1, // 小于或等于 1px 不转换
          mediaQuery: false, // 允许在媒体查询中转换 `px`
        },
      },
    };
    ```

**优点**：

- 纯 CSS 方案，无 JS 依赖，性能更好。
- 适配更加精准。
  **缺点**：
- 兼容性略低于 rem（不支持极老旧设备，但目前主流设备均已支持）。

### 2.3 方案三：弹性布局 (Flex) + 百分比

对于一些不需要严格等比缩放的场景（如新闻列表、卡片流），通常结合 Flex 布局和百分比来实现。固定高度，宽度自适应。

---

## 3. 常见问题处理

### 3.1 1px 边框问题

在 Retina 屏幕（DPR >= 2）下，CSS 的 `1px` 实际上由 2 个或更多物理像素渲染，看起来会比较粗。

**解决方案**：使用伪元素 + `transform: scale()`。

```css
.border-1px {
  position: relative;
}

.border-1px::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: #ccc;
  transform: scaleY(0.5); /* DPR 为 2 时缩放 0.5 */
  transform-origin: 0 0;
}
```

### 3.2 图片适配 (响应式图片)

为了在不同 DPR 的屏幕上显示清晰的图片，可以使用 `@2x`, `@3x` 图。

**CSS 方式**：

```css
.bg {
  background-image: url(image@1x.png);
}

@media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
  .bg {
    background-image: url(image@2x.png);
  }
}
```

**HTML 方式** (`srcset`)：

```html
<img
  src="image-1x.jpg"
  srcset="image-2x.jpg 2x, image-3x.jpg 3x"
  alt="Responsive Image"
/>
```

### 3.3 iPhone X+ 安全区域 (Safe Area)

全面屏手机底部有操作条，顶部有刘海。内容不应被这些区域遮挡。

**解决方案**：使用 `viewport-fit=cover` 和 CSS `env()` 函数。

1. **设置 Meta**：

    ```html
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, viewport-fit=cover"
    />
    ```

2. **CSS 适配**：

    ```css
    body {
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
    }
    ```

## 4. 总结

| 方案              | 核心技术           | 适用场景                      | 推荐指数   |
| :---------------- | :----------------- | :---------------------------- | :--------- |
| **Viewport (vw)** | PostCSS 转 vw      | 新项目，对还原度要求高        | ⭐⭐⭐⭐⭐ |
| **Rem**           | flexible + PostCSS | 兼容性要求极高的旧项目        | ⭐⭐⭐⭐   |
| **Flex + %**      | Flexbox            | 布局简单，无需严格等比缩放    | ⭐⭐⭐     |
| **Media Query**   | @media             | 响应式官网 (PC + Mobile 一套) | ⭐⭐⭐     |

目前 **vw 方案** 已成为主流，配置简单且性能更佳。
