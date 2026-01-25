# CSS 盒模型 (Box Model)

CSS 盒模型是 Web 布局的核心机制。浏览器将页面中的每个元素都看作一个矩形的盒子，这个盒子由四个部分组成：**内容 (Content)**、**内边距 (Padding)**、**边框 (Border)** 和 **外边距 (Margin)**。

## 1. 盒模型的组成

一个盒子从内到外分别是：

1.  **Content (内容区域)**: 显示文本、图像等内容的区域。宽高由 `width` 和 `height` 属性设置。
2.  **Padding (内边距)**: 内容区域周围的透明区域。
3.  **Border (边框)**: 围绕在内边距和内容外的边框。
4.  **Margin (外边距)**: 盒子最外层的透明区域，用来隔开其他元素。

<!-- ![Box Model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/box_model.png) -->

## 2. 两种盒模型

在 CSS 中，存在两种不同的盒模型计算方式，可以通过 `box-sizing` 属性来切换。这也是面试中常考的知识点。

### 2.1 标准盒模型 (Standard Box Model)

- **属性**: `box-sizing: content-box` (默认值)
- **宽高的计算**:
  - 设置的 `width` 和 `height` **只包含 Content**。
  - **实际占用宽度** = `width` + `padding` + `border` + `margin`
  - **实际可视宽度** = `width` + `padding` + `border`

```css
.box {
  box-sizing: content-box;
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 5px solid black;
  margin: 20px;
}
```

> **计算结果**:
>
> - 内容宽度: 100px
> - 盒子可视宽度: 100 + 10*2 + 5*2 = **130px**
> - 盒子占据空间: 130 + 20\*2 = **170px**

### 2.2 IE 盒模型 / 怪异盒模型 (Alternative Box Model)

- **属性**: `box-sizing: border-box`
- **宽高的计算**:
  - 设置的 `width` 和 `height` **包含了 Content + Padding + Border**。
  - **实际占用宽度** = `width` + `margin`
  - **实际可视宽度** = `width`

这通常被认为是**更直观、更好用**的盒模型，因为你设置的宽度就是盒子最终显示的宽度，不会因为加了 padding 或 border 而撑破布局。

```css
.box {
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 5px solid black;
  margin: 20px;
}
```

> **计算结果**:
>
> - 盒子可视宽度: **100px** (就是设置的 width)
> - 内容宽度: 100 - 10*2 - 5*2 = **70px** (浏览器自动计算剩余给内容的空间)
> - 盒子占据空间: 100 + 20\*2 = **140px**

## 3. 最佳实践

在现代 Web 开发中，为了便于布局计算，通常会全局重置 `box-sizing` 为 `border-box`。

```css
/* 全局设置 */
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

## 4. 常见问题：Margin 塌陷与合并

虽然不完全属于盒模型定义的范畴，但 Margin 的行为经常与盒模型一起讨论。

- **外边距合并 (Margin Collapsing)**: 垂直方向上，两个相邻元素的 margin 会发生合并，取较大值，而不是相加。
- **外边距塌陷**: 父元素的第一个子元素的 `margin-top` 可能会“穿透”父元素，变成父元素的 `margin-top`。可以通过设置父元素 `overflow: hidden` 或添加 `border`/`padding` 来解决（即触发 BFC）。
