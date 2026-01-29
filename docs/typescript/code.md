# TypeScript 高频面试题汇总

## 1. Interface (接口) 和 Type (类型别名) 的区别？

这是最常问的问题之一。

- **相同点**：
  - 都可以用来描述对象或函数的形状。
  - 都可以被扩展（Interface 使用 `extends`，Type 使用交叉类型 `&`）。
- **不同点**：
  1. **声明合并 (Declaration Merging)**: Interface 支持声明合并，同名的 Interface 会自动合并；Type 不支持。
  2. **基本类型别名**: Type 可以为基本类型（如 `string`）、联合类型、元组定义别名；Interface 不行。
  3. **计算属性**: Type 支持计算属性生成映射类型 (`in keyof`)；Interface 不支持。

**结论**：编写库或第三方类型定义时推荐使用 `Interface`（方便使用者扩展）；定义应用内部的复杂类型（如联合类型、工具类型）时推荐使用 `Type`。

## 2. any, unknown, never, void 的区别？

- **any**: 任意类型。放弃了类型检查，可以赋值给任意类型，也可以把任意类型赋值给它。**尽量少用**。
- **unknown**: 未知类型。它是 `any` 的安全版本。可以把任意类型赋值给 `unknown`，但**不能**把 `unknown` 赋值给其他类型（除了 `any` 和 `unknown`），必须先进行**类型断言**或**类型收窄**。
- **never**: 永不存在的值的类型。常用于：
  - 总是抛出错误的函数返回值。
  - 无限循环的函数返回值。
  - 联合类型的全面性检查（Exhaustiveness checking）。
- **void**: 表示没有任何类型。通常用于没有返回值的函数。

## 3. 什么是泛型 (Generics)？有什么作用？

泛型是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

**作用**：增强代码的**复用性**和**灵活性**，同时保持类型安全。

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const output = identity<string>("myString");
```

## 4. 常见的内置工具类型 (Utility Types) 有哪些？

TypeScript 提供了很多内置的工具类型来转换类型：

- `Partial<T>`: 将 T 的所有属性变为**可选**。
- `Required<T>`: 将 T 的所有属性变为**必选**。
- `Readonly<T>`: 将 T 的所有属性变为**只读**。
- `Pick<T, K>`: 从 T 中**选取**一组属性 K。
- `Omit<T, K>`: 从 T 中**剔除**一组属性 K。
- `Record<K, T>`: 构造一个对象类型，属性键为 K，属性值为 T。
- `Exclude<T, U>`: 从 T 中剔除可以赋值给 U 的类型。
- `Extract<T, U>`: 从 T 中提取可以赋值给 U 的类型。
- `ReturnType<T>`: 获取函数 T 的返回类型。

## 5. 什么是类型守卫 (Type Guards) / 类型收窄？

类型守卫用于在运行时确保变量是某种特定的类型，从而在特定的代码块中缩小变量的类型范围。

常见方式：

1. **typeof**: `if (typeof x === 'string')`
2. **instanceof**: `if (x instanceof Date)`
3. **in**: `if ('name' in x)`
4. **自定义类型守卫 (is 关键字)**:

```typescript
function isString(test: any): test is string {
  return typeof test === "string";
}
```

## 6. const enum 和 enum 的区别？

- **enum (普通枚举)**: 会在编译后的 JavaScript 中生成真实存在的对象（双向映射）。
- **const enum (常量枚举)**: **不会**生成 JS 对象，在编译阶段会被**内联**（直接替换为对应的值）。

**结论**：如果不需要在运行时访问枚举对象，使用 `const enum` 可以减少代码体积。

## 7. TypeScript 中的 this 是如何处理的？

在 TypeScript 中，可以在函数的第一个参数显式定义 `this` 的类型（这是一个伪参数，编译后会被移除），以防止 `this` 指向错误。

```typescript
function handleClick(this: HTMLElement) {
  this.style.color = "red"; // 类型安全
}
```

## 8. 什么是联合类型 (Union Types) 和 交叉类型 (Intersection Types)？

- **联合类型 (|)**: 表示取值可以为多种类型中的一种。`type A = string | number;`
- **交叉类型 (&)**: 表示将多个类型合并为一个类型（取并集）。`type A = { name: string } & { age: number };`

## 9. keyof 和 typeof 关键字的作用？

- **keyof**: 索引类型查询操作符。获取某种类型的所有键，返回一个联合类型。

  ```typescript
  interface Person {
    name: string;
    age: number;
  }
  type K = keyof Person; // "name" | "age"
  ```

- **typeof**: 在类型上下文中，获取一个变量或对象的类型。

  ```typescript
  const p = { name: "Tom", age: 18 };
  type P = typeof p; // { name: string; age: number; }
  ```

## 10. 什么是模块 (Module) 和 命名空间 (Namespace)？

- **Module**: 现代 JavaScript (ES6) 的标准模块系统 (`import`/`export`)。**推荐使用**。
- **Namespace**: TypeScript 早期为了解决全局变量污染而提供的内部模块系统 (`namespace X {}`)。
- **现状**：现在主要在编写 `.d.ts` 声明文件（描述旧的 JS 库）时可能会用到 `namespace`，日常开发应始终使用 ES Modules。

## 11. 解释一下 TypeScript 的装饰器 (Decorators)

装饰器是一种特殊类型的声明，它能够被附加到类声明，方法， 访问符，属性或参数上。装饰器使用 `@expression` 这种形式。

- 本质上是一个函数，在运行时被调用。
- 常用于框架开发（如 Angular, NestJS）中进行元编程（反射、依赖注入）。
- 注意：TS 中的装饰器目前仍是实验性特性（或者基于 Stage 3 标准），需要在 `tsconfig.json` 中配置。

## 12. 什么是声明文件 (.d.ts)？

声明文件用于为 JavaScript 代码提供类型定义，使得 TypeScript 能够理解 JS 库的结构和类型。

- 文件名以 `.d.ts` 结尾。
- 只包含类型声明，不包含逻辑实现。
- 使用 `declare` 关键字。
- 常用 DefinitelyTyped (`@types/xxx`) 获取社区维护的声明文件。
