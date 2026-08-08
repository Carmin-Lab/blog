import { defineConfig } from "vitepress";
import { teekConfig } from "./teekConfig";

export default defineConfig({
  extends: teekConfig,
  base: "/blog/",
  lang: "zh-CN",
  title: "庞俊杰 · 数字小屋",
  description: "连接医学人工智能、博士旅程、团队实践、创业探索与真实生活",
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: "https://carmin-lab.github.io/blog/",
  },
  head: [
    ["meta", { name: "theme-color", content: "#6d3e35" }],
    ["meta", { name: "author", content: "Junjie Pang" }],
    ["link", { rel: "icon", href: "/blog/images/carmin-avatar.png" }],
  ],
  markdown: {
    lineNumbers: true,
    math: true,
    image: {
      lazyLoading: true,
    },
  },
  themeConfig: {
    logo: "/images/carmin-avatar.png",
    nav: [
      { text: "首页", link: "/" },
      {
        text: "研究与博士",
        items: [
          { text: "研究现场", link: "/research/" },
          { text: "博士旅程", link: "/phd/" },
          { text: "项目实践", link: "/projects/" },
          { text: "全部文章", link: "/articles" },
          { text: "时间归档", link: "/archives" },
        ],
      },
      {
        text: "团队与平台",
        items: [
          { text: "山甲实验室", link: "/lab/" },
          { text: "CardioMind AI", link: "/cardiomind/" },
          { text: "内容矩阵", link: "/network/" },
        ],
      },
      {
        text: "经历与生活",
        items: [
          { text: "心路历程", link: "/journey/" },
          { text: "生活随笔", link: "/life/" },
          { text: "关于俊杰", link: "/about/" },
        ],
      },
      { text: "合作", link: "/collaboration/" },
      { text: "个人主页", link: "https://carmin-lab.github.io/" },
    ],
    socialLinks: [
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.57-.29-5.27-1.28-5.27-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.96 10.96 0 0 1 5.76 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.23 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.71 5.39-5.28 5.68.42.36.78 1.06.78 2.14v3.17c0 .31.21.67.79.56A11.5 11.5 0 0 0 12 .7Z"/></svg>',
        },
        link: "https://github.com/Carmin-Lab",
        ariaLabel: "Carmin-Lab GitHub",
      },
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
