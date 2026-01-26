# Vue 3 组件通信方式汇总

在 Vue 3 中，组件通信是开发中最常见的场景。根据通信方向和层级关系，可以分为父子通信、兄弟通信、跨层级通信等。以下是 Vue 3 中常用的通信方式详解。

## 1. Props / Emits (最基础的父子通信)

这是最常用、最基础的父子组件通信方式。

### 父传子 (Props)

父组件通过属性绑定传递数据，子组件通过 `defineProps` 接收。

**父组件 Parent.vue:**

```vue
<template>
  <Child :msg="message" :count="100" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import Child from "./Child.vue";

const message = ref("Hello from Parent");
</script>
```

**子组件 Child.vue:**

```vue
<template>
  <div>{{ msg }} - {{ count }}</div>
</template>

<script setup lang="ts">
// 使用 defineProps 接收，无需导入
const props = defineProps<{
  msg: string;
  count?: number;
}>();

console.log(props.msg);
</script>
```

### 子传父 (Emits)

子组件通过 `emit` 触发事件，父组件监听事件。

**子组件 Child.vue:**

```vue
<template>
  <button @click="handleClick">Notify Parent</button>
</template>

<script setup lang="ts">
// 定义可以触发的事件
const emit = defineEmits<{
  (e: "update-data", value: string): void;
}>();

const handleClick = () => {
  emit("update-data", "New Value");
};
</script>
```

**父组件 Parent.vue:**

```vue
<template>
  <Child @update-data="handleUpdate" />
</template>

<script setup lang="ts">
const handleUpdate = (val: string) => {
  console.log("Received:", val);
};
</script>
```

---

## 2. v-model (双向绑定)

Vue 3 对 `v-model` 进行了升级，支持多个 `v-model` 绑定，本质上是 `props` 和 `emit` 的语法糖。

**父组件 Parent.vue:**

```vue
<template>
  <!-- v-model:modelValue 是默认的 -->
  <Child v-model="searchText" />
  <!-- 多个 v-model -->
  <Child v-model:title="pageTitle" />
</template>

<script setup lang="ts">
import { ref } from "vue";
const searchText = ref("");
const pageTitle = ref("Home");
</script>
```

**子组件 Child.vue:**

```vue
<template>
  <input :value="modelValue" @input="updateValue" />
  <input :value="title" @input="updateTitle" />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  title: string;
}>();

const emit = defineEmits(["update:modelValue", "update:title"]);

const updateValue = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

const updateTitle = (e: Event) => {
  emit("update:title", (e.target as HTMLInputElement).value);
};
</script>
```

---

## 3. Provide / Inject (依赖注入)

适用于**跨层级**通信（例如祖孙组件），避免了 props 逐层传递（Prop Drilling）。

**祖先组件 Ancestor.vue:**

```vue
<script setup lang="ts">
import { provide, ref } from "vue";

const theme = ref("dark");
// 提供响应式数据
provide("theme-color", theme);
// 也可以提供修改数据的方法
provide("toggle-theme", () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
});
</script>
```

**后代组件 Descendant.vue:**

```vue
<script setup lang="ts">
import { inject, Ref } from "vue";

// 注入数据，第二个参数为默认值
const theme = inject<Ref<string>>("theme-color");
const toggleTheme = inject<() => void>("toggle-theme");
</script>

<template>
  <div :class="theme">Current Theme: {{ theme }}</div>
  <button @click="toggleTheme">Toggle</button>
</template>
```

---

## 4. Refs & defineExpose (父访问子)

父组件通过 `ref` 获取子组件实例，直接调用子组件的属性或方法。在 `<script setup>` 中，组件默认是**关闭**的，需要使用 `defineExpose` 显式暴露。

**子组件 Child.vue:**

```vue
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
const reset = () => {
  count.value = 0;
};

// 显式暴露属性和方法
defineExpose({
  count,
  reset,
});
</script>
```

**父组件 Parent.vue:**

```vue
<template>
  <Child ref="childRef" />
  <button @click="handleReset">Reset Child</button>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Child from "./Child.vue";

// 变量名必须与 template 中的 ref 属性值一致
const childRef = ref<InstanceType<typeof Child> | null>(null);

const handleReset = () => {
  console.log(childRef.value?.count); // 访问子组件数据
  childRef.value?.reset(); // 调用子组件方法
};
</script>
```

---

## 5. Attributes (透传 Attributes)

如果子组件没有声明 `props` 或 `emits`，父组件传递的属性（如 `class`, `style`, `id`, `click` 事件等）会自动透传到子组件的**根元素**上。

**父组件:**

```vue
<Child class="large-btn" @click="log" />
```

**子组件 Child.vue:**

```vue
<template>
  <!-- class="large-btn" 和 @click 会自动绑定到 button 上 -->
  <button>Click Me</button>
</template>
```

如果不想自动透传，可以在组件选项中设置 `inheritAttrs: false`，然后通过 `useAttrs` 访问：

```vue
<script setup lang="ts">
import { useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();
console.log(attrs.class);
</script>

<template>
  <div class="wrapper">
    <button v-bind="attrs">Bind Here</button>
  </div>
</template>
```

---

## 6. Slots (插槽)

用于父组件向子组件传递**模板内容**。

### 默认插槽与具名插槽

**子组件 Child.vue:**

```vue
<template>
  <header>
    <slot name="header">Default Header</slot>
  </header>
  <main>
    <slot></slot>
    <!-- 默认插槽 -->
  </main>
</template>
```

**父组件 Parent.vue:**

```vue
<template>
  <Child>
    <template #header>
      <h1>Page Title</h1>
    </template>
    <p>Main Content</p>
  </Child>
</template>
```

### 作用域插槽 (Child -> Parent 数据流)

子组件将数据回传给父组件的插槽内容使用。

**子组件:**

```vue
<template>
  <slot :user="user" :id="123"></slot>
</template>
<script setup>
const user = { name: "Alice" };
</script>
```

**父组件:**

```vue
<template>
  <Child v-slot="{ user, id }"> User: {{ user.name }}, ID: {{ id }} </Child>
</template>
```

---

## 7. Event Bus (mitt)

Vue 3 移除了 `$on`, `$off`, `$once`，不再支持 Vue 实例作为 Event Bus。推荐使用第三方库如 `mitt` 实现全局事件总线（适用于兄弟组件或任意组件通信）。

**安装:**

```bash
pnpm add mitt
```

**utils/emitter.ts:**

```ts
import mitt from "mitt";

type Events = {
  foo: string;
  bar: number;
};

const emitter = mitt<Events>();
export default emitter;
```

**Component A (Sender):**

```ts
import emitter from "@/utils/emitter";
emitter.emit("foo", "Hello");
```

**Component B (Receiver):**

```ts
import emitter from "@/utils/emitter";
import { onUnmounted } from "vue";

const handler = (msg) => console.log(msg);
emitter.on("foo", handler);

onUnmounted(() => {
  emitter.off("foo", handler);
});
```

---

## 8. 全局状态管理 (Pinia)

对于复杂的应用状态，推荐使用 Pinia（Vue 官方推荐的状态管理库）。

**store/counter.ts:**

```ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  function increment() {
    count.value++;
  }
  return { count, increment };
});
```

**任意组件:**

```vue
<script setup>
import { useCounterStore } from "@/store/counter";
const counter = useCounterStore();
</script>

<template>
  <div @click="counter.increment">{{ counter.count }}</div>
</template>
```

---

## 总结推荐

| 场景              | 推荐方式            | 备注                                     |
| :---------------- | :------------------ | :--------------------------------------- |
| **父传子**        | Props               | 最通用，响应式                           |
| **子传父**        | Emits               | 标准事件模式                             |
| **双向绑定**      | v-model             | 表单元素或自定义输入组件                 |
| **祖孙/跨层级**   | Provide / Inject    | 避免 Props 逐层传递，适合插件/基础组件库 |
| **父访子实例**    | Refs + defineExpose | 只有在需要直接操作子组件方法时使用       |
| **兄弟/任意组件** | Pinia 或 Mitt       | 简单场景用 Mitt，复杂状态共享用 Pinia    |
| **内容分发**      | Slots               | 复用组件布局逻辑                         |
