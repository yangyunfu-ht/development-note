# Vue 2 数组响应式原理与重写机制

在 Vue 2 中，由于 `Object.defineProperty` 的限制，无法自动检测数组的索引赋值（`arr[0] = val`）和长度变化（`arr.length = 0`）。为了实现数组的响应式，Vue 2 采用了一种“重写数组方法”的策略。

## 1. 为什么需要重写？

Vue 2 使用 `Object.defineProperty` 将对象的属性转化为 getter/setter，从而追踪变化。

但是对于数组：

1.  **性能代价大**：如果要拦截数组的索引访问，需要遍历数组的每个索引进行 `defineProperty`，且数组长度经常变化，维护成本极高。
2.  **API 限制**：`Object.defineProperty` 无法拦截数组原生方法（如 `push`）导致的变化。

因此，Vue 2 选择**放弃拦截数组索引**，转而**拦截数组的变异方法（Mutation Methods）**。

## 2. 重写了哪些方法？

Vue 2 重写了 **7 个**会改变原数组的方法：

1.  `push()`
2.  `pop()`
3.  `shift()`
4.  `unshift()`
5.  `splice()`
6.  `sort()`
7.  `reverse()`

> **注意**：`filter`、`concat`、`slice` 等不会改变原数组的方法没有被重写，它们会返回新数组，这在 Vue 中是支持的（通过替换旧数组）。

## 3. 重写原理（源码分析）

Vue 2 通过**原型链拦截**的方式实现了方法的重写。

### 核心步骤：

1.  获取数组的原型 `Array.prototype`。
2.  创建一个继承自 `Array.prototype` 的新对象 `arrayMethods`。
3.  在 `arrayMethods` 上定义上述 7 个方法。
4.  将需要响应式的数组实例的 `__proto__` 指向 `arrayMethods`。

### 简易实现代码：

```javascript
// 1. 获取数组原型
const arrayProto = Array.prototype;
// 2. 创建新对象，继承数组原型
export const arrayMethods = Object.create(arrayProto);

// 需要重写的 7 个方法
const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];

methodsToPatch.forEach(function (method) {
  // 缓存原始方法
  const original = arrayProto[method];

  // 定义新方法
  Object.defineProperty(arrayMethods, method, {
    value: function mutator(...args) {
      // A. 调用原始方法，获取结果
      const result = original.apply(this, args);

      // B. 获取关联的 Observer 实例
      const ob = this.__ob__;

      // C. 检测是否有新增元素（push, unshift, splice 会新增元素）
      let inserted;
      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          // splice(start, deleteCount, ...inserted)
          inserted = args.slice(2);
          break;
      }

      // D. 如果有新增元素，将其转化为响应式
      if (inserted) ob.observeArray(inserted);

      // E. 通知依赖更新 (关键！)
      ob.dep.notify();

      return result;
    },
    enumerable: false,
    writable: true,
    configurable: true,
  });
});
```

### 兼容性处理（**proto** 支持）

Vue 2 在实现拦截时，会检查环境是否支持 `__proto__`（非标准属性）。

- **支持 `__proto__`**：直接将数组实例的 `__proto__` 指向 `arrayMethods`（如上文所述）。
- **不支持 `__proto__`**（如 IE < 11 的部分模式）：Vue 会采用**暴力混入**的方式，将 `arrayMethods` 上的方法直接遍历定义到数组实例上（作为自有属性），从而覆盖原型上的同名方法。

## 4. 局限性与解决方案

由于这种机制，Vue 2 的数组响应式存在以下**已知缺陷**：

### 缺陷 1：无法检测索引赋值

```javascript
vm.items[1] = "x"; // 不是响应式的
```

**解决方案**：

```javascript
// 使用 Vue.set / vm.$set
Vue.set(vm.items, 1, "x");
// 或使用 splice
vm.items.splice(1, 1, "x");
```

### 缺陷 2：无法检测长度修改

```javascript
vm.items.length = 0; // 不是响应式的
```

**解决方案**：

```javascript
vm.items.splice(0);
```

## 5. 总结

| 特性           | 说明                                                                                                     |
| :------------- | :------------------------------------------------------------------------------------------------------- |
| **重写目的**   | 弥补 `Object.defineProperty` 无法高效拦截数组变化的不足。                                                |
| **技术手段**   | 原型链继承（`__proto__` 指针修改） + AOP 切片编程思想。                                                  |
| **核心逻辑**   | 1. 调用原方法执行操作。<br>2. 观察新增元素。<br>3. 手动触发依赖通知 (`dep.notify()`)。                   |
| **Vue 3 改进** | Vue 3 使用 `Proxy`，可以直接拦截数组索引和长度变化，无需重写数组方法（但为了性能依然做了一些特殊处理）。 |
