# Vue 3 高频面试题

## 1. Options API 与 Composition API 的区别？

**Options API (选项式 API):**

- **组织方式**: 代码逻辑按照 `data`、`methods`、`mounted` 等选项分离。
- **缺点**: 当组件变得复杂时，同一个功能的逻辑（如数据声明、方法、副作用）分散在不同的选项中，导致代码难以维护和理解（"反复横跳"）。
- **复用性**: 主要通过 `Mixin` 复用逻辑，但存在命名冲突、数据来源不清晰等问题。

**Composition API (组合式 API):**

- **组织方式**: 将同一个逻辑关注点的代码（数据、函数、生命周期）组织在一起。
- **优点**: 更好的逻辑复用（Composables）、更灵活的代码组织、更好的 TypeScript 类型推导支持。
- **复用性**: 使用组合式函数（Hooks），没有命名冲突，来源清晰。

## 2. Vue 3 响应式原理（Proxy vs Object.defineProperty）

**Vue 2 (Object.defineProperty):**

- **实现**: 递归遍历对象属性，使用 `Object.defineProperty` 劫持 `get` 和 `set`。
- **局限性**:
  - 无法检测对象属性的添加或删除（需要 `Vue.set` / `Vue.delete`）。
  - 无法检测数组下标的变化和长度变化（需要重写数组方法）。
  - 初始化时需要深度递归，性能开销大。

**Vue 3 (Proxy):**

- **实现**: 使用 ES6 `Proxy` 代理整个对象。
- **优势**:
  - 可以拦截对象的所有操作（包括属性增删、数组索引修改）。
  - **懒代理**: 只有访问嵌套对象时才会递归代理，初始化性能更好。
  - 原生支持 Map、Set 等集合类型。
- **注意**: Proxy 是 ES6 特性，不支持 IE11。

## 3. ref 与 reactive 的区别？

| 特性         | ref                                                    | reactive                                                                       |
| :----------- | :----------------------------------------------------- | :----------------------------------------------------------------------------- |
| **数据类型** | 支持基本类型（String, Number等）和对象                 | 仅支持对象（Object, Array, Map, Set）                                          |
| **访问方式** | JS 中需要通过 `.value` 访问，模板中自动解包            | 直接访问属性                                                                   |
| **底层实现** | 基本类型使用 `RefImpl` 类；对象类型内部调用 `reactive` | 使用 `Proxy` 代理                                                              |
| **重新赋值** | 可以替换整个 `.value`                                  | 不能直接替换整个对象（会丢失响应性），建议使用 `Object.assign` 或包裹在 ref 中 |

## 4. watch 与 watchEffect 的区别？

**watch:**

- **懒执行**: 默认不立即执行，只有依赖变化时才执行（可通过 `immediate: true` 修改）。
- **明确依赖**: 需要显式指定要监听的数据源。
- **访问新旧值**: 回调函数可以获取 `newValue` 和 `oldValue`。

**watchEffect:**

- **立即执行**: 组件初始化时立即执行一次，自动收集依赖。
- **自动依赖**: 不需要指定监听源，自动追踪回调中用到的响应式数据。
- **无法获取旧值**: 只能获取当前值。

## 5. Vue 3 生命周期有哪些变化？

Vue 3 在 Composition API 中提供了对应的生命周期钩子（Hooks），通常在 `setup` 中调用：

| Vue 2 (Options API) | Vue 3 (Composition API) |
| :------------------ | :---------------------- |
| `beforeCreate`      | `setup()`               |
| `created`           | `setup()`               |
| `beforeMount`       | `onBeforeMount`         |
| `mounted`           | `onMounted`             |
| `beforeUpdate`      | `onBeforeUpdate`        |
| `updated`           | `onUpdated`             |
| `beforeDestroy`     | `onBeforeUnmount`       |
| `destroyed`         | `onUnmounted`           |
| `errorCaptured`     | `onErrorCaptured`       |

**注意**: `setup` 是围绕 `beforeCreate` 和 `created` 生命周期钩子运行的，所以在 `setup` 中不需要显式定义这两个钩子。

## 6. script setup 语法糖的优势？

`<script setup>` 是 Vue 3 引入的编译时语法糖：

1. **更简洁**: 顶层的变量、函数、组件导入无需 `return` 或 `components` 注册，直接在模板中使用。
2. **更好的 TS 支持**: 可以使用纯 TypeScript 声明 props 和 emits (`defineProps`, `defineEmits`)。
3. **运行时性能更好**: 模板会被编译成渲染函数，避免了中间的代理开销。
4. **更好的 IDE 类型推导**: 配合 Volar 插件提供极佳的开发体验。

## 7. Vue 3 的性能优化有哪些？

1. **静态提升 (Static Hoisting)**: 将静态节点（不包含动态绑定的节点）提升到渲染函数之外，避免每次更新都重新创建。
2. **补丁标记 (Patch Flags)**: 在编译时分析动态内容，生成 Patch Flag（如 TEXT, CLASS, PROPS），Diff 算法运行时只比较带有 Flag 的部分，跳过静态内容。
3. **事件缓存 (Event Cache)**: 缓存事件处理函数，避免每次更新都视为 props 变化。
4. **Tree Shaking**: 核心 API（如 `nextTick`, `keep-alive`）按需引入，减少打包体积。

## 8. 什么是 Teleport？

`Teleport`（传送门）允许我们将组件的 DOM 结构渲染到该组件 DOM 树之外的节点（例如 `body`）。

**使用场景**:

- 全屏模态框 (Modal)
- 弹出提示 (Tooltip / Popover)
- 覆盖层 (Overlay)

```html
<template>
  <teleport to="body">
    <div class="modal">...</div>
  </teleport>
</template>
```

## 9. 组件通信有哪些新方式？

除了 Props / Emits，Vue 3 提供了：

1. **Provide / Inject**: 依赖注入，用于跨层级组件通信。
2. **Expose**: 使用 `defineExpose` 显式暴露组件内部的属性或方法（`<script setup>` 默认是关闭的）。
3. **Mitt**: Vue 3 移除了 `$on`, `$off`, `$once`，不再支持 EventBus。推荐使用第三方库 `mitt` 实现事件总线。
4. **Attrs**: `$attrs` 现在包含了 `class` 和 `style`，且移除了 `$listeners`（合并到了 `$attrs` 中）。
