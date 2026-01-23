# TypeScript 内置工具类型 (Utility Types)

TypeScript 提供了一组内置的工具类型，用于在全局范围内方便地转换类型。以下是常用工具类型的作用及示例。

## 1. 属性修饰工具

### Partial\<T>

将类型 `T` 的所有属性设置为可选。

```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

// 所有属性变为可选：{ id?: number; name?: string; age?: number; }
type PartialUser = Partial<User>;

const user1: PartialUser = {
  name: "Alice", // 合法，其他属性可选
};
```

### Required\<T>

将类型 `T` 的所有属性设置为必选（去除 `?`）。

```typescript
interface Props {
  a?: number;
  b?: string;
}

// 所有属性变为必选：{ a: number; b: string; }
type RequiredProps = Required<Props>;

const props: RequiredProps = {
  a: 1,
  b: "hello", // 必须提供所有属性
};
```

### Readonly\<T>

将类型 `T` 的所有属性设置为只读。

```typescript
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};

// todo.title = "Hello"; // Error: Cannot assign to 'title' because it is a read-only property.
```

## 2. 属性选择与排除

### Pick\<T, K>

从类型 `T` 中选择一组属性 `K` 构造新类型。

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// 只选择 title and completed：{ title: string; completed: boolean; }
type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

### Omit\<T, K>

从类型 `T` 中剔除一组属性 `K` 构造新类型（与 `Pick` 相反）。

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

// 剔除 description 和 createdAt：{ title: string; completed: boolean; }
type TodoPreview = Omit<Todo, "description" | "createdAt">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

### Record\<K, T>

构造一个对象类型，其属性键为 `K`，属性值为 `T`。通常用于映射对象的属性。

```typescript
interface CatInfo {
  age: number;
  breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

// 键是 CatName，值是 CatInfo
const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};
```

## 3. 联合类型处理

### Exclude\<T, U>

从联合类型 `T` 中剔除所有可以赋值给 `U` 的成员。

```typescript
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number
```

### Extract\<T, U>

从联合类型 `T` 中提取所有可以赋值给 `U` 的成员（交集）。

```typescript
type T0 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T1 = Extract<string | number | (() => void), Function>; // () => void
```

### NonNullable\<T>

从类型 `T` 中剔除 `null` 和 `undefined`。

```typescript
type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```

## 4. 函数类型处理

### Parameters\<T>

获取函数类型 `T` 的参数类型组成的元组。

```typescript
declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>; // []
type T1 = Parameters<(s: string) => void>; // [s: string]
type T2 = Parameters<<T>(arg: T) => T>; // [arg: unknown]
type T3 = Parameters<typeof f1>; // [arg: { a: number; b: string }]
```

### ReturnType\<T>

获取函数类型 `T` 的返回值类型。

```typescript
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>; // string
type T1 = ReturnType<(s: string) => void>; // void
type T2 = ReturnType<typeof f1>; // { a: number; b: string }
```

### ConstructorParameters\<T>

获取构造函数类型 `T` 的参数类型组成的元组。

```typescript
class C {
  constructor(a: number, b: string) {}
}

type T0 = ConstructorParameters<typeof C>; // [a: number, b: string]
```

### InstanceType\<T>

获取构造函数类型 `T` 的实例类型。

```typescript
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>; // C
```

## 5. This 处理

### ThisParameterType\<T>

提取函数类型 `T` 的 `this` 参数类型，如果没有 `this` 参数则为 `unknown`。

```typescript
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

### OmitThisParameter\<T>

从函数类型 `T` 中移除 `this` 参数。

```typescript
function toHex(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);

console.log(fiveToHex());
```

### ThisType\<T>

这个类型不返回转换后的类型，而是作为上下文 `this` 类型的标记。必须启用 `--noImplicitThis`。

```typescript
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // 方法中的 this 指向 D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data = desc.data || ({} as D);
  let methods = desc.methods || ({} as M);
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});

obj.x = 10;
obj.moveBy(5, 5);
```

## 6. 字符串操作类型 (Template Literal Types)

### Uppercase\<StringType>

将字符串转换为大写。

```typescript
type Greeting = "Hello, world";
type ShoutyGreeting = Uppercase<Greeting>; // "HELLO, WORLD"
```

### Lowercase\<StringType>

将字符串转换为小写。

```typescript
type Greeting = "Hello, world";
type QuietGreeting = Lowercase<Greeting>; // "hello, world"
```

### Capitalize\<StringType>

将字符串首字母转换为大写。

```typescript
type LowercaseGreeting = "hello, world";
type Greeting = Capitalize<LowercaseGreeting>; // "Hello, world"
```

### Uncapitalize\<StringType>

将字符串首字母转换为小写。

```typescript
type UppercaseGreeting = "HELLO WORLD";
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>; // "hELLO WORLD"
```
