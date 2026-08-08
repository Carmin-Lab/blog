import { defineTeekConfig } from "vitepress-theme-teek/config";

export const teekConfig = defineTeekConfig({
  teekTheme: true,
  teekHome: false,
  loading: "研究笔记加载中…",
  pageStyle: "segment-nav",
  themeSize: "wide",
  sidebarTrigger: true,
  homeCardListPosition: "left",
  banner: {
    enabled: true,
    bgStyle: "fullImg",
    imgSrc: "/images/time/evening-2k.webp",
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
    avatar: "/images/carmin-avatar.png",
    shape: "circle",
    color: "#5a4037",
    status: {
      icon: "🔬",
      size: 22,
      title: "Researching",
    },
  },
  post: {
    postStyle: "list",
    excerptPosition: "top",
    showMore: true,
    moreLabel: "阅读全文 →",
    transition: true,
    defaultCoverImg: [
      "/images/time/morning-2k.webp",
      "/images/time/day-2k.webp",
      "/images/time/evening-2k.webp",
      "/images/time/night-2k.webp",
    ],
  },
  articleBanner: {
    enabled: true,
    showCategory: true,
    showTag: true,
    defaultCoverImg: "/images/time/evening-2k.webp",
  },
  articleAnalyze: {
    showIcon: true,
    showInfo: true,
    showAuthor: true,
    showCreateDate: true,
    showUpdateDate: true,
    showCategory: true,
    showTag: true,
    imageViewer: {
      hideOnClickModal: true,
    },
  },
  articleShare: {
    enabled: true,
    text: "分享这篇记录",
    copiedText: "文章链接已复制",
  },
  articleUpdate: {
    enabled: true,
    limit: 5,
  },
  breadcrumb: {
    enabled: true,
    showCurrentName: true,
    separator: "›",
    homeLabel: "返回小屋",
  },
  articleBottomTip: () => ({
    type: "tip",
    title: "继续交流",
    text: "欢迎围绕医学人工智能、博士成长、团队技术建设与内容共创展开交流。涉及患者数据、未公开成果和团队内部信息的内容不会在公开页面讨论。",
  }),
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
