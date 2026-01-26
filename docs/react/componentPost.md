# React 组件通信方式汇总

在 React 中，数据流是**单向**的（Top-Down）。组件通信主要分为父子通信、兄弟通信、跨层级通信等。以下是 React 中常用的通信方式详解。

## 1. Props (父传子)

最基础的通信方式，父组件通过属性传递数据，子组件通过 `props` 接收。

**父组件 Parent.jsx:**

```jsx
import Child from "./Child";

function Parent() {
  const message = "Hello from Parent";
  return <Child msg={message} count={100} />;
}
```

**子组件 Child.jsx:**

```jsx
function Child(props) {
  return (
    <div>
      {props.msg} - {props.count}
    </div>
  );
}
```

---

## 2. Callback Functions (子传父)

父组件将一个函数作为 `props` 传递给子组件，子组件调用该函数并将数据作为参数回传。

**父组件 Parent.jsx:**

```jsx
import { useState } from "react";
import Child from "./Child";

function Parent() {
  const [data, setData] = useState("");

  const handleUpdate = (val) => {
    setData(val);
    console.log("Received:", val);
  };

  return (
    <div>
      <p>Data from Child: {data}</p>
      <Child onUpdate={handleUpdate} />
    </div>
  );
}
```

**子组件 Child.jsx:**

```jsx
function Child({ onUpdate }) {
  const handleClick = () => {
    onUpdate("New Value");
  };

  return <button onClick={handleClick}>Notify Parent</button>;
}
```

---

## 3. Context API (跨层级通信)

适用于跨越多层级的组件通信（如主题、语言、用户信息），避免 Props Drilling。

**Context 创建 (ThemeContext.js):**

```jsx
import { createContext } from "react";

export const ThemeContext = createContext("light");
```

**祖先组件 Ancestor.jsx:**

```jsx
import { useState } from "react";
import { ThemeContext } from "./ThemeContext";
import Descendant from "./Descendant";

function Ancestor() {
  const [theme, setTheme] = useState("dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Descendant />
    </ThemeContext.Provider>
  );
}
```

**后代组件 Descendant.jsx:**

```jsx
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

function Descendant() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div style={{ background: theme === "dark" ? "#333" : "#fff" }}>
      Current Theme: {theme}
      <button onClick={() => setTheme("light")}>Switch to Light</button>
    </div>
  );
}
```

---

## 4. Ref & useImperativeHandle (父访问子)

父组件通过 `ref` 直接调用子组件暴露的方法或属性。需要配合 `forwardRef` 和 `useImperativeHandle` 使用。

**子组件 Child.jsx:**

```jsx
import { forwardRef, useImperativeHandle, useState } from "react";

const Child = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => ({
    reset: () => setCount(0),
    getCount: () => count,
  }));

  return (
    <div>
      Count: {count} <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
});

export default Child;
```

**父组件 Parent.jsx:**

```jsx
import { useRef } from "react";
import Child from "./Child";

function Parent() {
  const childRef = useRef();

  const handleReset = () => {
    childRef.current.reset();
  };

  return (
    <div>
      <Child ref={childRef} />
      <button onClick={handleReset}>Reset Child</button>
    </div>
  );
}
```

---

## 5. 状态提升 (Lifting State Up)

当两个兄弟组件需要共享数据时，将状态提升到它们共同的父组件中管理，通过 Props 分发。

**父组件:**

```jsx
function Parent() {
  const [sharedState, setSharedState] = useState(0);

  return (
    <>
      <SiblingA count={sharedState} />
      <SiblingB onIncrement={() => setSharedState((c) => c + 1)} />
    </>
  );
}
```

---

## 6. 全局状态管理 (Redux / Zustand / Recoil)

对于复杂的应用级状态，推荐使用第三方状态管理库。以 **Zustand** 为例（更轻量现代）：

**Store 创建 (store.js):**

```js
import { create } from "zustand";

export const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));
```

**组件中使用:**

```jsx
import { useStore } from "./store";

function BearCounter() {
  const bears = useStore((state) => state.bears);
  return <h1>{bears} around here...</h1>;
}

function Controls() {
  const increasePopulation = useStore((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}
```

---

## 7. Event Bus (Pub/Sub)

React 本身没有内置 Event Bus，可以使用 `mitt` 或 `events` 库实现任意组件通信（类似于 Vue 的 EventBus）。

**setup:**

```js
import mitt from "mitt";
export const emitter = mitt();
```

**Sender:**

```jsx
emitter.emit("foo", { a: "b" });
```

**Receiver:**

```jsx
useEffect(() => {
  const handler = (e) => console.log(e);
  emitter.on("foo", handler);
  return () => emitter.off("foo", handler);
}, []);
```

---

## 总结推荐

| 场景             | 推荐方式                    | 备注                            |
| :--------------- | :-------------------------- | :------------------------------ |
| **父传子**       | Props                       | 最通用，简单直接                |
| **子传父**       | Callback (Props)            | 父组件传递函数给子组件调用      |
| **兄弟组件**     | 状态提升 (Lifting State Up) | 将状态移至共同父组件            |
| **祖孙/跨层级**  | Context API                 | 避免 Props Drilling             |
| **父访子实例**   | ref + useImperativeHandle   | 仅用于强制操作 DOM 或子组件方法 |
| **复杂全局状态** | Zustand / Redux             | 适用于大型应用状态共享          |
