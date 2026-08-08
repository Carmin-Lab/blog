import Teek from "vitepress-theme-teek";
import type { Theme } from "vitepress";
import { Fragment, defineComponent, h } from "vue";
import "vitepress-theme-teek/index.css";
import "vitepress-theme-teek/theme-chalk/tk-nav-blur.css";
import "vitepress-theme-teek/theme-chalk/tk-doc-fade-in.css";
import CottageAssistant from "./components/CottageAssistant.vue";
import DigitalCottageHome from "./components/DigitalCottageHome.vue";
import "./warm.scss";

const Layout = defineComponent({
  name: "CarminBlogLayout",
  setup() {
    return () => h(Fragment, null, [h(Teek.Layout), h(CottageAssistant)]);
  },
});

export default {
  extends: Teek,
  Layout,
  enhanceApp({ app }) {
    app.component("DigitalCottageHome", DigitalCottageHome);
  },
} satisfies Theme;
