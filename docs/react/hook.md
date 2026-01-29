# React Hooks 详解

Hooks 是 React 16.8 新增的特性，允许你在不编写 class 的情况下使用 state 以及其他的 React 特性。

## 状态钩子 (State Hooks)

### useState

最基础的状态钩子，用于在函数组件中添加状态。

- **作用**：声明一个状态变量。
- **使用场景**：任何需要响应式数据的场景（如表单输入、开关状态、计数器）。

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

### useReducer

`useState` 的替代方案，适用于状态逻辑复杂且包含多个子值的场景。

- **作用**：通过 reducer 函数管理复杂状态更新。
- **使用场景**：复杂的状态逻辑（如表单验证、购物车状态），或下一个状态依赖于前一个状态。

```jsx
import { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </>
  );
}
```

## 副作用钩子 (Effect Hooks)

### useEffect

用于处理副作用（Side Effects）。

- **作用**：在组件渲染后执行操作（数据获取、订阅、DOM 修改）。
- **使用场景**：API 请求、事件监听、定时器。
- **依赖数组**：
  - `[]`: 仅挂载和卸载时执行（模拟 `componentDidMount` + `componentWillUnmount`）。
  - `[prop, state]`: 依赖变化时执行（模拟 `componentDidUpdate`）。
  - 不传: 每次渲染都执行。

```jsx
import { useEffect, useState } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 挂载或 userId 变化时执行
    const controller = new AbortController();
    fetch(`/api/user/${userId}`, { signal: controller.signal })
      .then((res) => res.json())
      .then(setUser);

    // 清理函数（卸载或重新执行前调用）
    return () => controller.abort();
  }, [userId]);

  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

### useLayoutEffect

与 `useEffect` 结构相同，但在所有的 DOM 变更之后**同步**调用 effect。

- **作用**：在浏览器绘制前读取 DOM 布局并同步重新渲染。
- **使用场景**：需要测量 DOM 尺寸（如 Tooltip 位置计算）、避免闪烁的动画。
- **注意**：会阻塞视觉更新，尽量优先使用 `useEffect`。

```jsx
import { useLayoutEffect, useRef, useState } from "react";

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  return <div ref={ref}>Height: {tooltipHeight}</div>;
}
```

## 上下文钩子 (Context Hook)

### useContext

用于订阅 React Context。

- **作用**：无需通过 props 层层传递，直接获取全局数据。
- **使用场景**：主题切换、当前用户、多语言配置。

```jsx
import { useContext, createContext } from "react";

const ThemeContext = createContext("light");

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>I am styled by theme context!</button>;
}
```

## 引用钩子 (Ref Hooks)

### useRef

返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数。

- **作用**：
  1. 访问 DOM 节点。
  2. 保存一个可变变量，其改变不会触发重新渲染（类似 class 组件的实例属性）。
- **使用场景**：聚焦输入框、保存定时器 ID、保存上一轮的 props。

```jsx
import { useRef } from "react";

function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // 访问 DOM
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

### useImperativeHandle

自定义暴露给父组件的实例值（通常与 `forwardRef` 一起使用）。

- **作用**：控制父组件能通过 ref 访问到什么方法或属性。
- **使用场景**：封装组件库时，限制父组件对子组件的操作权限（只暴露 `focus` 或 `scroll` 方法）。

```jsx
import { forwardRef, useImperativeHandle, useRef } from "react";

const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
  }));

  return <input ref={inputRef} />;
});
```

## 性能优化钩子 (Performance Hooks)

### useMemo

返回一个 memoized（缓存）的值。

- **作用**：仅在依赖项改变时才重新计算值，避免昂贵的计算。
- **使用场景**：复杂的数据过滤、排序、大数据转换。

```jsx
import { useMemo } from "react";

function TodoList({ todos, filter }) {
  const visibleTodos = useMemo(() => {
    // 只有 todos 或 filter 改变时才执行这个耗时操作
    return filterTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

### useCallback

返回一个 memoized（缓存）的回调函数。

- **作用**：确保函数引用在依赖不变时保持稳定，避免子组件不必要的重新渲染（配合 `React.memo`）。
- **使用场景**：传递给子组件的事件处理函数。

```jsx
import { useCallback } from "react";

function Parent({ productId }) {
  // 只有 productId 改变时，handleClick 引用才会变
  const handleClick = useCallback(() => {
    console.log("Clicked product", productId);
  }, [productId]);

  return <Child onClick={handleClick} />;
}
```

## 优先级与并发钩子 (React 18+)

### useTransition

用于将 UI 更新标记为“非紧急”更新。

- **作用**：保持 UI 响应性，允许高优先级更新（如输入）打断低优先级更新（如列表渲染）。
- **使用场景**：Tab 切换、大数据列表搜索过滤。

```jsx
import { useTransition, useState } from "react";

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("about");

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

### useDeferredValue

接受一个值，并返回该值的新副本，该副本将推迟到更紧急的更新之后更新。

- **作用**：类似防抖（debounce），但不是基于时间，而是基于渲染优先级。
- **使用场景**：搜索框输入时，延迟渲染下方的结果列表。

```jsx
import { useDeferredValue, useState } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // List 组件会接收到延迟更新的 query，输入框保持流畅
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <SlowList text={deferredQuery} />
    </>
  );
}
```

## 其他钩子

- **useId**: 生成唯一的 ID，用于无障碍属性（aria-describedby）或 SSR。
- **useDebugValue**: 在 React DevTools 中显示自定义 Hook 的标签。
- **useSyncExternalStore**: 用于订阅外部 store（如 Redux, Zustand），解决并发渲染的数据撕裂问题。
