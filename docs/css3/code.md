# CSS 高频面试题汇总

## 1. 介绍一下 CSS 盒模型

CSS 盒模型本质上是一个盒子，封装周围的 HTML 元素，它包括：边距（margin），边框（border），填充（padding），和实际内容（content）。

盒模型分为两种：

1. **标准盒模型 (Standard Box Model)**:
    - `width` = content width
    - `height` = content height
    - 总宽度 = `width` + `padding` + `border` + `margin`
    - 设置方式：`box-sizing: content-box` (默认)
2. **IE 盒模型 (怪异盒模型, Alternative Box Model)**:
    - `width` = content width + `padding` + `border`
    - `height` = content height + `padding` + `border`
    - 总宽度 = `width` + `margin`
    - 设置方式：`box-sizing: border-box`

**推荐**：在项目中通常设置 `* { box-sizing: border-box; }` 以便更直观地控制元素大小。

## 2. display: none, visibility: hidden, opacity: 0 的区别

| 属性                   | 页面空间                | 事件绑定     | 继承性                         | 过渡动画 (Transition) | 性能 (重排/重绘)              |
| :--------------------- | :---------------------- | :----------- | :----------------------------- | :-------------------- | :---------------------------- |
| **display: none**      | **不占位** (彻底消失)   | 无法触发     | 非继承 (子孙节点消失)          | 不支持                | **重排 (Reflow)** + 重绘      |
| **visibility: hidden** | **占位** (看不见但存在) | 无法触发     | 继承 (子元素设置 visible 可见) | 支持 visibility 属性  | **重绘 (Repaint)**            |
| **opacity: 0**         | **占位** (透明度为 0)   | **可以触发** | 继承                           | 支持                  | 重绘 (若提升为合成层则不重绘) |

## 3. 什么是 BFC？如何触发？

请参考文档：[BFC 详解](/css3/bfc)

**核心作用**：

1. 清除浮动（解决父元素高度塌陷）。
2. 避免外边距重叠（Margin Collapse）。
3. 阻止元素被浮动元素覆盖（实现两栏布局）。

## 4. 水平垂直居中的几种方案

1. **Flex 布局 (推荐)**:

    ```css
    .parent {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    ```

2. **绝对定位 + transform**:

    ```css
    .child {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    ```

3. **Grid 布局**:

    ```css
    .parent {
      display: grid;
      place-items: center;
    }
    ```

4. **绝对定位 + margin: auto**:

    ```css
    .child {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
    }
    ```

## 5. CSS 选择器优先级 (Specificity)

优先级计算规则（权值）：

1. **!important**: 最高优先级。
2. **内联样式 (Inline Style)**: 1000
3. **ID 选择器**: 100
4. **类、伪类、属性选择器**: 10
5. **标签、伪元素选择器**: 1
6. **通配符 (\*)、子选择器 (>)、相邻兄弟 (+)**: 0

**计算示例**：

- `#id .class div` = 100 + 10 + 1 = 111
- `.class .class` = 10 + 10 = 20

## 6. position 属性有哪些值？

- **static**: 默认值，文档流定位。
- **relative**: 相对定位，**不脱离文档流**，相对于自身原始位置偏移。
- **absolute**: 绝对定位，**脱离文档流**，相对于最近的非 `static` 祖先元素定位。
- **fixed**: 固定定位，**脱离文档流**，相对于浏览器窗口（Viewport）定位。
- **sticky**: 粘性定位，基于用户的滚动位置在 `relative` 和 `fixed` 之间切换。

## 7. px, em, rem, vw, vh 的区别

- **px**: 绝对单位，像素。
- **em**: 相对单位，相对于**父元素**的字体大小（如果在 font-size 中使用是相对于父元素，在其他属性中使用是相对于自身的 font-size）。
- **rem**: 相对单位，相对于**根元素 (html)** 的字体大小。常用于移动端适配。
- **vw/vh**: 视口单位，1vw = 视口宽度的 1%，1vh = 视口高度的 1%。

## 8. 重排 (Reflow) 与 重绘 (Repaint)

- **重排 (Reflow)**: 当 DOM 的变化影响了元素的几何信息（位置、尺寸）时，浏览器需要重新计算元素的几何属性，将其安放在界面中的正确位置。
  - _触发条件_：添加/删除 DOM、改变尺寸/边距、内容变化、窗口 resize 等。
- **重绘 (Repaint)**: 当元素的外观发生改变，但没有改变布局（几何信息）时，重新把元素绘制出来。
  - _触发条件_：改变颜色、背景、visibility 等。

**结论**：**重排一定会引起重绘，但重绘不一定引起重排**。重排的代价更高。

## 9. 伪类 (Pseudo-class) 与 伪元素 (Pseudo-element) 的区别

- **伪类 (单冒号 :)**: 用于选择处于特定状态的元素。
  - 例如：`:hover`, `:active`, `:first-child`, `:nth-child()`.
  - _理解_：像给元素添加了一个类（class）。
- **伪元素 (双冒号 ::)**: 用于创建一些不在文档树中的元素，并为其添加样式。
  - 例如：`::before`, `::after`, `::placeholder`.
  - _理解_：像创建了一个新的元素。
  - _注意_：CSS2 中伪元素也使用单冒号，CSS3 规范建议使用双冒号以示区别。

## 10. 清除浮动有哪些方式？

1. **使用 BFC (推荐)**: `overflow: hidden` 或 `display: flow-root`。
2. **使用 ::after 伪元素 (最常用)**:

    ```css
    .clearfix::after {
      content: "";
      display: block;
      clear: both;
    }
    ```

3. **添加空 div**: 在浮动元素末尾添加 `<div style="clear:both"></div>`（不推荐，增加无意义 DOM）。

## 11. CSS 预处理器 (Sass/Less/Stylus) 的好处

1. **嵌套语法**: 代码结构更清晰，减少重复选择器。
2. **变量**: 方便主题定制和维护（如颜色、字体大小）。
3. **Mixin (混合)**: 复用代码块，解决浏览器兼容性前缀问题。
4. **函数与运算**: 可以进行复杂的样式计算。
5. **模块化**: `@import` 分割代码，便于管理。

## 12. 画一个三角形

原理：利用 `border` 均分原理，将宽/高设为 0，设置三边边框透明。

```css
.triangle {
  width: 0;
  height: 0;
  border-top: 50px solid transparent;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 50px solid red; /* 底部红色，箭头向上 */
}
```

## 13. 什么是 CSS Sprites (雪碧图/精灵图)？

将多个小图标合并到一张大图中，通过 `background-image` 和 `background-position` 来显示不同的图标。

- **优点**：减少 HTTP 请求次数，提高加载速度。
- **缺点**：维护困难（添加/修改图标需要重新生成大图并计算坐标），在高清屏下可能失真。
- **现状**：现在更多使用 **Iconfont** (字体图标) 或 **SVG Symbol**，因为它们是矢量图，且更易维护。
