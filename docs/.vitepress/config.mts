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
          { text: "Typescript", link: "/typescript/" },
          { text: "Html5", link: "/html5/" },
          { text: "Css3", link: "/css3/" },
        ],
      },
      {
        text: "框架生态",
        items: [
          { text: "Vue3", link: "/vue3/" },
          { text: "React", link: "/react/" },
          { text: "小程序", link: "/miniprogram/" },
        ],
      },
      {
        text: "工程化",
        items: [
          { text: "Vite", link: "/vite/" },
          { text: "Webpack", link: "/webpack/" },
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
                text: "var let const的区别",
                link: "/javascript/components/constLetVar",
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
          { text: "Typescript", link: "/typescript/" },
          { text: "Html5", link: "/html5/" },
          { text: "Css3", link: "/css3/" },
        ],
      },
      {
        text: "框架生态",
        items: [
          { text: "Vue3", link: "/vue3/" },
          { text: "React", link: "/react/" },
          { text: "小程序", link: "/miniprogram/" },
        ],
      },
      {
        text: "工程化",
        items: [
          { text: "Vite", link: "/vite/" },
          { text: "Webpack", link: "/webpack/" },
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
