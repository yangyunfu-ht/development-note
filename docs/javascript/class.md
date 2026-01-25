# ES6 Class 类

在 ES6 之前，JavaScript 使用构造函数和原型链来实现面向对象编程。ES6 引入了 `class` 关键字，它本质上是 **JavaScript 原型继承的语法糖**，让对象原型的写法更加清晰、更像面向对象编程的语法。

## 1. 基础语法

### 定义类

使用 `class` 关键字定义类。`constructor` 是构造方法，`this` 关键字代表实例对象。

```javascript
class Person {
  // 构造函数：初始化实例属性
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // 实例方法：定义在原型上 (Person.prototype)
  sayHello() {
    console.log(`你好，我是 ${this.name}，今年 ${this.age} 岁。`);
  }
}

const p1 = new Person("Alice", 25);
p1.sayHello(); // "你好，我是 Alice，今年 25 岁。"
```

### 与 ES5 构造函数的对比

| 特性         | ES5 构造函数                               | ES6 Class                     |
| :----------- | :----------------------------------------- | :---------------------------- |
| **定义方式** | `function Person() {}`                     | `class Person {}`             |
| **方法定义** | `Person.prototype.say = function() {}`     | 直接在类体中写方法            |
| **调用检查** | 可以直接调用（this 指向 window/undefined） | 必须使用 `new` 调用，否则报错 |
| **方法枚举** | 原型方法默认可枚举                         | 原型方法默认**不可枚举**      |

## 2. 继承 (Extends)

使用 `extends` 关键字实现继承，使用 `super` 关键字调用父类。

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  eat() {
    console.log(`${this.name} is eating.`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // 必须在访问 'this' 之前调用 super()
    super(name);
    this.breed = breed;
  }

  // 方法重写 (Override)
  eat() {
    console.log(`${this.name} is eating dog food.`);
  }

  bark() {
    console.log("Woof! Woof!");
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
dog.eat(); // "Buddy is eating dog food."
dog.bark(); // "Woof! Woof!"
```

> **注意**：在子类的 `constructor` 中，必须先调用 `super()` 才能使用 `this`，因为子类没有自己的 `this` 对象，而是继承父类的 `this` 对象并进行修饰。

## 3. 静态方法与属性 (Static)

使用 `static` 关键字定义静态方法或属性。它们属于**类本身**，而不是类的实例。

```javascript
class MathUtil {
  static PI = 3.14159;

  static add(a, b) {
    return a + b;
  }
}

console.log(MathUtil.PI); // 3.14159
console.log(MathUtil.add(1, 2)); // 3
// console.log(new MathUtil().add(1, 2)); // 报错：实例无法访问静态方法
```

## 4. Getter 和 Setter

使用 `get` 和 `set` 关键字拦截对属性的存取操作。

```javascript
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  // getter
  get area() {
    return this.width * this.height;
  }

  // setter
  set area(value) {
    console.error("Area is read-only!");
  }
}

const rect = new Rectangle(10, 20);
console.log(rect.area); // 200
rect.area = 300; // "Area is read-only!"
```

## 5. 私有属性 (Private Fields)

从 ES2022 开始，可以使用 `#` 前缀定义私有属性和方法，它们只能在类内部访问。

```javascript
class Counter {
  #count = 0; // 私有属性

  increment() {
    this.#count++;
    this.#log();
  }

  #log() {
    // 私有方法
    console.log(`Current count: ${this.#count}`);
  }
}

const c = new Counter();
c.increment(); // "Current count: 1"
// console.log(c.#count); // SyntaxError: Private field '#count' must be declared in an enclosing class
```

## 6. 装饰器 (Decorators)

> **注意**：装饰器目前处于 ES 提案阶段 (Stage 3)，在浏览器中直接运行可能不支持，通常需要配合 Babel 或 TypeScript 使用。

装饰器是一种特殊类型的声明，它能够被附加到类声明，方法，访问符，属性或参数上。装饰器使用 `@expression` 这种形式，`expression` 求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。

### 类装饰器

类装饰器在类声明之前被声明（紧靠着类声明）。类装饰器应用于类构造函数，可以用来监视，修改或替换类定义。

**基本语法**:

```javascript
// 简单的装饰器：封闭类和原型
function sealed(constructor) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  constructor(message) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

**修改类行为示例**:

```javascript
// 定义一个装饰器，为类添加静态属性
function addTimestamp(constructor) {
  constructor.timestamp = Date.now();
}

@addTimestamp
class User {
  constructor(name) {
    this.name = name;
  }
}

console.log(User.timestamp); // 输出当前时间戳
```

**装饰器工厂**:

如果需要向装饰器传入参数，可以使用装饰器工厂（返回装饰器函数的函数）。

```javascript
function log(message) {
  return function (constructor) {
    console.log(message);
    console.log(constructor.name);
  };
}

@log("Class Created:")
class Person {}
// 输出:
// Class Created:
// Person
```
