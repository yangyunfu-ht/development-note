# CSS Flex 布局详解

Flexbox（弹性盒子）是 CSS3 引入的一种新的布局模式，旨在提供一种更有效的方式来布置、对齐和分配容器中项目之间的空间，即使它们的大小未知或动态变化。

## 1. 核心概念

Flex 布局采用 **主轴 (Main Axis)** 和 **交叉轴 (Cross Axis)** 的概念。

- **容器 (Flex Container)**: 设置了 `display: flex` 或 `display: inline-flex` 的元素。
- **项目 (Flex Item)**: 容器的直接子元素。

## 2. 容器属性 (Flex Container)

### 2.1 flex-direction

决定主轴的方向（即项目的排列方向）。

```css
.container {
  flex-direction: row; /* 默认值，水平从左到右 */
  flex-direction: row-reverse; /* 水平从右到左 */
  flex-direction: column; /* 垂直从上到下 */
  flex-direction: column-reverse; /* 垂直从下到上 */
}
```

### 2.2 flex-wrap

定义如果一条轴线排不下，如何换行。

```css
.container {
  flex-wrap: nowrap; /* 默认值，不换行 */
  flex-wrap: wrap; /* 换行，第一行在上方 */
  flex-wrap: wrap-reverse; /* 换行，第一行在下方 */
}
```

### 2.3 justify-content

定义项目在**主轴**上的对齐方式。

```css
.container {
  justify-content: flex-start; /* 默认值，左对齐 */
  justify-content: flex-end; /* 右对齐 */
  justify-content: center; /* 居中 */
  justify-content: space-between; /* 两端对齐，项目之间的间隔都相等 */
  justify-content: space-around; /* 每个项目两侧的间隔相等 */
  justify-content: space-evenly; /* 每个项目之间及两端的间隔都相等 */
}
```

### 2.4 align-items

定义项目在**交叉轴**上如何对齐（针对单行）。

```css
.container {
  align-items: stretch; /* 默认值，如果项目未设置高度或设为auto，将占满整个容器的高度 */
  align-items: flex-start; /* 交叉轴的起点对齐 */
  align-items: flex-end; /* 交叉轴的终点对齐 */
  align-items: center; /* 交叉轴的中点对齐 */
  align-items: baseline; /* 项目的第一行文字的基线对齐 */
}
```

### 2.5 align-content

定义多根轴线（多行）的对齐方式。如果项目只有一根轴线，该属性不起作用。

```css
.container {
  align-content: flex-start;
  align-content: flex-end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
  align-content: stretch;
}
```

## 3. 项目属性 (Flex Item)

### 3.1 order

定义项目的排列顺序。数值越小，排列越靠前，默认为 0。

```css
.item {
  order: 1;
}
```

### 3.2 flex-grow

定义项目的放大比例。默认为 0，即如果存在剩余空间，也不放大。

```css
.item {
  flex-grow: 1; /* 如果所有项目的 flex-grow 都为 1，则它们将等分剩余空间 */
}
```

### 3.3 flex-shrink

定义项目的缩小比例。默认为 1，即如果空间不足，该项目将缩小。

```css
.item {
  flex-shrink: 0; /* 空间不足时，该项目不缩小 */
}
```

### 3.4 flex-basis

定义在分配多余空间之前，项目占据的主轴空间（main size）。默认为 `auto`，即项目的本来大小。

```css
.item {
  flex-basis: 100px; /* 项目固定占据 100px */
}
```

### 3.5 flex (简写)

是 `flex-grow`, `flex-shrink` 和 `flex-basis` 的简写，默认值为 `0 1 auto`。建议优先使用这个属性。

```css
.item {
  flex: none; /* 等同于 0 0 auto */
  flex: auto; /* 等同于 1 1 auto */
  flex: 1; /* 等同于 1 1 0% */
}
```

## 4. flex: 1 和 flex: auto 的区别

这是一个高频面试题，也是实际开发中容易混淆的点。

### 4.1 属性展开对比

- **`flex: 1`**
  - 等同于 `flex-grow: 1; flex-shrink: 1; flex-basis: 0%;`
  - 关键点是 `flex-basis: 0%`。这意味着在计算剩余空间时，**忽略项目本身的内容大小**，认为项目的基础大小为 0。
  - **效果**: 所有设置了 `flex: 1` 的项目将**绝对均分**容器的剩余空间（如果它们原本没有固定宽度的话，最终宽度会相等）。

- **`flex: auto`**
  - 等同于 `flex-grow: 1; flex-shrink: 1; flex-basis: auto;`
  - 关键点是 `flex-basis: auto`。这意味着在计算剩余空间时，**会考虑项目本身的内容大小**。
  - **效果**: 项目会根据其**内容大小**来分配空间。内容多的项目最终会占据更多的宽度，内容少的占据较少，但它们都会尝试填满容器。

### 4.2 示例演示

假设有一个 Flex 容器，宽度足够大，包含两个项目：Item A（内容很少）和 Item B（内容很多）。

```html
<div style="display: flex;">
  <div class="item-a">A</div>
  <div class="item-b">BBBBBBBBBBBB</div>
</div>
```

- **场景 1: 使用 `flex: 1`**

  ```css
  .item-a,
  .item-b {
    flex: 1;
  }
  ```

  **结果**: Item A 和 Item B 的宽度**完全相等**。
  因为 `flex-basis: 0%`，浏览器认为它们起始大小都是 0，然后把所有空间按 1:1 分配给它们。

- **场景 2: 使用 `flex: auto`**
  ```css
  .item-a,
  .item-b {
    flex: auto;
  }
  ```
  **结果**: Item B 的宽度会**大于** Item A。
  因为 `flex-basis: auto`，浏览器先减去它们原本的内容宽度，然后再把**剩余的**空白空间按 1:1 分配。由于 Item B 原本就宽，加上分配的空间后，依然比 Item A 宽。

### 4.3 总结建议

- 如果你希望项目**无视内容差异，均分空间**（常用于导航栏、等宽布局），请使用 `flex: 1`。
- 如果你希望项目**基于内容大小自适应填充**（内容多的占多点，内容少的占少点），请使用 `flex: auto`。
