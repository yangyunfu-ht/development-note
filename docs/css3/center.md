# CSS 水平垂直居中方案汇总

在 CSS 中，实现元素的水平垂直居中是一个非常常见的需求。随着 CSS 规范的发展，我们有了越来越多的方法来实现这一效果。

## 1. 水平居中

### 1.1 行内元素 (Inline Elements)

如果子元素是行内元素（如 `span`, `img`, `a`）或文本，可以在父元素上设置 `text-align: center`。

```css
.parent {
  text-align: center;
}
```

### 1.2 块级元素 (Block Elements)

如果子元素是定宽的块级元素，可以使用 `margin: 0 auto`。

```css
.child {
  width: 200px;
  margin: 0 auto;
}
```

## 2. 垂直居中

### 2.1 单行文本

设置 `line-height` 等于父元素的高度。

```css
.parent {
  height: 50px;
  line-height: 50px;
}
```

### 2.2 Table-Cell 布局

利用表格布局的特性，设置 `vertical-align: middle`。

```css
.parent {
  display: table-cell;
  vertical-align: middle;
}
```

## 3. 水平垂直居中 (核心)

### 3.1 Flex 布局 (推荐)

最现代、最简单、副作用最小的方法。

```css
.parent {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
```

### 3.2 Grid 布局 (最简洁)

比 Flex 更简洁，只需要两行代码。

```css
.parent {
  display: grid;
  place-items: center;
}
```

### 3.3 绝对定位 + transform (未知宽高)

适用于子元素宽高未知的情况。利用 `translate` 百分比是相对于自身宽高的特性。

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 3.4 绝对定位 + margin auto (已知宽高)

如果子元素宽高已知，可以设置 `top/bottom/left/right` 为 0，然后配合 `margin: auto`。

```css
.parent {
  position: relative;
}
.child {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

### 3.5 绝对定位 + 负 margin (已知宽高)

早期常用方法，需要计算宽的一半。

```css
.parent {
  position: relative;
}
.child {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -50px; /* 宽度的一半 */
  margin-top: -50px; /* 高度的一半 */
}
```

## 总结

| 方法            | 适用场景           | 优点                             | 缺点                        |
| :-------------- | :----------------- | :------------------------------- | :-------------------------- |
| **Flex**        | 现代浏览器，移动端 | 简单直观，代码少                 | IE 支持有限                 |
| **Grid**        | 现代浏览器         | 代码最少 (`place-items: center`) | 兼容性稍逊于 Flex           |
| **Transform**   | 宽高未知           | 兼容性较好，不脱离文档流         | 可能影响其他 transform 属性 |
| **Margin Auto** | 宽高已知           | 兼容性极好                       | 必须定宽定高                |
| **负 Margin**   | 宽高已知           | 兼容性极好 (IE6+)                | 必须计算宽高，维护麻烦      |
