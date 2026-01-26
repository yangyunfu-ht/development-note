# React 高频面试题汇总

## 1. 什么是虚拟 DOM (Virtual DOM)？为什么它能提高性能？

**虚拟 DOM** 是一个轻量级的 JavaScript 对象，它是真实 DOM 的内存表示。React 使用它来描述 UI 应该是什么样子。

**工作原理**：

1. **State Change**: 当数据发生变化时，React 会创建一个新的虚拟 DOM 树。
2. **Diff Algorithm**: React 将新的虚拟 DOM 树与旧的进行比较（Diffing），找出差异。
3. **Reconciliation**: 将差异部分批量更新到真实 DOM 中。

**性能优势**：

- **减少 DOM 操作**: 真实 DOM 操作非常昂贵（重排/重绘）。虚拟 DOM 通过批量更新，最大限度地减少了与真实 DOM 的交互次数。
- **跨平台**: 虚拟 DOM 本质是 JS 对象，可以渲染到浏览器、Node.js (SSR) 或原生应用 (React Native)。

## 2. React 类组件生命周期有哪些？

主要分为三个阶段：

1. **挂载阶段 (Mounting)**:
    - `constructor()`: 初始化 state，绑定方法。
    - `static getDerivedStateFromProps()`: 很少使用，根据 props 更新 state。
    - `render()`: 渲染 UI。
    - `componentDidMount()`: 组件挂载后调用。适合发送网络请求、订阅事件、操作 DOM。
2. **更新阶段 (Updating)**:
    - `static getDerivedStateFromProps()`
    - `shouldComponentUpdate()`: 决定是否需要重新渲染，用于性能优化。
    - `render()`
    - `getSnapshotBeforeUpdate()`: 在更新前获取 DOM 快照。
    - `componentDidUpdate()`: 更新后调用。适合处理副作用（如根据 props 变化发请求）。
3. **卸载阶段 (Unmounting)**:
    - `componentWillUnmount()`: 组件卸载前调用。清理定时器、取消订阅。

## 3. 函数组件 vs 类组件

| 特性         | 类组件 (Class Components)     | 函数组件 (Function Components) |
| :----------- | :---------------------------- | :----------------------------- |
| **状态管理** | `this.state`, `this.setState` | `useState` Hook                |
| **生命周期** | 完整的生命周期方法            | `useEffect` Hook (模拟)        |
| **代码量**   | 较多，需要 `this` 绑定        | 简洁，无 `this`                |
| **复用逻辑** | HOC, Render Props             | Custom Hooks (更优雅)          |
| **未来趋势** | 逐渐被 Hook 取代              | **主流推荐**                   |

## 4. 调用 setState 是同步还是异步的？

- **在 React 18 之前**:
  - 在**合成事件**（React 事件处理函数）和**生命周期**中是**异步**的（为了批处理优化）。
  - 在**原生事件**（`addEventListener`）和 `setTimeout` 中是**同步**的。
- **在 React 18 之后**:
  - **自动批处理 (Automatic Batching)**: 无论在何处（包括 Promise, setTimeout, native events），更新都是**异步**且批处理的。
  - 如果需要强制同步更新，可以使用 `flushSync`。

## 5. 什么是 React Hooks？为什么要引入 Hooks？

Hooks 是 React 16.8 引入的特性，允许在函数组件中使用 state 和其他 React 特性。

**解决的问题**：

1. **在组件之间复用状态逻辑很难**: HOC 和 Render Props 容易导致“包装地狱”。Hooks 允许自定义 Hook 复用逻辑。
2. **复杂组件变得难以理解**: 生命周期方法中常常充斥着不相关的逻辑（如 `componentDidMount` 中既有数据获取又有事件订阅）。Hooks 将逻辑按功能拆分（如多个 `useEffect`）。
3. **难以理解的 Class**: `this` 指向问题困扰开发者。

## 6. useEffect 和 useLayoutEffect 的区别？

- **useEffect**: **异步执行**。在浏览器完成布局与绘制**之后**运行。适合不影响布局的副作用（如数据获取、日志记录）。不会阻塞渲染。
- **useLayoutEffect**: **同步执行**。在 DOM 更新后，浏览器绘制**之前**运行。适合需要读取 DOM 布局并同步重新渲染的场景（如防止闪烁）。会阻塞渲染。

## 7. React 如何进行性能优化？

1. **减少不必要的渲染**:
    - **React.memo**: 缓存函数组件。
    - **PureComponent**: 类组件浅比较 props 和 state。
    - **shouldComponentUpdate**: 手动控制渲染条件。
2. **Hooks 优化**:
    - **useMemo**: 缓存计算结果。
    - **useCallback**: 缓存函数引用，防止传递给子组件的 props 变化导致子组件重渲染。
3. **代码分割 (Code Splitting)**: 使用 `React.lazy` 和 `Suspense` 按需加载组件。
4.**列表渲染**: 正确使用 `key` 属性（不要用 index 作为 key，除非列表静态且不重排）。
5. **虚拟列表**: 渲染长列表时使用 `react-window` 或 `react-virtualized`。

## 8. 为什么列表渲染需要 key？为什么不建议用 index？

**Key 的作用**：帮助 React 识别哪些元素被改变、添加或移除。在 Diff 算法中，Key 是判断节点是否复用的关键依据。

**不建议用 index 的原因**：
如果列表项发生**重新排序**、**插入**或**删除**：

1. **性能问题**: React 会错误地复用 DOM 节点，导致大量不必要的 DOM 更新。
2. **状态 Bug**: 如果列表项包含非受控组件（如输入框），使用 index 可能导致状态错乱（输入内容“残留”在错误的位置）。

## 9. 什么是高阶组件 (HOC)？

HOC 是一个函数，接收一个组件并返回一个新的组件。它是 React 中用于**复用组件逻辑**的高级技术。

```javascript
function withLog(WrappedComponent) {
  return function (props) {
    console.log("Component rendered");
    return <WrappedComponent {...props} />;
  };
}
```

**应用场景**: 权限控制、日志记录、数据获取。

## 10. 受控组件 vs 非受控组件

- **受控组件 (Controlled)**: 表单数据由 React 组件的 `state` 管理。
  - `<input value={state} onChange={handleChange} />`
  - 优点：数据流清晰，便于校验和操作。
- **非受控组件 (Uncontrolled)**: 表单数据由 DOM 自身管理。
  - 使用 `useRef` 获取 DOM 元素的值。
  - `<input ref={inputRef} />`
  - 优点：代码简单，适合集成非 React 库。

## 11. Redux 的工作流程是怎样的？

1. **View** 触发 **Action** (`dispatch(action)`).
2. **Store** 调用 **Reducer**，传入当前 State 和 Action。
3. **Reducer** 根据 Action Type 计算并返回**新的 State** (纯函数，不可变数据)。
4. **Store** 保存新 State，并通知所有订阅者 (View)。
5. **View** 重新渲染。

**三大原则**: 单一数据源、State 是只读的、使用纯函数 (Reducer) 执行修改。

## 12. React 18 有哪些新特性？

1. **并发模式 (Concurrency)**: 允许 React 中断渲染，优先处理高优先级任务（如用户输入）。
2. **自动批处理 (Automatic Batching)**: 所有更新都会自动批处理，减少渲染次数。
3. **useTransition**: 将状态更新标记为非阻塞（低优先级），避免阻塞 UI。
4. **useDeferredValue**: 延迟更新某个值（类似防抖，但更智能）。
5. **Suspense 改进**: 支持服务器端渲染 (SSR) 的流式传输。

## 13. Fiber 架构是什么？解决什么问题？

**问题**: 在 React 16 之前（Stack Reconciler），更新过程是同步且递归的。一旦开始，就无法中断。如果组件树很深，主线程会被长时间占用，导致页面掉帧、卡顿。

**Fiber 解决方案**:

- 将渲染任务拆分成一个个小的任务单元 (**Fiber**)。
- **可中断/恢复**: 浏览器空闲时执行任务，有高优先级任务（如用户点击）时中断当前任务，先响应用户。
- **优先级调度**: 为不同类型的更新分配优先级。

Fiber 本质上是一个链表结构，实现了 React 的**时间切片 (Time Slicing)**。
