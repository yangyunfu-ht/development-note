# Vue 2 与 Vue 3 的核心差异

Vue 3 在 Vue 2 的基础上进行了重大的重构和改进，不仅带来了更好的性能，还引入了全新的 Composition API，极大地提升了代码的可维护性和复用性。

## 1. 响应式系统 (Reactivity System)

这是 Vue 3 最底层的核心变化。

| 特性         | Vue 2                                                   | Vue 3                            |
| :----------- | :------------------------------------------------------ | :------------------------------- |
| **实现机制** | `Object.defineProperty`                                 | `Proxy`                          |
| **对象监听** | 递归遍历所有属性，性能开销大                            | 仅在访问时代理，性能更好         |
| **数组监听** | 拦截数组变更方法 (push, pop 等)，无法监听索引和长度变化 | 完美支持数组索引和长度变化的监听 |
| **动态属性** | 无法检测对象属性的添加或删除 (`Vue.set` / `Vue.delete`) | 原生支持对象属性的添加和删除     |
| **Map/Set**  | 不支持                                                  | 支持 Map, Set, WeakMap, WeakSet  |

### Vue 2 局限性示例

```javascript
// Vue 2
data() {
  return {
    obj: { a: 1 }
  }
}
methods: {
  update() {
    this.obj.b = 2; // 视图不会更新
    this.$set(this.obj, 'b', 2); // 必须使用 $set
  }
}
```

### Vue 3 优势示例

```javascript
// Vue 3
import { reactive } from "vue";

const state = reactive({ a: 1 });
state.b = 2; // 视图自动更新
```

## 2. API 设计 (Options API vs Composition API)

Vue 3 引入了组合式 API (Composition API)，这是为了解决大型组件逻辑复用和组织的问题。

### Vue 2 (Options API)

代码按选项组织 (`data`, `methods`, `mounted` 等)。随着组件变大，相关逻辑被分散在不同选项中，难以维护。

```javascript
export default {
  data() {
    return { count: 0 };
  },
  methods: {
    increment() {
      this.count++;
    },
  },
  mounted() {
    console.log("mounted");
  },
};
```

### Vue 3 (Composition API)

代码按逻辑关注点组织。使用 `setup` 函数，配合 `ref`, `reactive` 等。

```javascript
<script setup>
import { ref, onMounted } from 'vue';

// 逻辑关注点：计数
const count = ref(0);
const increment = () => count.value++;

onMounted(() => {
  console.log('mounted');
});
</script>
```

## 3. 生命周期钩子 (Lifecycle Hooks)

Vue 3 对生命周期钩子进行了重命名，使其更加语义化，并提供了对应的 Composition API 函数。

| Vue 2 Options API | Vue 3 Options API   | Vue 3 Composition API |
| :---------------- | :------------------ | :-------------------- |
| `beforeCreate`    | `beforeCreate`      | `setup()`             |
| `created`         | `created`           | `setup()`             |
| `beforeMount`     | `beforeMount`       | `onBeforeMount`       |
| `mounted`         | `mounted`           | `onMounted`           |
| `beforeUpdate`    | `beforeUpdate`      | `onBeforeUpdate`      |
| `updated`         | `updated`           | `onUpdated`           |
| `beforeDestroy`   | **`beforeUnmount`** | `onBeforeUnmount`     |
| `destroyed`       | **`unmounted`**     | `onUnmounted`         |
| `errorCaptured`   | `errorCaptured`     | `onErrorCaptured`     |

## 4. 多根节点 (Fragments)

- **Vue 2**: 组件模板必须有一个唯一的根元素。
- **Vue 3**: 支持多个根节点 (Fragments)，减少了不必要的 DOM 包装层。

```html
<!-- Vue 2: 必须包裹 -->
<template>
  <div>
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </div>
</template>

<!-- Vue 3: 无需包裹 -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>
```

## 5. Teleport (传送门)

Vue 3 原生内置了 `Teleport` 组件，允许将组件的 DOM 结构渲染到当前组件树之外的任何位置（如 `body` 下），非常适合模态框 (Modal)、通知 (Notification) 等场景。

```html
<template>
  <button @click="open = true">Open Modal</button>

  <Teleport to="body">
    <div v-if="open" class="modal">
      <p>Hello from the modal!</p>
      <button @click="open = false">Close</button>
    </div>
  </Teleport>
</template>
```

## 6. Suspense (异步依赖处理)

Vue 3 引入了 `Suspense` 组件，用于处理异步组件的加载状态（实验性特性）。它允许在组件树等待异步依赖（如 `async setup` 或异步组件）时渲染后备内容。

```html
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback> Loading... </template>
  </Suspense>
</template>
```

## 7. TypeScript 支持

- **Vue 2**: TypeScript 支持较弱，通常需要使用 `vue-class-component` 装饰器写法，类型推断不够友好。
- **Vue 3**: 源码使用 TypeScript 重写，提供了更好的类型推断。Composition API 天然对 TypeScript 友好，无需复杂的装饰器。

## 8. 性能优化

- **打包大小**: Tree-shaking 支持更彻底，按需引入 API，减少打包体积。
- **渲染性能**:
  - **静态提升 (Static Hoisting)**: 静态节点被提升到渲染函数之外，避免每次重新渲染时重复创建。
  - **Diff 算法优化**: 引入 Block Tree 和 Patch Flags，只对比带有动态标记的节点，跳过静态节点。
  - **事件侦听器缓存**: 缓存事件处理函数，避免不必要的组件更新。

## 9. 全局 API 调整

Vue 3 将全局 API 从 `Vue` 构造函数转移到了应用实例 (`app`) 上，避免了全局污染，支持同一页面运行多个 Vue 应用实例。

| Vue 2 全局 API  | Vue 3 实例 API  |
| :-------------- | :-------------- |
| `Vue.use`       | `app.use`       |
| `Vue.mixin`     | `app.mixin`     |
| `Vue.component` | `app.component` |
| `Vue.directive` | `app.directive` |
| `new Vue({})`   | `createApp({})` |

## 10. v-model 变化

- **Vue 2**: 组件上默认使用 `value` prop 和 `input` event。
  - `.sync` 修饰符用于双向绑定其他 prop。
- **Vue 3**: 组件上默认使用 `modelValue` prop 和 `update:modelValue` event。
  - 移除了 `.sync`，直接使用 `v-model:propName` 代替。
  - 支持在同一个组件上使用多个 `v-model`。

```html
<!-- Vue 3 -->
<ChildComponent v-model:title="pageTitle" v-model:content="pageContent" />
```

## 11. v-if 和 v-for 优先级

- **Vue 2**: `v-for` 优先级高于 `v-if`（不推荐同时使用）。
- **Vue 3**: `v-if` 优先级高于 `v-for`。这意味着 `v-if` 无法访问 `v-for` 作用域内的变量。

## 总结

Vue 3 是一次全面的进化，它在保持 Vue 易用性的同时，解决了 Vue 2 在大规模应用开发中的痛点（逻辑复用、类型支持、性能瓶颈）。虽然 Options API 依然可用，但 Composition API 代表了 Vue 开发的未来方向。
