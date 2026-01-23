## 原型链 (Prototype Chain)

在 JavaScript 中，**原型（Prototype）** 和 **原型链（Prototype Chain）** 是实现继承和共享属性的核心机制。

### 核心概念

1.  **prototype（原型对象）**：
    - 每个**函数**（包括构造函数）都有一个 `prototype` 属性。
    - 它指向一个对象，这个对象包含可以由该构造函数的所有实例共享的属性和方法。

2.  **\_\_proto\_\_（隐式原型）**：
    - 每个**对象**（实例）都有一个 `__proto__` 属性（ES标准中为 `[[Prototype]]`，可以通过 `Object.getPrototypeOf()` 访问）。
    - 它指向创建该对象的构造函数的 `prototype`。

3.  **constructor（构造函数）**：
    - 原型对象默认有一个 `constructor` 属性，指向关联的构造函数。

### 原型链的工作原理

当你访问一个对象的属性时，JavaScript 引擎会按照以下顺序查找：

1.  **自身属性**：首先检查对象本身是否拥有该属性。
2.  **原型属性**：如果没有，则顺着 `__proto__` 找到其原型对象查找。
3.  **链式查找**：如果原型对象上也没有，则继续顺着原型的 `__proto__` 向上查找。
4.  **终点**：直到找到 `Object.prototype`。如果 `Object.prototype` 上也没有，则查找结束，返回 `undefined`。（`Object.prototype.__proto__` 为 `null`）。

这条由 `__proto__` 串联起来的链路，就是**原型链**。

### 示意图

```mermaid
graph BT
    Instance[实例对象 (person)] -->|__proto__| Prototype[原型对象 (Person.prototype)]
    Prototype -->|__proto__| ObjectProto[Object.prototype]
    ObjectProto -->|__proto__| Null[null]

    Constructor[构造函数 (Person)] -->|prototype| Prototype
    Prototype -->|constructor| Constructor
```

### 代码示例

```javascript
function Person(name) {
  this.name = name;
}

// 在原型上添加方法，所有实例共享
Person.prototype.sayHello = function () {
  console.log(`Hello, my name is ${this.name}`);
};

const alice = new Person("Alice");
const bob = new Person("Bob");

// 1. 访问自身属性
console.log(alice.name); // "Alice"

// 2. 访问原型方法 (沿着原型链查找)
alice.sayHello(); // "Hello, my name is Alice"

// 3. 验证关系
console.log(alice.__proto__ === Person.prototype); // true
console.log(Person.prototype.constructor === Person); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null
```

### 原型链继承

这是 JavaScript 中最基础的继承方式。

```javascript
function Animal() {
  this.eat = function () {
    console.log("Animal is eating");
  };
}

function Dog() {
  this.bark = function () {
    console.log("Dog is barking");
  };
}

// 将 Dog 的原型指向 Animal 的实例
Dog.prototype = new Animal();
// 修正 constructor 指向
Dog.prototype.constructor = Dog;

const myDog = new Dog();

myDog.eat(); // "Animal is eating" (继承自 Animal)
myDog.bark(); // "Dog is barking" (自身方法)
```

### `instanceof` 原理

`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```javascript
console.log(myDog instanceof Dog); // true
console.log(myDog instanceof Animal); // true
console.log(myDog instanceof Object); // true
```
