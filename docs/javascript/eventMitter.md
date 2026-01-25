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

下面是一个简单的 `EventEmitter` 类的实现，包含了 `on`（订阅）、`emit`（发布）、`off`（取消订阅）和 `once`（只订阅一次）方法。我们使用 `Map` 来存储事件和回调函数的映射，相比于传统的 Object 实现，Map 在键值对的增删改查上性能更优，且避免了原型链干扰。

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
      // 复制一份副本执行，防止在回调中取消订阅导致数组索引错乱
      [...callbacks].forEach((callback) => {
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
      // 如果没有订阅者了，删除该事件键，释放内存
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
    // 保存原始 callback 的引用，以便用户可以使用 off 取消未触发的 once 事件
    (wrapper as any).originalCallback = callback;
    this.on(eventName, wrapper);
  }
}
```

## 使用示例

```typescript
// 1. 创建实例
const eventBus = new EventEmitter();

// 2. 定义回调函数
const onOrderCreated = (orderId: string) => {
  console.log(`订单 ${orderId} 创建成功！`);
};

const onUserRegistered = (username: string) => {
  console.log(`欢迎新用户: ${username}`);
};

// 3. 订阅事件
eventBus.on('order:created', onOrderCreated);
eventBus.on('user:registered', onUserRegistered);

// 4. 发布事件
eventBus.emit('order:created', 'ORD-12345');
// 输出: 订单 ORD-12345 创建成功！

eventBus.emit('user:registered', 'Alice');
// 输出: 欢迎新用户: Alice

// 5. 只订阅一次
eventBus.once('system:alert', (msg) => {
  console.warn(`系统警告: ${msg}`);
});

eventBus.emit('system:alert', '内存不足');
// 输出: 系统警告: 内存不足

eventBus.emit('system:alert', 'CPU 过高');
// (无输出，因为只触发一次)

// 6. 取消订阅
eventBus.off('order:created', onOrderCreated);
eventBus.emit('order:created', 'ORD-67890');
// (无输出)
```

## 与观察者模式的区别

| 特性 | 发布-订阅模式 (Pub-Sub) | 观察者模式 (Observer) |
| :--- | :--- | :--- |
| **耦合度** | 松耦合（通过调度中心隔离） | 较紧耦合（Subject 直接持有 Observer 列表） |
| **通信方式** | 借助中间件 (Event Bus) | 直接通信 |
| **关注点** | 消息/事件本身 | 目标对象的状态变化 |
| **典型应用** | 消息队列 (RabbitMQ), Vue EventBus | DOM 事件监听, Vue 响应式系统 (Dep/Watcher) |
