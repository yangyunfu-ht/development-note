# BFC 详解

## 什么是 BFC

**BFC** 全称是 **Block Formatting Context**，即**块级格式化上下文**。它是 CSS2.1 规范定义的，属于 Web 页面 CSS 视觉渲染的一部分。

简单来说，BFC 是一个独立的布局环境，其中的元素布局是不受外界影响的，并且在一个 BFC 中，块盒与行盒（行内盒）都会垂直的沿着其父元素的边框排列。

可以将 BFC 理解为一个封闭的大箱子，箱子内部的元素无论如何翻江倒海，都不会影响到箱子外面的元素，反之亦然。

## 如何触发 BFC

只要元素满足下面任一条件，就会触发 BFC：

1.  **根元素**：`<html>` 元素。
2.  **浮动元素**：`float` 的值不是 `none`。
3.  **绝对定位元素**：`position` 的值是 `absolute` 或 `fixed`。
4.  **行内块元素**：`display` 的值是 `inline-block`。
5.  **表格单元格**：`display` 的值是 `table-cell`，HTML 表格单元格默认为该值。
6.  **表格标题**：`display` 的值是 `table-caption`，HTML 表格标题默认为该值。
7.  **`overflow` 不为 `visible`**：`overflow` 的值是 `hidden`、`auto` 或 `scroll`。
8.  **弹性盒子**：`display` 的值是 `flex` 或 `inline-flex` 的元素的直接子元素（Flex Item）。
9.  **网格布局**：`display` 的值是 `grid` 或 `inline-grid` 的元素的直接子元素（Grid Item）。
10. **`display: flow-root`**：这是 CSS3 新增的属性，专门用于无副作用地创建 BFC。

## BFC 的布局规则（特性）

1.  **内部的 Box 会在垂直方向，一个接一个地放置**。
2.  **Box 垂直方向的距离由 margin 决定**。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠。
3.  **每个元素的 margin box 的左边， 与包含块 border box 的左边相接触**（对于从左往右的格式化，否则相反）。即使存在浮动也是如此。
4.  **BFC 的区域不会与 float box 重叠**。
5.  **BFC 就是页面上的一个隔离的独立容器**，容器里面的子元素不会影响到外面的元素。
6.  **计算 BFC 的高度时，浮动元素也参与计算**。

## BFC 的常见作用与使用场景

### 1. 解决高度塌陷（清除浮动）

**问题**：当父元素没有设置高度，而子元素全部浮动时，父元素的高度会塌陷为 0，导致背景色无法显示或下方元素上移。

**原理**：利用 BFC 规则 **“计算 BFC 的高度时，浮动元素也参与计算”**。

**解决方案**：给父元素触发 BFC。

```css
.parent {
  /* 触发 BFC 的几种方式 */
  overflow: hidden; /* 常用，但可能裁剪内容 */
  /* 或者 */
  display: flow-root; /* 最佳实践，无副作用 */
}
```

### 2. 避免外边距重叠 (Margin Collapse)

**问题**：在同一个 BFC 中，两个相邻的块级元素在垂直方向上的 margin 会发生重叠（取最大值），而不是相加。

**原理**：利用 BFC 规则 **“BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素”**。如果不希望 margin 重叠，可以将其中一个元素包裹在新的 BFC 容器中。

**解决方案**：

```html
<div class="box1">Margin Bottom 20px</div>

<!-- 创建一个 BFC 容器包裹 box2 -->
<div style="overflow: hidden;">
  <div class="box2">Margin Top 20px</div>
</div>
```

这样，`box1` 和 `box2` 就不在同一个 BFC 中了，margin 就不会重叠。

### 3. 自适应两栏布局

**问题**：实现左侧宽度固定，右侧宽度自适应的布局。通常如果左侧浮动，右侧只是普通 div，右侧文字会环绕左侧浮动元素。

**原理**：利用 BFC 规则 **“BFC 的区域不会与 float box 重叠”**。

**解决方案**：

```html
<style>
  .left {
    width: 200px;
    height: 300px;
    float: left;
    background: red;
  }
  .right {
    /* 触发 BFC，使其不与浮动元素重叠 */
    overflow: hidden;
    /* 或者 display: flow-root; */
    height: 300px;
    background: blue;
  }
</style>

<div class="left">Left (Float)</div>
<div class="right">Right (BFC)</div>
```

此时，`.right` 会自动适应剩余宽度，并且不会与 `.left` 重叠。

## 总结

BFC 是 CSS 布局中非常重要的概念，虽然它听起来很抽象，但我们在实际开发中经常用到它（比如清除浮动）。掌握 BFC 的触发条件和特性，可以帮助我们解决很多奇怪的布局问题。

推荐使用 `display: flow-root` 来创建 BFC，因为它没有副作用（不会像 `overflow: hidden` 那样可能隐藏溢出内容，也不会像 `float` 那样让元素浮动）。
