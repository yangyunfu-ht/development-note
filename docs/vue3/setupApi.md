# Vue 3 组合式 API (Composition API) 详解

组合式 API (Composition API) 是 Vue 3 引入的一组新的 API，允许我们使用导入的函数而不是选项来编写 Vue 组件。它解决了 Vue 2 选项式 API (Options API) 在处理复杂组件逻辑复用和代码组织方面的局限性。

## 核心响应式 API

### setup()

组件的入口点，在组件创建之前执行。

- **作用**：组合式 API 的舞台，用于声明响应式状态、计算属性、方法等。
- **注意**：在 `setup` 中无法访问 `this`。

### ref()

用于定义基本类型（Primitive types）或对象的响应式数据。

- **作用**：创建一个包含 `.value` 属性的响应式对象。
- **场景**：数字、字符串、布尔值，或者需要整体替换的对象。

```ts
import { ref } from "vue";

const count = ref(0);
console.log(count.value); // 0

count.value++;
```

### reactive()

用于定义对象类型的响应式数据。

- **作用**：返回对象的响应式副本（深层代理）。
- **场景**：复杂对象、状态树。
- **局限**：不能用于基本类型；解构会丢失响应性（需配合 `toRefs`）。

```ts
import { reactive } from "vue";

const state = reactive({ count: 0 });
state.count++;
```

### computed()

创建计算属性。

- **作用**：基于响应式依赖进行缓存计算。
- **场景**：数据过滤、排序、派生状态。

```ts
import { ref, computed } from "vue";

const count = ref(1);
const plusOne = computed(() => count.value + 1);
```

### watch() / watchEffect()

侦听器。

- **watch**: 侦听特定的数据源，并在回调中执行副作用。支持惰性执行、访问新旧值。
- **watchEffect**: 立即运行一个函数，同时响应式地追踪其依赖，并在依赖变更时重新运行。

```ts
import { ref, watch, watchEffect } from "vue";

const count = ref(0);

// watch
watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`);
});

// watchEffect
watchEffect(() => {
  console.log(`current count is: ${count.value}`);
});
```

## 生命周期钩子

在 `setup()` 中使用的生命周期钩子，名称上都加了 `on` 前缀。

| 选项式 API             | 组合式 API      |
| :--------------------- | :-------------- |
| beforeCreate / created | setup()         |
| beforeMount            | onBeforeMount   |
| mounted                | onMounted       |
| beforeUpdate           | onBeforeUpdate  |
| updated                | onUpdated       |
| beforeUnmount          | onBeforeUnmount |
| unmounted              | onUnmounted     |

```ts
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  console.log("Component is mounted!");
});
```

## 依赖注入

### provide() / inject()

实现跨层级组件通信。

- **provide**: 在祖先组件中提供数据。
- **inject**: 在后代组件中注入数据。

```ts
// 祖先组件
import { provide, ref } from "vue";
const theme = ref("dark");
provide("theme", theme);

// 后代组件
import { inject } from "vue";
const theme = inject("theme");
```

## Refs 辅助工具

### toRef() / toRefs()

用于保持解构后的响应性。

- **toRef**: 为源响应式对象上的某个属性创建一个 ref。
- **toRefs**: 将响应式对象转换为普通对象，其中每个属性都是指向源对象相应属性的 ref。

```ts
import { reactive, toRefs } from "vue";

const state = reactive({
  foo: 1,
  bar: 2,
});

// 解构且保持响应性
const { foo, bar } = toRefs(state);
```

### isRef() / unref()

- **isRef**: 检查值是否为一个 ref 对象。
- **unref**: 如果参数是 ref，则返回内部值，否则返回参数本身。它是 `val = isRef(val) ? val.value : val` 的语法糖。

## 单文件组件 `<script setup>`

Vue 3 推荐的语法糖，使组合式 API 的使用更加简洁。

- **无需 return**：顶层的绑定会自动暴露给模板。
- **更少的样板代码**。
- **更好的类型推导**。

```vue
<script setup>
import { ref, onMounted } from "vue";

// 变量直接在模板中使用
const count = ref(0);

function increment() {
  count.value++;
}

onMounted(() => {
  console.log("Mounted!");
});
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

## 为什么选择组合式 API？

1. **更好的逻辑复用**：通过 "Composables" (组合式函数) 提取和复用逻辑，替代 Mixins。
2. **更灵活的代码组织**：相关的代码（如数据、方法、侦听器）可以放在一起，而不是分散在 `data`, `methods` 等选项中。
3. **更好的 TypeScript 支持**：完全的类型推导，无需复杂的类型体操。
4. **更小的生产包体积**：对 Tree-shaking 更友好。
