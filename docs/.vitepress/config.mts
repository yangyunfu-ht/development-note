import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-CN",
  title: "Markdown Note",
  description: "构建你的前端知识体系",
  // TODO: 如果部署到 github pages，请设置 base 为你的仓库名称，例如 "/my-repo/"
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    editLink: {
      pattern: "https://github.com/yangyunfu-ht/development-note.git",
      text: "在 GitHub 上编辑此页",
    },
    nav: [
      { text: "首页", link: "/" },
      {
        text: "前端基础",
        items: [
          { text: "Javascript", link: "/javascript/dataType" },
          {
            text: "Typescript",
            link: "/typescript/tsConfig",
          },
          { text: "Html5", link: "/html5/" },
          { text: "Css3", link: "/css3/" },
        ],
      },
      {
        text: "框架生态",
        items: [
          {
            text: "Vue3",
            link: "/vue3/different",
          },
          { text: "React", link: "/react/" },
          {
            text: "小程序",
            link: "/miniprogram/LifeCycle",
          },
        ],
      },
      {
        text: "工程化",
        items: [
          { text: "Vite", link: "/vite/config" },
          { text: "npm run dev/build 详解", link: "/what/npmRundev" },
          { text: "Webpack", link: "/webpack/config" },
          { text: "Prettier", link: "/prettier/" },
          { text: "Eslint", link: "/eslint/" },
          { text: "CommitLint", link: "/commitLint/" },
        ],
      },
      {
        text: "场景与原理",
        items: [{ text: "浏览器原理", link: "/scene/browser" }],
      },
    ],

    sidebar: [
      {
        text: "前端基础",
        items: [
          {
            text: "Javascript",
            link: "/javascript/dataType",
            collapsed: true,
            items: [
              {
                text: "数据类型 (Data Types)",
                link: "/javascript/dataType",
              },
              {
                text: "var/let/const",
                link: "/javascript/constLetVar",
              },
              {
                text: "变量提升 (Hoisting)",
                link: "/javascript/variableLifting",
              },
              {
                text: "闭包 (Closure)",
                link: "/javascript/closure",
              },
              {
                text: "箭头函数 (Arrow Function)",
                link: "/javascript/arrow",
              },
              {
                text: "数组方法 (Array Methods)",
                link: "/javascript/array",
              },
              {
                text: "Math 对象与精度问题",
                link: "/javascript/math",
              },
              {
                text: "深拷贝与浅拷贝",
                link: "/javascript/deepClone",
              },
              {
                text: "原型链 (Prototype Chain)",
                link: "/javascript/prototypeChain",
              },
              {
                text: "call/apply/bind 区别",
                link: "/javascript/callApplyBind",
              },
              {
                text: "this 指向详解",
                link: "/javascript/this",
              },
              {
                text: "事件循环 (Event Loop)",
                link: "/javascript/eventLoop",
              },
              {
                text: "异步编程 (Promise)",
                link: "/javascript/promise",
              },
              {
                text: "手写 Promise (Implement Promise)",
                link: "/javascript/implementPromise",
              },
              {
                text: "树形结构操作 (Tree Function)",
                link: "/javascript/treeFunction",
              },
              {
                text: "ES6 Class 类",
                link: "/javascript/class",
              },
              {
                text: "防抖 (Debounce)",
                link: "/javascript/debounce",
              },
              {
                text: "节流 (Throttle)",
                link: "/javascript/throttle",
              },
              {
                text: "高频手写题 (Handwritten Code)",
                link: "/javascript/code",
              },
              {
                text: "发布订阅模式 (Pub/Sub)",
                link: "/javascript/eventMitter",
              },
              {
                text: "观察者模式 (Observer Pattern)",
                link: "/javascript/observeEmitter",
              },
            ],
          },
          {
            text: "Typescript",
            link: "/typescript/tsConfig",
            collapsed: true,
            items: [
              {
                text: "TS 配置详解 (tsconfig)",
                link: "/typescript/tsConfig",
              },
              {
                text: "TS 应用配置 (tsconfig.app)",
                link: "/typescript/tsAppConfig",
              },
              {
                text: "TS Node 配置 (tsconfig.node)",
                link: "/typescript/tsNodeConfig",
              },
              {
                text: "TS 内置类型 (Built-in Types)",
                link: "/typescript/buildInTypes",
              },
              {
                text: "TS 增量编译详解",
                link: "/typescript/IncrementalCompilation",
              },
              {
                text: "TypeScript 高频面试题",
                link: "/typescript/code",
              },
            ],
          },
          {
            text: "Html5",
            link: "/html5/tag",
            collapsed: true,
            items: [
              {
                text: "HTML5 新特性",
                link: "/html5/tag",
              },
              {
                text: "DOM 事件机制",
                link: "/html5/event",
              },
              {
                text: "HTML5 高频面试题",
                link: "/html5/code",
              },
            ],
          },
          {
            text: "Css3",
            link: "/css3/flex",
            collapsed: true,
            items: [
              {
                text: "CSS3 新特性一览",
                link: "/css3/",
              },
              {
                text: "选择器权重 (Specificity)",
                link: "/css3/selectorWeight",
              },
              {
                text: ":is() 与 :where()",
                link: "/css3/whersIs",
              },
              {
                text: "Flex 布局详解",
                link: "/css3/flex",
              },
              {
                text: "水平垂直居中方案",
                link: "/css3/center",
              },
              {
                text: "CSS 盒模型",
                link: "/css3/box",
              },
              {
                text: "BFC 详解",
                link: "/css3/bfc",
              },
              {
                text: "CSS 高频面试题",
                link: "/css3/code",
              },
            ],
          },
        ],
      },
      {
        text: "框架生态",
        items: [
          {
            text: "Vue3",
            link: "/vue3/different",
            collapsed: true,
            items: [
              {
                text: "Vue2 与 Vue3 区别",
                link: "/vue3/different",
              },
              {
                text: "Vue3 组合式 API 详解",
                link: "/vue3/setupApi",
              },
              {
                text: "Vue3 组件通信汇总",
                link: "/vue3/componentPost",
              },
              {
                text: "Vue3 nextTick 原理",
                link: "/vue3/nextTick",
              },
              {
                text: "Vue2 数组响应式原理",
                link: "/vue3/vue2Array",
              },
              {
                text: "Vue3 KeepAlive 缓存",
                link: "/vue3/keepAlive",
              },
              {
                text: "Vue3 高频面试题",
                link: "/vue3/interview",
              },
            ],
          },
          {
            text: "React",
            link: "/react/functionClass",
            collapsed: true,
            items: [
              {
                text: "函数式组件 vs 类组件",
                link: "/react/functionClass",
              },
              {
                text: "React Hooks 详解",
                link: "/react/hook",
              },
              {
                text: "React 组件通信汇总",
                link: "/react/componentPost",
              },
              {
                text: "React 高频面试题",
                link: "/react/code",
              },
              {
                text: "请求竞态 (Race Condition)",
                link: "/react/requestCompetition",
              },
            ],
          },
          {
            text: "小程序",
            link: "/miniprogram/LifeCycle",
            collapsed: true,
            items: [
              {
                text: "生命周期与配置",
                link: "/miniprogram/LifeCycle",
              },
              {
                text: "小程序高频面试题",
                link: "/miniprogram/code",
              },
            ],
          },
        ],
      },
      {
        text: "工程化",
        link: "/what/",
        collapsed: true,
        items: [
          { text: "什么是前端工程化", link: "/what/" },
          { text: "JS 模块化发展历程", link: "/what/jsModule" },
          { text: "前端性能优化体系", link: "/what/performance" },
          { text: "SPA 首屏优化 (FCP)", link: "/what/FCP" },
          { text: "SEO 与 SPA 优化", link: "/what/seo" },
          { text: "虚拟 DOM 详解", link: "/what/virtualDom" },
          { text: "esm、umd、cmd区别", link: "/what/esmUmdCmd" },
          { text: "monorepo(单体仓库)", link: "/what/monorepo" },
          { text: "Tree Shaking 详解", link: "/what/treeShaking" },
          { text: "修改 npm 包代码", link: "/what/npm" },
          { text: "package.json 详解", link: "/what/package" },
          { text: "移动端适配方案", link: "/what/mobile" },
          { text: "懒加载 (Lazy Load)", link: "/what/lazyLoad" },
          {
            text: "React/Vue 跨端原理",
            link: "/what/crossDevelopment",
          },
          { text: "npm run dev/build 详解", link: "/what/npmRundev" },
          {
            text: "Vite",
            link: "/vite/config",
            items: [
              {
                text: "基础配置",
                link: "/vite/config",
              },
              {
                text: "CommonJS 模块处理",
                link: "/vite/resolveCommon",
              },
            ],
          },
          {
            text: "Webpack",
            link: "/webpack/config",
            collapsed: true,
            items: [
              { text: "基础配置", link: "/webpack/config" },
              { text: "Loader 与 Plugin", link: "/webpack/loaderPlugin" },
            ],
          },
          {
            text: "Rollup",
            link: "/rollup/",
            collapsed: true,
            items: [
              { text: "基础概念", link: "/rollup/" },
              { text: "配置详解", link: "/rollup/config" },
            ],
          },
          { text: "Prettier(代码风格)", link: "/prettier/" },
          { text: "Eslint(代码质量)", link: "/eslint/" },
          { text: "CommitLint(git提交规范)", link: "/commitLint/" },
        ],
      },
      {
        text: "浏览器与网络",
        items: [
          {
            text: "浏览器原理",
            link: "/scene/browser",
            collapsed: true,
            items: [
              {
                text: "从输入 URL 到页面渲染",
                link: "/scene/browser",
              },
              {
                text: "浏览器存储详解",
                link: "/scene/storage",
              },
              {
                text: "浏览器兼容性解决方案",
                link: "/scene/legacy",
              },
            ],
          },
          {
            text: "HTTP 协议",
            link: "/http/",
            collapsed: true,
            items: [
              {
                text: "HTTP 状态码详解",
                link: "/http/",
              },
              {
                text: "GET 和 POST 的区别",
                link: "/http/getPost",
              },
              {
                text: "HTTP 请求头详解",
                link: "/http/requestHeader",
              },
            ],
          },
        ],
      },
      {
        text: "代码管理",
        items: [
          {
            text: "Git版本控制",
            link: "/git/",
            collapsed: true,
            items: [
              { text: "常用命令", link: "/git/" },
              { text: "SSH Key 配置", link: "/git/sshKey" },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/yangyunfu-ht/development-note.git",
      },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026-present yyf",
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
  },
});
