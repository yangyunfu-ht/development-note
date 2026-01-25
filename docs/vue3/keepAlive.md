# KeepAlive 缓存组件

`<KeepAlive>` 是 Vue 的一个内置组件，用于在多个组件间动态切换时缓存被移除的组件实例。

## 1. 什么是 KeepAlive？

- **类型**: 抽象组件（Abstract Component）。它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。
- **功能**: 当包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。
- **目的**: 保留组件状态或避免重新渲染带来的性能开销。

## 2. 基础使用

- **包裹动态组件**: 将 `<KeepAlive>` 包裹在动态组件的外部，例如 `<component :is="view"></component>`。
- **缓存所有组件**: 默认情况下，所有子组件实例都会被缓存。

### Props

- **include**: `string | RegExp | (string | RegExp)[]` - 只有名称匹配的组件会被缓存。
- **exclude**: `string | RegExp | (string | RegExp)[]` - 任何名称匹配的组件都不会被缓存。
- **max**: `number | string` - 最多可以缓存多少组件实例。

> **注意**: 匹配首先检查组件自身的 `name` 选项，如果 `name` 选项不可用，则匹配它的局部注册名称（父组件 `components` 选项的键值）。匿名组件不能被匹配。

### 示例

**基本用法**:

```html
<KeepAlive>
  <component :is="view"></component>
</KeepAlive>
```

**配合 Vue Router**:

```html
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>
```

**使用 include/exclude**:

```html
<!-- 逗号分隔字符串 -->
<KeepAlive include="a,b">
  <component :is="view"></component>
</KeepAlive>

<!-- 正则表达式 (使用 `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view"></component>
</KeepAlive>

<!-- 数组 (使用 `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view"></component>
</KeepAlive>
```

## 3. 生命周期

当一个组件在 `<KeepAlive>` 中被切换时，它的 `mounted` 和 `unmounted` 生命周期钩子不会被调用，取而代之的是 `activated` 和 `deactivated`。

- **onActivated**: 当组件被插入到 DOM 中时调用。
- **onDeactivated**: 当组件从 DOM 中移除时调用。

```javascript
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  console.log('Component is activated!')
})

onDeactivated(() => {
  console.log('Component is deactivated!')
})
</script>
```

## 4. 实现原理

### 核心逻辑

1.  **缓存容器**: 内部维护一个 `cache` 对象（通常是 Map）用于存储缓存的组件实例（VNode），以及一个 `keys` 数组（Set）用于记录键的顺序（用于 LRU 算法）。
2.  **渲染过程**:
    - 获取 `<KeepAlive>` 的第一个子节点（通常是动态组件）。
    - 获取组件的 `name`。
    - 检查 `include` 和 `exclude`，如果不匹配缓存条件，直接返回该组件 VNode。
    - 如果匹配缓存：
        - 生成缓存 Key。
        - **命中缓存**: 从 `cache` 中获取 VNode，将该组件实例指向缓存的实例 (`el` 也复用)，并更新 `keys`（将该 key 移到末尾，表示最近使用）。
        - **未命中缓存**: 将当前 VNode 存入 `cache`，将 key 存入 `keys`。
        - **修剪缓存**: 如果设置了 `max` 且当前缓存数超过限制，删除 `keys` 中最早的一个（最近最少使用），并销毁对应的组件实例。
    - 将组件的 `shapeFlag` 标记为 `COMPONENT_KEPT_ALIVE`，防止渲染器将其卸载。

### LRU 缓存策略 (Least Recently Used)

Vue 的 `<KeepAlive>` 使用 **LRU (最近最少使用)** 算法来管理缓存，当缓存数量达到 `max` 时，会优先淘汰最近没有被访问过的实例。

**算法演示**:
假设 `max=3`。

1.  访问 A: `cache: [A]`
2.  访问 B: `cache: [A, B]`
3.  访问 C: `cache: [A, B, C]`
4.  再次访问 A: `cache: [B, C, A]` (A 被移到末尾，表示最近刚被使用)
5.  访问 D: 此时缓存已满，需要淘汰。
    - 淘汰队首元素 B (因为 B 是目前最久未被使用的)。
    - `cache: [C, A, D]`

### 源码简析 (伪代码)

```javascript
const KeepAlive = {
  name: 'KeepAlive',
  __isKeepAlive: true,
  setup(props, { slots }) {
    const cache = new Map()
    const keys = new Set()
    
    // ...
    
    return () => {
      const vnode = slots.default()
      // ... 获取 name ...
      
      // 不在 include 中或在 exclude 中 -> 直接返回
      if (
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }
      
      const key = vnode.key == null ? comp : vnode.key
      const cachedVNode = cache.get(key)
      
      if (cachedVNode) {
        // 命中缓存：复用组件实例
        vnode.component = cachedVNode.component
        // 更新 LRU：先删再加，使其变为最新
        keys.delete(key)
        keys.add(key)
      } else {
        // 未命中：加入缓存
        keys.add(key)
        // 剪枝：超过 max，删除最旧的
        if (max && keys.size > parseInt(max)) {
          pruneCacheEntry(keys.values().next().value)
        }
      }
      
      // 标记为 KeepAlive 组件
      vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE
      return vnode
    }
  }
}
```
## 5. 注意事项

- **缓存实例**: `<KeepAlive>` 缓存的是组件实例，而不是 DOM 元素。这意味着组件的状态（如 `data`、`computed` 等）会被保留，但 DOM 元素会被复用。
- **动态组件**: 当使用动态组件（如 `<component :is="view"></component>`）时，确保每个组件都有唯一的 `key` 属性，否则缓存机制可能会失效。
- **性能考虑**: 缓存组件实例会占用内存，因此在缓存数量超过 `max` 时，需要考虑是否需要调整缓存策略或限制缓存的组件数量。

## 6.如何获取设置组件名称

### 1. 直接在组件选项中设置 `name`

```javascript
export default {
  name: 'MyComponent',
  // ...
}
```

### 2. 使用 `defineOptions` (Vue 3 推荐)

```javascript
import { defineOptions } from 'vue'

defineOptions({
  name: 'MyComponent',
})
```

### 3. 使用 `defineComponent`

```javascript
import { defineComponent } from 'vue'

defineComponent({
  name: 'MyComponent',
})
```

**注意**: 动态设置组件名称可能会导致缓存问题，因为 `<KeepAlive>` 是基于组件名称进行缓存的。建议在组件选项中直接设置 `name`。