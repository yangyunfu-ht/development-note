# DOM 事件机制详解

在前端开发中，理解 DOM 事件机制（事件流）是处理用户交互的基础。本文将详细介绍**事件捕获**、**事件冒泡**以及基于此衍生的**事件委托**技术。

## 1. DOM 事件流

当一个 HTML 元素产生一个事件时，该事件会在元素节点与根节点之间按特定的顺序传播，这个传播过程就是 DOM 事件流。

DOM 事件流分为三个阶段：

1.  **捕获阶段 (Capturing Phase)**：事件从 `window` 对象自上而下向目标节点传播。
2.  **目标阶段 (Target Phase)**：事件到达目标节点。
3.  **冒泡阶段 (Bubbling Phase)**：事件从目标节点自下而上向 `window` 对象传播。

### 示意图

```
window -> document -> html -> body -> ... -> 目标元素 (捕获阶段)
                                                |
                                             (目标阶段)
                                                |
window <- document <- html <- body <- ... <- 目标元素 (冒泡阶段)
```

## 2. 事件捕获 (Event Capturing)

**定义**：事件从最外层的祖先元素（通常是 `window` 或 `document`）开始，一直传播到目标元素的过程。

**目的**：在事件到达目标之前，有机会拦截或监控事件。

**开启方式**：
在 `addEventListener` 的第三个参数中传入 `true` 或 `{ capture: true }`。

```javascript
element.addEventListener("click", handler, true);
```

## 3. 事件冒泡 (Event Bubbling)

**定义**：事件从目标元素开始，一直传播到最外层的祖先元素的过程。

**默认行为**：绝大多数 DOM 事件（如 `click`, `keyup` 等）默认都支持冒泡。

**开启方式**：
`addEventListener` 的第三个参数默认为 `false`，即默认在冒泡阶段触发。

```javascript
element.addEventListener("click", handler, false); // 或省略第三个参数
```

## 4. 阻止传播

有时候我们不希望事件继续传播（例如，点击弹窗内部不应该触发弹窗外部的关闭逻辑），可以使用 `event` 对象的方法。

### `event.stopPropagation()`

阻止事件在 DOM 中继续传播（包括捕获和冒泡），但不会阻止当前元素上绑定的其他同类型事件监听器执行。

### `event.stopImmediatePropagation()`

阻止事件继续传播，并且**阻止当前元素上后续绑定的同类型事件监听器执行**。

```javascript
child.addEventListener("click", (e) => {
  e.stopPropagation(); // 阻止冒泡到 parent
  console.log("child clicked");
});

parent.addEventListener("click", () => {
  console.log("parent clicked"); // 不会执行
});
```

## 5. 事件委托 (Event Delegation)

**定义**：利用**事件冒泡**机制，将子元素的事件监听器统一绑定到父元素（或祖先元素）上，由父元素统一处理。

### 优点

1.  **减少内存消耗**：不需要给每个子元素都绑定事件，特别是子元素非常多时（如长列表）。
2.  **动态绑定**：对于后续动态添加的子元素，无需重新绑定事件，因为它们会自动冒泡到父元素。
3.  **代码更简洁**：统一管理逻辑。

### 代码示例

假设有一个列表 `ul`，我们需要点击 `li` 时打印其内容。

**不使用委托 (反例)**：

```javascript
const list = document.querySelectorAll("li");
list.forEach((li) => {
  li.addEventListener("click", (e) => {
    console.log(e.target.innerText);
  });
});
```

**使用事件委托 (推荐)**：

```javascript
const ul = document.querySelector("ul");

ul.addEventListener("click", (e) => {
  // 兼容性处理：e.target 是实际点击的元素
  // 此时 e.currentTarget 是 ul (绑定事件的元素)

  // 判断点击的是否是我们关心的 li 元素
  if (e.target.tagName.toLowerCase() === "li") {
    console.log(e.target.innerText);
  }

  // 如果 li 内部还有子元素（如 span），点击 span 也会冒泡上来
  // 此时 e.target 是 span，需要用 closest 查找最近的 li
  const li = e.target.closest("li");
  if (li && ul.contains(li)) {
    console.log(li.innerText);
  }
});
```

### 适合委托的事件

`click`, `mousedown`, `mouseup`, `keydown`, `keyup`, `keypress` 等。

### 不适合委托的事件

`focus`, `blur` (这两个不冒泡，但可以用 `focusin`/`focusout` 替代), `mouseenter`, `mouseleave` (也不冒泡)。
