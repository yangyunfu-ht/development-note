# CSS3 新特性一览

CSS3 是 CSS 技术的一个重大更新，引入了大量的新特性，极大地增强了网页的样式表现力和交互能力。

## 1. 选择器 (Selectors)

CSS3 增加了更多的 CSS 选择器，可以更精准地选择元素。

- **属性选择器**：`[attribute^=value]`, `[attribute$=value]`, `[attribute*=value]`
- **结构伪类**：`:nth-child(n)`, `:nth-of-type(n)`, `:first-child`, `:last-child`
- **状态伪类**：`:checked`, `:disabled`, `:enabled`
- **否定伪类**：`:not(selector)`

```css
/* 选择所有 class 属性以 "icon-" 开头的元素 */
div[class^="icon-"] {
  color: red;
}

/* 选择列表中的偶数项 */
li:nth-child(even) {
  background: #eee;
}
```

## 2. 边框与圆角 (Borders)

- **圆角 (border-radius)**：轻松创建圆角边框。
- **阴影 (box-shadow)**：给元素添加阴影效果。
- **边框图片 (border-image)**：使用图片作为边框。

```css
.box {
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
}
```

## 3. 背景 (Backgrounds)

- **background-size**：规定背景图片的尺寸（`cover`, `contain`）。
- **background-origin**：规定背景图片的定位区域。
- **多重背景**：允许为一个元素设置多个背景图像。

```css
.bg {
  background-image: url(img1.png), url(img2.png);
  background-size: cover;
}
```

## 4. 渐变 (Gradients)

CSS3 可以在两个或多个指定的颜色之间显示平稳的过渡，不再需要图像来实现渐变。

- **线性渐变 (Linear Gradients)**：向下/向上/向左/向右/对角方向。
- **径向渐变 (Radial Gradients)**：由它们的中心定义。

```css
.linear {
  background: linear-gradient(to right, red, yellow);
}
```

## 5. 文本效果 (Text Effects)

- **text-shadow**：向文本应用阴影。
- **word-wrap**：允许对长的不可分割的单词进行换行。
- **@font-face**：允许您在网页中使用自定义字体。

```css
h1 {
  text-shadow: 2px 2px 5px red;
}
```

## 6. 转换 (Transforms)

允许您对元素进行移动、缩放、转动、拉长或拉伸。

- **2D 转换**：`translate()`, `rotate()`, `scale()`, `skew()`
- **3D 转换**：`rotateX()`, `rotateY()`

```css
.trans {
  transform: rotate(45deg) scale(1.5);
}
```

## 7. 过渡 (Transitions)

元素从一种样式逐渐改变为另一种的效果，无需使用 Flash 动画或 JavaScript。

```css
div {
  transition:
    width 2s,
    height 2s,
    transform 2s;
}
div:hover {
  width: 300px;
}
```

## 8. 动画 (Animations)

通过 `@keyframes` 规则创建动画。

```css
@keyframes mymove {
  from {
    top: 0px;
  }
  to {
    top: 200px;
  }
}

.anim {
  animation: mymove 5s infinite;
}
```

## 9. 弹性盒子 (Flexbox)

一种用于在页面上布置元素的布局模式，使得当页面布局必须适应不同的屏幕尺寸和不同的显示设备时，元素可预测地运行。

## 10. 媒体查询 (Media Queries)

CSS3 的多媒体查询继承了 CSS2 多媒体类型的所有思想：取代了查找设备的类型，CSS3 根据设置自适应显示。是响应式设计的基础。

```css
@media screen and (max-width: 600px) {
  body {
    background-color: lightblue;
  }
}
```

## 11. 颜色 (Colors)

增加了新的颜色表示方式：

- **RGBA**：Red, Green, Blue, Alpha (透明度)
- **HSL**：Hue, Saturation, Lightness
- **HSLA**
