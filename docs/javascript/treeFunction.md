# 树形结构操作 (Tree Data Structure)

::: tip 提示
在前端开发中，树形结构数据处理非常常见，例如：多级菜单、组织架构、文件目录等。本节提供高性能的树形结构转换与操作函数，重点关注大数据量下的执行效率。
:::

## 1. 列表转树 (List to Tree)

将扁平的一维数组转换为树形结构。

**性能优化关键点：**

- ❌ **避免双重循环**：使用递归或双层 `forEach` 会导致 O(n²) 的时间复杂度，数据量大时性能急剧下降。
- ✅ **使用 Map 映射**：利用对象/Map 的引用特性，建立 `id -> node` 的映射，只需一次遍历即可完成挂载，时间复杂度为 O(n)。

```javascript
/**
 * 列表转树结构 (O(n) 高性能版)
 * @param {Array} list 源数据
 * @param {Object} options 配置项
 * @returns {Array} 树结构
 */
function listToTree(list, options = {}) {
  const {
    id = "id", // id 字段名
    pid = "pid", // 父 id 字段名
    children = "children", // 子节点字段名
  } = options;

  const map = new Map();
  const tree = [];

  // 1. 初始化 Map，建立 id -> node 的映射
  // 这里使用浅拷贝，避免修改原数据中的非引用类型，但仍保留对象引用
  for (let i = 0; i < list.length; i++) {
    const item = { ...list[i] };
    // 初始化 children
    if (!item[children]) {
      item[children] = [];
    }
    map.set(item[id], item);
  }

  // 2. 再次遍历，将节点挂载到父节点下
  for (const item of map.values()) {
    const parentId = item[pid];
    const parent = map.get(parentId);

    if (parent) {
      // 如果找到父节点，加入其 children
      parent[children].push(item);
    } else {
      // 没找到父节点，说明是根节点
      tree.push(item);
    }
  }

  return tree;
}

// 示例数据
const listData = [
  { id: 1, pid: null, name: "根节点" },
  { id: 2, pid: 1, name: "子节点1" },
  { id: 3, pid: 1, name: "子节点2" },
  { id: 4, pid: 2, name: "孙节点1" },
];

console.log(listToTree(listData));
```

## 2. 树结构扁平化 (Tree to List)

将树形结构还原为一维数组。

**性能优化关键点：**

- ❌ **递归风险**：深度过深的树可能导致栈溢出。
- ✅ **迭代法**：使用栈（Stack）模拟递归（深度优先）或队列（Queue）进行广度优先遍历，性能更稳健。

```javascript
/**
 * 树结构扁平化 (迭代法)
 * @param {Array} tree 树数据
 * @param {string} childrenKey 子节点字段名
 * @returns {Array} 扁平数组
 */
function treeToList(tree, childrenKey = "children") {
  const result = [];
  // 使用栈结构，初始放入第一层节点
  // 浅拷贝一层，防止修改原数组结构
  const stack = [...tree];

  while (stack.length > 0) {
    // 弹出栈顶元素
    const node = stack.pop();

    // 将节点加入结果集（根据需求，这里可以做去 children 操作）
    const { [childrenKey]: children, ...rest } = node;
    result.push(rest);

    // 如果有子节点，压入栈中
    // 注意：栈是后进先出，为了保持原本顺序（如果需要），可以倒序压栈
    if (children && children.length > 0) {
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i]);
      }
    }
  }

  return result;
}
```

## 3. 树节点查找 (Find Node)

在树中查找满足条件的节点。

**性能优化关键点：**

- **广度优先 (BFS)**：适合查找层级较浅的节点，利用队列实现。
- **深度优先 (DFS)**：适合查找深层节点，利用递归或栈实现。

这里提供一个通用的广度优先查找实现，因为非递归方式在 JS 引擎中通常更高效且无栈溢出风险。

```javascript
/**
 * 查找树节点 (BFS 广度优先)
 * @param {Array} tree 树数据
 * @param {Function} predicate 查找条件函数
 * @param {string} childrenKey 子节点字段名
 * @returns {Object|null} 找到的节点或 null
 */
function findTreeNode(tree, predicate, childrenKey = "children") {
  const queue = [...tree];

  while (queue.length > 0) {
    const node = queue.shift(); // 取出队首

    if (predicate(node)) {
      return node;
    }

    const children = node[childrenKey];
    if (children && children.length > 0) {
      // 将子节点加入队尾
      for (let i = 0; i < children.length; i++) {
        queue.push(children[i]);
      }
    }
  }

  return null;
}

// 示例
const target = findTreeNode(treeData, (node) => node.id === 4);
```

## 4. 查找节点路径 (Find Path)

查找从根节点到目标节点的完整路径。通常用于面包屑导航回显。此场景通常使用 DFS 回溯。

```javascript
/**
 * 查找节点路径
 * @param {Array} tree 树数据
 * @param {Function} predicate 查找条件
 * @param {string} childrenKey 子节点字段
 * @returns {Array} 路径数组
 */
function findTreePath(tree, predicate, childrenKey = "children") {
  const path = [];

  const dfs = (nodes) => {
    for (const node of nodes) {
      path.push(node); // 假设当前节点在路径上

      // 1. 检查当前节点是否匹配
      if (predicate(node)) {
        return true;
      }

      // 2. 递归查找子节点
      const children = node[childrenKey];
      if (children && children.length > 0) {
        if (dfs(children)) {
          return true;
        }
      }

      // 3. 回溯：如果当前分支没找到，移除当前节点
      path.pop();
    }
    return false;
  };

  dfs(tree);
  return path;
}
```

## 5. 过滤树 (Filter Tree)

保留满足条件的节点及其父级路径，常用于菜单搜索。

```javascript
/**
 * 过滤树结构 (保留父级结构)
 * @param {Array} tree 树数据
 * @param {Function} predicate 过滤条件
 * @param {string} childrenKey 子节点字段
 * @returns {Array} 新的树结构
 */
function filterTree(tree, predicate, childrenKey = "children") {
  // 使用 reduce 归并结果
  return tree.reduce((acc, node) => {
    // 1. 递归处理子节点
    const children = node[childrenKey]
      ? filterTree(node[childrenKey], predicate, childrenKey)
      : [];

    // 2. 如果当前节点符合条件，或者子节点有符合条件的（保留路径）
    if (predicate(node) || children.length > 0) {
      // 浅拷贝节点，避免修改原数据
      acc.push({
        ...node,
        [childrenKey]: children,
      });
    }

    return acc;
  }, []);
}
```

### 6、过滤树，保留符合条件的节点及其子节点

```javascript
/**
 * 过滤树结构 (保留符合条件的节点及其子节点)
 * @param {Array} tree 树数据
 * @param {Function} predicate 过滤条件
 * @param {string} childrenKey 子节点字段
 * @returns {Array} 新的树结构
 */
function filterTreeIterative(tree, predicate, childrenKey = "children") {
  const stack = [...tree.map((node) => ({ node, parent: null, index: 0 }))];
  const result = [];
  const parentMap = new Map();

  while (stack.length) {
    const { node, parent, index } = stack.pop();

    if (
      predicate(node) ||
      (node[childrenKey] && node[childrenKey].some((child) => predicate(child)))
    ) {
      const newNode = { ...node, [childrenKey]: [] };

      if (parent) {
        if (!parentMap.has(parent)) {
          const newParent = { ...parent, [childrenKey]: [] };
          parentMap.set(parent, newParent);
        }
        parentMap.get(parent)[childrenKey].push(newNode);
      } else {
        result.push(newNode);
      }

      parentMap.set(node, newNode);
    }

    if (node[childrenKey]) {
      for (let i = node[childrenKey].length - 1; i >= 0; i--) {
        stack.push({
          node: node[childrenKey][i],
          parent: node,
          index: i,
        });
      }
    }
  }

  return result;
}
```
