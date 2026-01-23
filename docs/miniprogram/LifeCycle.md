# 微信小程序核心概念

::: tip 简介
微信小程序开发中，理解生命周期（Lifecycle）和配置（Configuration）是构建健壮应用的基础。本文详细梳理了应用、页面、组件的生命周期以及全局和页面级的配置项。
:::

## 1. 生命周期 (Lifecycle)

### 1.1 应用生命周期 (App Lifecycle)

定义在 `app.js` 中，控制整个小程序的启动、展示和隐藏。

```javascript
// app.js
App({
  onLaunch(options) {
    // 小程序初始化完成时触发，全局只触发一次
    // 场景：登录、获取用户信息、获取全局配置
    console.log("App Launch", options);
  },
  onShow(options) {
    // 小程序启动，或从后台进入前台显示时触发
    // 场景：检查更新、数据刷新
    console.log("App Show", options);
  },
  onHide() {
    // 小程序从前台进入后台时触发
    // 场景：暂停音频、清理定时器
    console.log("App Hide");
  },
  onError(msg) {
    // 小程序发生脚本错误或 API 调用报错时触发
    console.error("App Error", msg);
  },
});
```

### 1.2 页面生命周期 (Page Lifecycle)

定义在页面对应的 `.js` 文件中，管理单个页面的加载、显示、渲染等状态。

```javascript
// pages/index/index.js
Page({
  onLoad(options) {
    // 页面加载时触发，一个页面只会调用一次
    // 场景：获取页面参数(options)、发起网络请求
    console.log("Page Load", options);
  },
  onShow() {
    // 页面显示/切入前台时触发
    // 场景：更新数据、开启动画
    console.log("Page Show");
  },
  onReady() {
    // 页面初次渲染完成时触发，一个页面只会调用一次
    // 场景：操作 DOM (如 createSelectorQuery)
    console.log("Page Ready");
  },
  onHide() {
    // 页面隐藏/切入后台时触发 (如 navigateTo)
    // 场景：暂停页面动画
    console.log("Page Hide");
  },
  onUnload() {
    // 页面卸载时触发 (如 redirectTo, navigateBack)
    // 场景：清理定时器、解绑事件
    console.log("Page Unload");
  },
  // --- 页面事件处理函数 ---
  onPullDownRefresh() {
    // 监听用户下拉动作
  },
  onReachBottom() {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage() {
    // 用户点击右上角转发
  },
});
```

### 1.3 组件生命周期 (Component Lifecycle)

定义在组件 `.js` 文件的 `lifetimes` 字段中（推荐），用于管理组件的创建、挂载和销毁。

```javascript
// components/custom/custom.js
Component({
  lifetimes: {
    created() {
      // 组件实例刚刚被创建时执行
      // 注意：此时不能调用 setData
    },
    attached() {
      // 组件实例进入页面节点树时执行
      // 场景：初始化数据、发起请求
      console.log("Component Attached");
    },
    ready() {
      // 组件在视图层布局完成后执行
      // 场景：获取节点信息
    },
    moved() {
      // 组件实例被移动到节点树另一个位置时执行
    },
    detached() {
      // 组件实例被从页面节点树移除时执行
      // 场景：清理定时器
      console.log("Component Detached");
    },
  },
  // 组件所在页面的生命周期
  pageLifetimes: {
    show() {
      // 组件所在的页面被展示时执行
    },
    hide() {
      // 组件所在的页面被隐藏时执行
    },
  },
});
```

## 2. 配置 (Configuration)

### 2.1 全局配置 (app.json)

决定页面文件的路径、窗口表现、设置网络超时时间、设置多 tab 等。

```json
{
  "pages": ["pages/index/index", "pages/logs/logs"],
  "window": {
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "微信接口功能演示",
    "backgroundColor": "#eeeeee",
    "backgroundTextStyle": "light",
    "enablePullDownRefresh": false
  },
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#1AAD19",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/home.png",
        "selectedIconPath": "images/home_active.png"
      },
      {
        "pagePath": "pages/logs/logs",
        "text": "日志",
        "iconPath": "images/log.png",
        "selectedIconPath": "images/log_active.png"
      }
    ]
  },
  "networkTimeout": {
    "request": 10000,
    "downloadFile": 10000
  },
  "debug": true
}
```

### 2.2 页面配置 (page.json)

每一个小程序页面也可以使用 `.json` 文件来对本页面的窗口表现进行配置。页面中配置项在当前页面会覆盖 `app.json` 的 `window` 中相同的配置项。

```json
{
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "navigationBarTitleText": "当前页标题",
  "backgroundColor": "#eeeeee",
  "backgroundTextStyle": "light",
  "enablePullDownRefresh": true,
  "onReachBottomDistance": 50,
  "usingComponents": {
    "van-button": "@vant/weapp/button/index"
  }
}
```

## 3. 常见问题 (FAQ)

### 3.1 onLoad 和 onShow 的区别？

- **onLoad**: 页面加载时触发，只触发一次。适合做初始化操作，如获取路由参数。
- **onShow**: 页面显示时触发，每次切换页面显示都会触发。适合做数据实时更新。

### 3.2 父子组件生命周期执行顺序？

1. 父 onLoad
2. 父 onShow
3. 子 created
4. 子 attached
5. 子 ready
6. 父 onReady
