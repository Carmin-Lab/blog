import { defineTeekConfig } from "vitepress-theme-teek/config";

export const teekConfig = defineTeekConfig({
  teekTheme: true,
  loading: "研究笔记加载中…",
  pageStyle: "segment-nav",
  homeCardListPosition: "left",
  banner: {
    enabled: true,
    bgStyle: "fullImg",
    imgSrc: "/images/junjie-cottage-sunset.jpg",
    imgWaves: true,
    mask: true,
    maskBg: "rgba(39, 24, 31, 0.34)",
    name: "欢迎来到俊杰的小屋",
    description: [
      "这里记录读博、研究与生活",
      "不只写下结果，也珍藏困惑、选择和慢慢发生的改变",
      "愿认真思考的日子，也始终温暖而安静",
    ],
    descStyle: "switch",
    switchTime: 6000,
    textColor: "#fffaf5",
    titleFontSize: "3.4rem",
    descFontSize: "1.15rem",
  },
  blogger: {
    name: "庞俊杰",
    slogan: "博士在读 · 研究与生活的长期记录者",
    avatar: "https://avatars.githubusercontent.com/u/185779486?v=4",
    shape: "circle",
    color: "#5a4037",
    status: {
      icon: "🔬",
      size: 22,
      title: "Researching",
    },
  },
  social: [
    {
      icon: "github",
      name: "GitHub",
      link: "https://github.com/Carmin-Lab",
    },
  ],
  post: {
    postStyle: "list",
    excerptPosition: "top",
    showMore: true,
    moreLabel: "阅读全文 →",
    transition: true,
    defaultCoverImg: [],
  },
  footerInfo: {
    theme: {
      show: true,
      name: "Theme by Teek",
      link: "https://vp.teek.top/",
    },
    copyright: {
      show: true,
      createYear: 2026,
      suffix: "庞俊杰的读博与生活",
    },
  },
  docAnalysis: {
    enabled: true,
    createTime: "2026-08-04",
    wordCount: true,
    readingTime: true,
  },
  codeBlock: {
    enabled: true,
    copiedDone: (message) => message.success("代码已复制"),
  },
  backTop: {
    enabled: true,
    content: "progress",
  },
  author: {
    name: "庞俊杰",
  },
});
