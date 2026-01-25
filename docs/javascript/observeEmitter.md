# 观察者模式 (Observer Pattern)

观察者模式（Observer Pattern）是一种行为设计模式，它定义了对象之间的一种一对多的依赖关系，当一个对象（被观察者/Subject）的状态发生改变时，所有依赖于它的对象（观察者/Observer）都会得到通知并自动更新。

## 1. 概念与角色

在观察者模式中，主要有两个角色：

- **Subject (目标/被观察者)**: 维护一组观察者对象，提供添加、删除和通知观察者的方法。
- **Observer (观察者)**: 提供一个更新接口，当收到 Subject 的通知时，执行相应的逻辑。

### 与发布订阅模式的区别

虽然两者很像，但有本质区别：

- **观察者模式**: 观察者和被观察者是**松耦合**的，但彼此知道对方的存在（Subject 维护了 Observer 列表）。
- **发布订阅模式**: 发布者和订阅者**完全解耦**，它们通过一个第三方的“事件中心”进行通信，彼此不知道对方。

## 2. TypeScript 实现

下面使用 TypeScript 实现一个标准的观察者模式。

```typescript
/**
 * 观察者接口
 * 所有具体的观察者都必须实现 update 方法
 */
interface Observer {
  update(message: string): void;
}

/**
 * 被观察者（目标）接口
 * 定义添加、删除、通知观察者的方法
 */
interface Subject {
  // 添加观察者
  attach(observer: Observer): void;
  // 移除观察者
  detach(observer: Observer): void;
  // 通知所有观察者
  notify(): void;
}

/**
 * 具体的目标类
 * 比如一个天气站，当气温变化时通知所有显示设备
 */
class WeatherStation implements Subject {
  private observers: Observer[] = [];
  private temperature: number = 0;

  // 添加观察者
  attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log("Observer has been attached already.");
    }
    this.observers.push(observer);
    console.log("Attached an observer.");
  }

  // 移除观察者
  detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log("Nonexistent observer.");
    }
    this.observers.splice(observerIndex, 1);
    console.log("Detached an observer.");
  }

  // 通知所有观察者
  notify(): void {
    console.log("Subject: Notifying observers...");
    for (const observer of this.observers) {
      observer.update(`Temperature is now ${this.temperature}℃`);
    }
  }

  // 业务逻辑：改变气温并触发通知
  setTemperature(temp: number) {
    console.log(`\nSubject: Setting temperature to ${temp}℃.`);
    this.temperature = temp;
    this.notify();
  }
}

/**
 * 具体的观察者类 - 手机显示屏
 */
class PhoneDisplay implements Observer {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  update(message: string): void {
    console.log(`${this.name} received message: ${message}`);
  }
}

/**
 * 具体的观察者类 - 窗口显示屏
 */
class WindowDisplay implements Observer {
  update(message: string): void {
    console.log(`Window Display received update: ${message}`);
  }
}

// --- 测试代码 ---

const weatherStation = new WeatherStation();

const phone1 = new PhoneDisplay("iPhone 15");
const phone2 = new PhoneDisplay("Samsung S24");
const windowDisplay = new WindowDisplay();

weatherStation.attach(phone1);
weatherStation.attach(phone2);
weatherStation.attach(windowDisplay);

// 改变气温，触发通知
weatherStation.setTemperature(25);
// Output:
// Subject: Setting temperature to 25℃.
// Subject: Notifying observers...
// iPhone 15 received message: Temperature is now 25℃
// Samsung S24 received message: Temperature is now 25℃
// Window Display received update: Temperature is now 25℃

weatherStation.detach(phone2);

weatherStation.setTemperature(30);
// Output:
// Subject: Setting temperature to 30℃.
// Subject: Notifying observers...
// iPhone 15 received message: Temperature is now 30℃
// Window Display received update: Temperature is now 30℃
```

## 3. 使用场景

观察者模式在前端开发中非常常见，主要用于处理**一对多**的依赖关系。

### (1) Vue 2 的响应式系统 (Reactivity System)

Vue 2 的核心原理就是观察者模式的典型应用：

- **Subject**: `Dep` (Dependency) 类。每个响应式属性（data 中的 key）都有一个对应的 Dep 实例，用来收集依赖。
- **Observer**: `Watcher` 类。组件渲染函数、computed、watch 都会创建 Watcher 实例。
- **流程**: 当数据变化（Setter 触发）时，`Dep` 通知所有收集到的 `Watcher` 进行更新（update）。

### (2) DOM 事件监听 (Event Listeners)

虽然 DOM 事件常被归类为事件驱动编程，但从机制上看，它符合观察者模式：

- **Subject**: DOM 元素（如 button）。
- **Observer**: `addEventListener` 传入的回调函数。
- 当事件触发时，浏览器通知所有注册的监听器。

### (3) Node.js EventEmitter

Node.js 的 `EventEmitter` 也是基于观察者模式（或者更准确说是发布订阅模式的变体，但在 Node 内部实现中，它维护了监听器数组）。

### (4) 状态管理库 (Redux / MobX / Vuex)

- **Store** 是被观察者。
- **View (组件)** 是观察者。
- 当 Store 状态更新时，订阅了该状态的组件会自动重新渲染。

## 4. 优缺点

### 优点

- **开闭原则**: 你可以在不修改 Subject 代码的情况下引入新的 Observer 类，反之亦然。
- **建立抽象耦合**: Subject 只需要知道 Observer 实现了 update 接口，不需要知道具体类。

### 缺点

- **循环引用**: 如果 Subject 和 Observer 之间有循环依赖，可能导致系统崩溃。
- **通知耗时**: 如果观察者非常多，通知所有观察者可能会花费很多时间。
