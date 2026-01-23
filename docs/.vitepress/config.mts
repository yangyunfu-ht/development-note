import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Markdown Note",
  description: "构建你的前端知识体系",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      {
        text: "前端基础",
        items: [
          { text: "Javascript", link: "/javascript/" },
          {
            text: "Typescript",
            link: "/typescript/",
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
            link: "/vue3/",
          },
          { text: "React", link: "/react/" },
          {
            text: "小程序",
            link: "/miniprogram/",
          },
        ],
      },
      {
        text: "工程化",
        items: [
          { text: "Vite", link: "/vite/" },
          { text: "Webpack", link: "/webpack/" },
          { text: "Prettier", link: "/prettier/" },
          { text: "Eslint", link: "/eslint/" },
          { text: "CommitLint", link: "/commitLint/" },
        ],
      },
    ],

    sidebar: [
      {
        text: "前端基础",
        items: [
          {
            text: "Javascript",
            link: "/javascript/",
            items: [
              {
                text: "var/let/const",
                link: "/javascript/components/constLetVar",
              },
              {
                text: "数据类型 (Data Types)",
                link: "/javascript/components/dataType",
              },
              {
                text: "深拷贝与浅拷贝",
                link: "/javascript/components/deepClone",
              },
              {
                text: "数组方法 (Array Methods)",
                link: "/javascript/components/array",
              },
              {
                text: "变量提升 (Hoisting)",
                link: "/javascript/components/variableLifting",
              },
              {
                text: "原型链 (Prototype Chain)",
                link: "/javascript/components/prototypeChain",
              },
              {
                text: "事件循环 (Event Loop)",
                link: "/javascript/components/eventLoop",
              },
              {
                text: "异步编程 (Promise)",
                link: "/javascript/components/promise",
              },
              {
                text: "手写 Promise (Implement Promise)",
                link: "/javascript/components/implementPromise",
              },
              {
                text: "树形结构操作 (Tree Function)",
                link: "/javascript/components/treeFunction",
              },
              {
                text: "ES6 Class 类",
                link: "/javascript/components/class",
              },
              {
                text: "防抖 (Debounce)",
                link: "/javascript/components/debounce",
              },
              {
                text: "节流 (Throttle)",
                link: "/javascript/components/throttle",
              },
            ],
          },
          {
            text: "Typescript",
            link: "/typescript/",
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
            ],
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
            link: "/vue3/",
            items: [
              {
                text: "Vue2 与 Vue3 区别",
                link: "/vue3/different",
              },
            ],
          },
          { text: "React", link: "/react/" },
          {
            text: "小程序",
            link: "/miniprogram/",
            items: [
              {
                text: "生命周期与配置",
                link: "/miniprogram/LifeCycle",
              },
            ],
          },
        ],
      },
      {
        text: "工程化",
        items: [
          { text: "Vite", link: "/vite/" },
          { text: "Webpack", link: "/webpack/" },
          { text: "Rollup", link: "/rollup/" },
          { text: "Prettier(代码风格)", link: "/prettier/" },
          { text: "Eslint(代码质量)", link: "/eslint/" },
          { text: "CommitLint(git提交规范)", link: "/commitLint/" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],

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
