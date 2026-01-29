# 函数式组件 vs 类组件

在 React 的发展历程中，组件的写法主要经历了从 **Class Component（类组件）** 到 **Function Component（函数式组件）** 的转变。随着 React 16.8 引入 Hooks，函数式组件已经成为官方推荐的主流写法。

## 1. 核心区别总结

| 维度            | 函数式组件 (Function Component)        | 类组件 (Class Component)                     |
| :-------------- | :------------------------------------- | :------------------------------------------- |
| **定义方式**    | JavaScript 函数                        | ES6 类 (继承 `React.Component`)              |
| **状态管理**    | `useState`, `useReducer` Hooks         | `this.state`, `this.setState`                |
| **生命周期**    | `useEffect`, `useLayoutEffect`         | `componentDidMount`, `componentDidUpdate` 等 |
| **逻辑复用**    | 自定义 Hooks (非常灵活)                | HOC (高阶组件), Render Props (容易嵌套地狱)  |
| **this 关键字** | 不需要 `this`                          | 需要处理 `this` 指向 (bind 或箭头函数)       |
| **心智模型**    | **捕获渲染时的值 (Capture Value)**     | **指向最新的实例 (Mutable `this`)**          |
| **性能优化**    | `React.memo`, `useMemo`, `useCallback` | `shouldComponentUpdate`, `PureComponent`     |

## 2. 代码对比

### 2.1 类组件写法

类组件依赖 `class` 关键字，状态保存在 `this.state` 中，通过生命周期方法处理副作用。

```jsx
import React, { Component } from "react";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    document.title = `Clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `Clicked ${this.state.count} times`;
  }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.handleClick}>Click me</button>
      </div>
    );
  }
}
```

### 2.2 函数式组件写法 (Hooks)

函数式组件更加简洁，使用 `useState` 管理状态，`useEffect` 处理副作用（合并了 Mount 和 Update）。

```jsx
import React, { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    document.title = `Clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## 3. 深入理解：心智模型差异

这是两者最本质的区别。

- **类组件**：`this` 是可变的（Mutable）。`this.props` 和 `this.state` 始终指向最新的值。这在处理异步操作（如 `setTimeout`）时可能会导致 bug，因为在回调执行时，`this.props` 可能已经变了。
- **函数式组件**：利用闭包特性，**捕获**了渲染那一刻的 props 和 state。每次渲染都有自己独立的 props 和 state。

### 示例：3秒后 Alert

**类组件（Bug版）：**
如果快速点击3次，然后切换 props，alert 弹出的总是最后一次的 props。

```jsx
class ProfilePage extends React.Component {
  showMessage = () => {
    alert("Followed " + this.props.user);
  };

  handleClick = () => {
    setTimeout(this.showMessage, 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```

**函数式组件（正确版）：**
点击时的 props 被闭包捕获，alert 弹出的是点击那一刻的 user，而不是现在的 user。

```jsx
function ProfilePage(props) {
  const showMessage = () => {
    alert("Followed " + props.user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return <button onClick={handleClick}>Follow</button>;
}
```

## 4. 为什么推荐函数式组件？

1. **更简洁的代码**：减少了样板代码（Constructor, this绑定）。
2. **更好的逻辑复用**：自定义 Hooks 让逻辑复用变得极其简单，告别了 HOC 和 Render Props 的嵌套地狱。
3. **更易于测试和理解**：纯函数更加直观。
4. **Tree Shaking 友好**：函数式组件更容易被打包工具优化。
