# 发布订阅者模式 (Pub/Sub Pattern)

发布-订阅模式（Publish-Subscribe Pattern）是一种设计模式，它定义了一种对象间一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。

## 什么是发布订阅模式

在发布-订阅模式中，消息的发送者（发布者）不会直接将消息发送给特定的接收者（订阅者）。这意味着发布者和订阅者不知道彼此的存在。它们之间存在一个第三个组件，称为**调度中心**（Event Channel / Event Bus），它过滤所有传入的消息并相应地分发它们。

- **发布者 (Publisher)**: 发出通知（事件）的角色。
- **订阅者 (Subscriber)**: 接收通知并执行相应操作的角色。
- **调度中心 (Event Channel)**: 维护订阅者列表，并在发布者发布事件时通知相关的订阅者。

## 作用与优点

1. **解耦**: 发布者和订阅者之间没有直接依赖，降低了系统的耦合度。
2. **灵活性**: 可以很容易地添加新的订阅者，而无需修改发布者的代码。
3. **异步编程**: 常用于处理异步操作，例如网络请求完成后的回调处理。
4. **多对多通信**: 一个事件可以有多个订阅者，一个订阅者也可以订阅多个事件。

## TypeScript 实现示例

下面是一个简单的 `EventEmitter` 类的实现，包含了 `on`（订阅）、`emit`（发布）、`off`（取消订阅）和 `once`（只订阅一次）方法。

```typescript
type EventHandler = (...args: any[]) => void;

class EventEmitter {
  private events: Map<string, EventHandler[]>;

  constructor() {
    this.events = new Map();
  }

  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  on(eventName: string, callback: EventHandler): void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName)!.push(callback);
  }

  /**
   * 发布事件
   * @param eventName 事件名称
   * @param args 传递给回调函数的参数
   */
  emit(eventName: string, ...args: any[]): void {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(
            `Error executing callback for event "${eventName}":`,
            error,
          );
        }
      });
    }
  }

  /**
   * 取消订阅
   * @param eventName 事件名称
   * @param callback 要移除的回调函数
   */
  off(eventName: string, callback: EventHandler): void {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      const newCallbacks = callbacks.filter((cb) => cb !== callback);
      this.events.set(eventName, newCallbacks);
      // 如果没有订阅者了，删除该事件键
      if (newCallbacks.length === 0) {
        this.events.delete(eventName);
      }
    }
  }

  /**
   * 只订阅一次
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  once(eventName: string, callback: EventHandler): void {
    const wrapper = (...args: any[]) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }
}

// --- 使用示例 ---

// 创建实例
const emitter = new EventEmitter();

// 定义回调函数
const onUserLogin = (user: { name: string }) => {
  console.log(`用户 ${user.name} 登录了 (on)`);
};

const onUserLoginOnce = (user: { name: string }) => {
  console.log(`用户 ${user.name} 登录了 (once)`);
};

// 订阅事件
emitter.on("login", onUserLogin);
emitter.once("login", onUserLoginOnce);

// 发布事件
console.log("--- 第一次发布 ---");
emitter.emit("login", { name: "Alice" });

// 取消订阅
emitter.off("login", onUserLogin);

// 再次发布事件
console.log("--- 第二次发布 ---");
emitter.emit("login", { name: "Bob" });

/**
 * 输出结果:
 *
 * --- 第一次发布 ---
 * 用户 Alice 登录了 (on)
 * 用户 Alice 登录了 (once)
 *
 * --- 第二次发布 ---
 * (没有任何输出，因为 onUserLogin 被 off 了，onUserLoginOnce 执行一次后自动 off 了)
 */
```

## 与观察者模式的区别

虽然两者很相似，但发布-订阅模式和观察者模式（Observer Pattern）是有区别的：

1. **调度中心**: 发布-订阅模式有一个调度中心，而观察者模式中观察者直接订阅目标对象（Subject）。
2. **耦合度**: 发布-订阅模式更加松耦合，发布者和订阅者互不认识。观察者模式中，目标对象需要维护观察者列表。
3. **应用场景**: 观察者模式多用于单个对象的状态变化通知；发布-订阅模式多用于跨组件、跨模块的消息通信（如 Vue 的 EventBus）。
