import { defineConfig } from "vitepress";
import { teekConfig } from "./teekConfig";

export default defineConfig({
  extends: teekConfig,
  base: "/blog/",
  lang: "zh-CN",
  title: "庞俊杰 · 读博与生活",
  description: "记录博士旅程、研究成长、项目实践与平静生活",
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: "https://carmin-lab.github.io/blog/",
  },
  head: [
    ["meta", { name: "theme-color", content: "#6d3e35" }],
    ["meta", { name: "author", content: "Junjie Pang" }],
    ["link", { rel: "icon", href: "https://avatars.githubusercontent.com/u/185779486?v=4" }],
  ],
  markdown: {
    lineNumbers: true,
    math: true,
    image: {
      lazyLoading: true,
    },
  },
  themeConfig: {
    logo: "https://avatars.githubusercontent.com/u/185779486?v=4",
    nav: [
      { text: "首页", link: "/" },
      { text: "博士旅程", link: "/phd/" },
      { text: "研究笔记", link: "/research/" },
      { text: "项目实践", link: "/projects/" },
      { text: "生活随笔", link: "/life/" },
      { text: "关于", link: "/about/" },
      { text: "个人主页", link: "https://carmin-lab.github.io/" },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/Carmin-Lab" },
    ],
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索",
            buttonAriaLabel: "搜索文章",
          },
          modal: {
            noResultsText: "没有找到相关内容",
            resetButtonTitle: "清除搜索",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },
    outline: {
      level: [2, 4],
      label: "本页目录",
    },
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    lastUpdated: {
      text: "最后更新",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "short",
      },
    },
  },
});
