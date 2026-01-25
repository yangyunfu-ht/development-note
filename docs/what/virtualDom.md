# 虚拟 DOM (Virtual DOM)

## 1. 什么是虚拟 DOM？

**虚拟 DOM (Virtual DOM)** 顾名思义，就是“虚拟”的 DOM。它不是真实的 DOM 节点，而是一个**普通的 JavaScript 对象**，用于描述真实 DOM 的结构。

这个 JavaScript 对象包含了创建真实 DOM 所需的所有信息，例如标签名、属性、子节点等。

### 示例

**真实 DOM:**

```html
<div id="app" class="container">
  <h1>Hello Virtual DOM</h1>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

**对应的虚拟 DOM (简化版 JavaScript 对象):**

```javascript
const vnode = {
  tag: "div",
  props: {
    id: "app",
    class: "container",
  },
  children: [
    {
      tag: "h1",
      children: "Hello Virtual DOM",
    },
    {
      tag: "ul",
      children: [
        { tag: "li", children: "Item 1" },
        { tag: "li", children: "Item 2" },
      ],
    },
  ],
};
```

## 2. 虚拟 DOM 的作用与好处

### 2.1 跨平台能力 (Cross-Platform)

这是虚拟 DOM 最核心的好处之一。

- **真实 DOM** 是浏览器特有的，无法在 Node.js、原生移动端（iOS/Android）中直接运行。
- **虚拟 DOM** 是纯 JavaScript 对象，与平台无关。
  - 在浏览器中，可以渲染成真实 DOM。
  - 在服务端 (SSR)，可以渲染成 HTML 字符串。
  - 在原生应用 (React Native / Weex)，可以渲染成原生 UI 组件。

### 2.2 性能优化 (Diff 算法)

- **直接操作 DOM 代价昂贵**：频繁操作真实 DOM 会导致浏览器频繁进行回流 (Reflow) 和重绘 (Repaint)，性能开销大。
- **批量更新**：虚拟 DOM 允许我们在内存中进行计算。当数据发生变化时，框架会生成一颗新的虚拟 DOM 树，然后通过 **Diff 算法** 比较新旧两颗树的差异，最后**只将有差异的部分**更新到真实 DOM 上。
- **注意**：虚拟 DOM 不一定比直接操作原生 DOM 快（因为多了一层计算），但在复杂的应用中，它能保证性能下限，避免开发者写出极其低效的 DOM 操作代码。

### 2.3 提升开发效率 (Declarative UI)

虚拟 DOM 是**声明式 UI** 的基础。开发者只需要关注数据（State），数据变了，视图自动更新。不需要手动去 `document.getElementById` 然后修改 `innerHTML`，极大地解放了生产力。

## 3. 为什么 Vue 和 React 都在使用它？

虽然 Vue 和 React 在细节实现上有所不同（Vue 使用模板编译优化，React 使用 JSX），但它们采用虚拟 DOM 的核心原因是一致的：

1.  **数据驱动视图 (Data-Driven)**：
    - 通过虚拟 DOM，框架实现了“数据状态”到“UI 视图”的映射。开发者只维护状态，框架负责渲染，降低了代码维护成本。

2.  **分层设计 (Abstraction)**：
    - 虚拟 DOM 在“业务逻辑”和“渲染引擎”之间建立了一个缓冲层。这使得框架的核心逻辑（组件系统、生命周期、状态管理）可以复用，而渲染器（Renderer）可以根据平台替换。

3.  **性能与可维护性的平衡**：
    - 在大型应用中，手动优化 DOM 操作非常困难且容易出错。虚拟 DOM 提供了一套自动化的、足够高效的 DOM 更新策略，让开发者无需过多关注底层性能细节，就能构建出高性能的应用。

## 总结

| 特性         | 描述                                                         |
| :----------- | :----------------------------------------------------------- |
| **本质**     | 一个描述 DOM 结构的 JavaScript 对象                          |
| **核心优势** | 跨平台、声明式编程、通过 Diff 算法减少 DOM 操作              |
| **性能真相** | 保证性能下限，不一定比极致优化的原生操作快，但开发效率高得多 |
