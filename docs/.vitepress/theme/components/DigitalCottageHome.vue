<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { withBase } from "vitepress";

type DayPeriod = "morning" | "day" | "evening" | "night";

const props = withDefaults(
  defineProps<{
    morningBackground?: string;
    dayBackground?: string;
    eveningBackground?: string;
    nightBackground?: string;
  }>(),
  {
    morningBackground: "/images/time/morning-2k.webp",
    dayBackground: "/images/time/day-2k.webp",
    eveningBackground: "/images/time/evening-2k.webp",
    nightBackground: "/images/time/night-2k.webp",
  },
);

const period = ref<DayPeriod>("evening");
let periodTimer: ReturnType<typeof setInterval> | undefined;

const periodMeta: Record<DayPeriod, { greeting: string; label: string }> = {
  morning: { greeting: "早上好，愿今天的思考清晰而有光", label: "晨间" },
  day: { greeting: "日间正好，愿每一步探索都落到真实问题里", label: "日间" },
  evening: { greeting: "晚上好，欢迎在一天将暮时停一停", label: "黄昏" },
  night: { greeting: "夜深了，也请给好奇心留一盏灯", label: "夜间" },
};

const backgroundImage = computed(() => `url('${withBase(props[`${period.value}Background`])}')`);

function updatePeriod() {
  const hour = Number(
    new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      hour: "2-digit",
      hour12: false,
    }).format(new Date()),
  );

  period.value =
    hour >= 5 && hour < 10
      ? "morning"
      : hour >= 10 && hour < 17
        ? "day"
        : hour >= 17 && hour < 21
          ? "evening"
          : "night";
}

onMounted(() => {
  updatePeriod();
  periodTimer = setInterval(updatePeriod, 60_000);
});

onBeforeUnmount(() => {
  if (periodTimer) clearInterval(periodTimer);
});

const identities = [
  { code: "01", title: "科研学术", detail: "中国科学院大学 · 人工智能学院博士在读" },
  { code: "02", title: "技术实践", detail: "山甲实验室 · 技术负责人" },
  { code: "03", title: "长期创造", detail: "CardioMind AI · 发起人" },
];

const researchTracks = [
  { index: "R.01", title: "医学多模态模型", text: "面向真实医疗场景，探索跨模态信息的理解、对齐与协同。" },
  { index: "R.02", title: "基础大模型开发", text: "记录从模型设计、训练实践到工程落地的完整研究过程。" },
  { index: "R.03", title: "时空病理基模", text: "研究病理信息在空间、时间与多尺度语境下的统一表征。" },
];

const platforms = [
  { eyebrow: "LAB", title: "山甲实验室", text: "技术、项目与团队共同成长的实践现场。", status: "进入介绍", href: "/lab/" },
  { eyebrow: "AI", title: "CardioMind AI", text: "关于医学智能的长期构想、产品与行动。", status: "进入介绍", href: "/cardiomind/" },
  { eyebrow: "PUBLICATION", title: "公众号", text: "更轻量的研究观察、阶段复盘与生活随笔。", status: "入口筹备中", href: "/network/" },
  { eyebrow: "KNOWLEDGE", title: "知乎", text: "系统回答医学 AI、读博与技术成长中的问题。", status: "入口筹备中", href: "/network/" },
];

const contentMap = [
  { number: "A", title: "博士手记", text: "选择、困惑、成长与阶段复盘", href: "/phd/" },
  { number: "B", title: "研究现场", text: "论文阅读、实验思考与方法沉淀", href: "/research/" },
  { number: "C", title: "心路历程", text: "身份变化、责任与长期主义", href: "/journey/" },
  { number: "D", title: "山甲实验室", text: "团队建设、技术路线与实践现场", href: "/lab/" },
  { number: "E", title: "CardioMind AI", text: "医学智能愿景、项目与创业过程", href: "/cardiomind/" },
  { number: "F", title: "内容矩阵", text: "博客、公众号、知乎与未来平台", href: "/network/" },
  { number: "G", title: "小屋日常", text: "生活、阅读和那些缓慢发生的改变", href: "/life/" },
];
</script>

<template>
  <main
    class="cottage-home"
    :class="`is-${period}`"
    :data-period="period"
    :style="{ '--cottage-hero-image': backgroundImage }"
  >
    <section class="hero" aria-labelledby="cottage-title">
      <div class="hero__image" aria-hidden="true"></div>
      <div class="hero__veil" aria-hidden="true"></div>
      <div class="signal-field" aria-hidden="true">
        <i v-for="index in 12" :key="index" :style="{ '--signal-index': index }"></i>
      </div>

      <div class="hero__frame">
        <div class="hero__topline">
          <span class="availability"><i></i> OPEN FOR THOUGHTFUL CONNECTIONS</span>
          <span class="time-label">北京时间 · {{ periodMeta[period].label }}</span>
        </div>

        <div class="hero__content">
          <p class="hero__kicker">JUNJIE'S DIGITAL COTTAGE · 2026</p>
          <h1 id="cottage-title">欢迎来到<br />俊杰的小屋</h1>
          <p class="hero__intro">
            一处连接医学人工智能、博士旅程与真实生活的数字空间。<br />
            在这里，研究不是冷冰冰的结论，而是一段有温度的长期探索。
          </p>
          <p class="hero__greeting">{{ periodMeta[period].greeting }}</p>

          <div class="hero__actions">
            <a class="action action--primary" href="#content-map">
              开始阅读
              <span aria-hidden="true">↘</span>
            </a>
            <a class="action action--quiet" href="#collaboration">聊聊合作</a>
          </div>
        </div>

        <div class="companion" aria-label="小屋 AI 同伴概念入口，即将开放">
          <div class="companion__orbit" aria-hidden="true">
            <i></i><i></i><i></i>
          </div>
          <div>
            <span>AI COMPANION · PREVIEW</span>
            <strong>小屋同伴正在学习中</strong>
          </div>
        </div>

        <a class="scroll-cue" href="#identity" aria-label="向下浏览身份与内容">
          <span>SCROLL TO EXPLORE</span><i aria-hidden="true"></i>
        </a>
      </div>
    </section>

    <section id="identity" class="identity-section section-shell" aria-labelledby="identity-title">
      <header class="section-heading">
        <p>IDENTITY / 不是标签，是彼此连接的路径</p>
        <h2 id="identity-title">在研究、技术与创造之间</h2>
      </header>
      <div class="identity-rail">
        <article v-for="item in identities" :key="item.code" class="identity-item">
          <span>{{ item.code }}</span>
          <div><h3>{{ item.title }}</h3><p>{{ item.detail }}</p></div>
        </article>
      </div>
    </section>

    <section class="research-section section-shell" aria-labelledby="research-title">
      <header class="section-heading section-heading--split">
        <div><p>RESEARCH / CURRENT FOCUS</p><h2 id="research-title">正在深入的研究方向</h2></div>
        <p class="section-note">把复杂问题拆开，也把不同世界重新连接起来。</p>
      </header>
      <div class="research-grid">
        <article v-for="track in researchTracks" :key="track.index" class="research-card">
          <span>{{ track.index }}</span>
          <div class="research-card__node" aria-hidden="true"></div>
          <h3>{{ track.title }}</h3>
          <p>{{ track.text }}</p>
        </article>
      </div>
    </section>

    <section class="platform-section" aria-labelledby="platform-title">
      <div class="section-shell">
        <header class="section-heading section-heading--split">
          <div><p>ECOSYSTEM / CONNECTED WORK</p><h2 id="platform-title">正在生长的平台与社区</h2></div>
          <p class="section-note">未来，这些入口会连接团队、产品、内容与公开交流。</p>
        </header>
        <div class="platform-grid">
          <component
            :is="platform.href ? 'a' : 'div'"
            v-for="platform in platforms"
            :key="platform.title"
            class="platform-card"
            :class="{ 'is-disabled': !platform.href }"
            :href="platform.href ? withBase(platform.href) : undefined"
            :aria-disabled="!platform.href || undefined"
          >
            <span class="platform-card__eyebrow">{{ platform.eyebrow }}</span>
            <h3>{{ platform.title }}</h3>
            <p>{{ platform.text }}</p>
            <span class="platform-card__status"><i></i>{{ platform.status }}</span>
          </component>
        </div>
      </div>
    </section>

    <section id="content-map" class="content-section section-shell" aria-labelledby="content-title">
      <header class="section-heading">
        <p>CONTENT MAP / FIND YOUR PATH</p>
        <h2 id="content-title">从哪一扇门进入？</h2>
      </header>
      <nav class="content-map" aria-label="博客内容分区">
        <a v-for="item in contentMap" :key="item.number" :href="withBase(item.href)" class="content-row">
          <span class="content-row__number">{{ item.number }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
          <span class="content-row__arrow" aria-hidden="true">↗</span>
        </a>
      </nav>
    </section>

    <section id="collaboration" class="collaboration-section" aria-labelledby="collaboration-title">
      <div class="section-shell collaboration-grid">
        <div>
          <p class="collaboration-section__eyebrow">COLLABORATION / LET IDEAS MEET</p>
          <h2 id="collaboration-title">如果你也在思考<br />医学与 AI 的下一步</h2>
        </div>
        <div class="collaboration-copy">
          <p>欢迎交流学术研究、医学多模态、基础模型、技术共创与青年科研成长。</p>
          <div class="collaboration-actions">
            <a href="https://github.com/Carmin-Lab" target="_blank" rel="noopener noreferrer">GitHub <span>↗</span></a>
            <a :href="withBase('/collaboration/')">合作与联系 <span>↗</span></a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.cottage-home {
  --ink: #302a28;
  --muted: #6f625d;
  --paper: #f7f2ea;
  --paper-deep: #eee5da;
  --line: rgba(73, 55, 48, 0.18);
  --ember: #bd674b;
  --ember-dark: #8d4434;
  --night-ink: #f6eee6;
  color: var(--ink);
  background: var(--paper);
  font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  overflow: clip;
}

.hero {
  position: relative;
  min-height: min(860px, 100svh);
  color: var(--night-ink);
  isolation: isolate;
  background: #382a28;
}

.hero__image,
.hero__veil,
.signal-field { position: absolute; inset: 0; }

.hero__image {
  z-index: -3;
  background-image: var(--cottage-hero-image);
  background-position: center;
  background-size: cover;
  transform: scale(1.015);
  animation: breathe 18s ease-in-out infinite alternate;
}

.hero__veil {
  z-index: -2;
  background: rgba(25, 20, 20, 0.52);
  box-shadow: inset 0 -180px 150px rgba(18, 14, 14, 0.43), inset 45vw 0 180px rgba(25, 17, 17, 0.28);
}

.is-morning .hero__veil { background: rgba(52, 38, 31, 0.38); }
.is-day .hero__veil { background: rgba(31, 35, 38, 0.43); }
.is-evening .hero__veil { background: rgba(37, 24, 28, 0.48); }
.is-night .hero__veil { background: rgba(15, 20, 31, 0.58); }

.signal-field { z-index: -1; overflow: hidden; opacity: 0.48; }
.signal-field i {
  --x: calc((var(--signal-index) * 8.1%) - 5%);
  position: absolute;
  left: var(--x);
  top: calc(20% + (var(--signal-index) * 3%));
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #ffd9b7;
  box-shadow: 0 0 14px 3px rgba(255, 191, 142, 0.4);
  animation: drift calc(7s + var(--signal-index) * 0.4s) ease-in-out infinite alternate;
}

.hero__frame,
.section-shell {
  width: min(1180px, calc(100% - 48px));
  margin-inline: auto;
}

.hero__frame { position: relative; min-height: min(860px, 100svh); padding: 100px 0 44px; display: flex; flex-direction: column; }
.hero__topline { display: flex; justify-content: space-between; gap: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 244, 232, 0.3); font: 600 0.68rem/1.4 ui-monospace, monospace; letter-spacing: 0.12em; }
.availability, .time-label { display: inline-flex; align-items: center; gap: 9px; }
.availability i { width: 6px; height: 6px; border-radius: 50%; background: #ffb184; box-shadow: 0 0 0 4px rgba(255, 177, 132, 0.15); animation: pulse 2.2s ease-in-out infinite; }
.hero__content { margin-block: auto; padding: 70px 0 54px; max-width: 760px; }
.hero__kicker, .section-heading > p, .section-heading > div > p, .collaboration-section__eyebrow { margin: 0 0 18px; font: 650 0.72rem/1.4 ui-monospace, monospace; letter-spacing: 0.18em; color: var(--ember); }
.hero__kicker { color: #f1b695; }
.hero h1 { margin: 0; max-width: 720px; font-family: "Noto Serif SC", "Songti SC", serif; font-size: clamp(3.2rem, 7vw, 6.5rem); font-weight: 600; line-height: 1.07; letter-spacing: -0.04em; text-wrap: balance; }
.hero__intro { max-width: 620px; margin: 32px 0 0; font-size: clamp(1rem, 1.25vw, 1.14rem); line-height: 2; color: rgba(255, 247, 239, 0.86); }
.hero__greeting { margin: 14px 0 0; font-family: "Noto Serif SC", serif; color: #f1c2a7; }
.hero__actions { display: flex; gap: 12px; margin-top: 36px; }
.action { min-height: 48px; padding: 0 20px; display: inline-flex; align-items: center; justify-content: center; gap: 34px; border: 1px solid rgba(255, 244, 232, 0.42); color: #fff8f0; text-decoration: none; font-weight: 650; transition: background-color .25s, border-color .25s, transform .25s; }
.action--primary { background: #a6533d; border-color: #a6533d; }
.action:hover { transform: translateY(-2px); border-color: #f2c2a5; background-color: rgba(255, 248, 240, 0.11); }
.action--primary:hover { background-color: #8f4433; }

.companion { position: absolute; right: 0; bottom: 105px; display: flex; align-items: center; gap: 16px; padding: 12px 16px 12px 12px; border: 1px solid rgba(255, 242, 229, 0.26); background: rgba(28, 22, 23, 0.5); backdrop-filter: blur(14px); }
.companion__orbit { position: relative; width: 48px; height: 48px; border: 1px solid rgba(255, 205, 171, 0.38); border-radius: 50%; animation: rotate 12s linear infinite; }
.companion__orbit::after { content: ""; position: absolute; inset: 15px; border-radius: 50%; background: #e58d68; box-shadow: 0 0 18px rgba(229, 141, 104, 0.75); }
.companion__orbit i { position: absolute; width: 4px; height: 4px; border-radius: 50%; background: #fff0e1; }
.companion__orbit i:first-child { left: -2px; top: 22px; }.companion__orbit i:nth-child(2) { right: 4px; top: 4px; }.companion__orbit i:last-child { left: 22px; bottom: -2px; }
.companion span { display: block; font: 600 .6rem/1.4 ui-monospace, monospace; letter-spacing: .12em; color: #e6b99f; }
.companion strong { display: block; margin-top: 4px; font-size: .85rem; font-weight: 550; }
.scroll-cue { align-self: flex-start; display: flex; align-items: center; gap: 14px; color: rgba(255, 246, 236, .7); text-decoration: none; font: 600 .62rem/1 ui-monospace, monospace; letter-spacing: .14em; }
.scroll-cue i { width: 52px; height: 1px; background: currentColor; transform-origin: left; animation: scan 2.5s ease-in-out infinite; }

.identity-section, .research-section, .content-section { padding-block: clamp(80px, 10vw, 140px); }
.section-heading { margin-bottom: 46px; }
.section-heading h2 { margin: 0; font-family: "Noto Serif SC", "Songti SC", serif; font-size: clamp(2rem, 4vw, 3.65rem); font-weight: 550; letter-spacing: -.035em; line-height: 1.25; }
.section-heading--split { display: flex; justify-content: space-between; align-items: flex-end; gap: 48px; }
.section-note { max-width: 350px; margin: 0; color: var(--muted); line-height: 1.85; }
.identity-rail { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.identity-item { display: grid; grid-template-columns: auto 1fr; gap: 22px; padding: 30px 28px; border-right: 1px solid var(--line); }
.identity-item:last-child { border-right: 0; }
.identity-item > span, .research-card > span { color: var(--ember); font: 600 .7rem/1.5 ui-monospace, monospace; letter-spacing: .12em; }
.identity-item h3, .research-card h3, .platform-card h3, .content-row h3 { margin: 0; font-size: 1.15rem; }
.identity-item p { margin: 7px 0 0; color: var(--muted); font-size: .9rem; line-height: 1.7; }

.research-section { padding-top: 20px; }
.research-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); }
.research-card { position: relative; min-height: 330px; padding: 28px; background: var(--paper); overflow: hidden; transition: background-color .25s, transform .25s; }
.research-card:hover { z-index: 1; background: #fffaf4; transform: translateY(-4px); }
.research-card__node { width: 92px; height: 92px; margin: 42px auto 46px; border: 1px solid rgba(189, 103, 75, .36); border-radius: 50%; box-shadow: inset 0 0 0 18px rgba(189, 103, 75, .035), 0 0 0 12px rgba(189, 103, 75, .025); }
.research-card__node::after { content: ""; display: block; width: 9px; height: 9px; margin: 40px auto; border-radius: 50%; background: var(--ember); box-shadow: 0 0 16px rgba(189, 103, 75, .6); }
.research-card h3 { font-family: "Noto Serif SC", serif; font-size: 1.35rem; }
.research-card p { margin: 13px 0 0; color: var(--muted); line-height: 1.8; font-size: .92rem; }

.platform-section { padding-block: clamp(80px, 10vw, 140px); background: #282321; color: #f6eee7; }
.platform-section .section-heading h2 { color: #fff8f1; }
.platform-section .section-note { color: #baaaa1; }
.platform-grid { display: grid; grid-template-columns: repeat(2, 1fr); border-top: 1px solid rgba(255,255,255,.14); }
.platform-card { min-height: 230px; padding: 30px 28px; color: inherit; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,.14); }
.platform-card:nth-child(odd) { border-right: 1px solid rgba(255,255,255,.14); }
.platform-card__eyebrow { color: #d99678; font: 600 .66rem/1.4 ui-monospace, monospace; letter-spacing: .16em; }
.platform-card h3 { margin-top: 46px; font-family: "Noto Serif SC", serif; font-size: 1.55rem; }
.platform-card p { max-width: 410px; color: #bdaea6; line-height: 1.75; }
.platform-card__status { display: inline-flex; align-items: center; gap: 8px; margin-top: 12px; color: #d8c8bf; font-size: .75rem; }
.platform-card__status i { width: 5px; height: 5px; background: #a85f49; border-radius: 50%; }
.platform-card.is-disabled { cursor: not-allowed; }

.content-map { border-top: 1px solid var(--line); }
.content-row { display: grid; grid-template-columns: 46px minmax(140px, .6fr) 1fr auto; align-items: center; gap: 24px; padding: 26px 8px; color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--line); transition: padding .25s, background-color .25s; }
.content-row:hover { padding-inline: 20px; background: #fffaf4; }
.content-row__number { font: 650 .75rem/1 ui-monospace, monospace; color: var(--ember); }
.content-row h3 { font-family: "Noto Serif SC", serif; font-size: 1.25rem; }
.content-row p { margin: 0; color: var(--muted); }
.content-row__arrow { font-size: 1.2rem; }

.collaboration-section { padding-block: clamp(76px, 9vw, 120px); color: #fff6ed; background: #9d4f3b; }
.collaboration-grid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 80px; align-items: end; }
.collaboration-section__eyebrow { color: #f6c1a7; }
.collaboration-section h2 { margin: 0; font-family: "Noto Serif SC", serif; font-size: clamp(2.1rem, 4vw, 4rem); font-weight: 500; line-height: 1.28; }
.collaboration-copy > p { max-width: 460px; margin: 0; color: #f2d9cc; line-height: 1.9; }
.collaboration-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
.collaboration-actions a, .disabled-contact { min-height: 44px; padding: 0 17px; display: inline-flex; align-items: center; gap: 26px; border: 1px solid rgba(255,255,255,.42); color: #fff; text-decoration: none; font-weight: 600; }
.collaboration-actions a:hover { background: rgba(255,255,255,.12); }
.disabled-contact { color: rgba(255,255,255,.64); cursor: not-allowed; }

@keyframes breathe { from { transform: scale(1.015); } to { transform: scale(1.055); } }
@keyframes drift { from { transform: translate3d(0, 12px, 0); opacity: .18; } to { transform: translate3d(22px, -26px, 0); opacity: .9; } }
@keyframes pulse { 50% { opacity: .45; box-shadow: 0 0 0 8px rgba(255,177,132,.06); } }
@keyframes rotate { to { transform: rotate(1turn); } }
@keyframes scan { 50% { transform: scaleX(.35); opacity: .45; } }

@media (max-width: 900px) {
  .companion { position: static; align-self: flex-end; margin-top: -72px; }
  .identity-rail, .research-grid { grid-template-columns: 1fr; }
  .identity-item { border-right: 0; border-bottom: 1px solid var(--line); }
  .identity-item:last-child { border-bottom: 0; }
  .research-card { min-height: 260px; }
  .research-card__node { float: right; margin: 20px 10px 20px 30px; }
  .section-heading--split, .collaboration-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
}

@media (max-width: 640px) {
  .hero__frame, .section-shell { width: min(100% - 32px, 1180px); }
  .hero__frame { min-height: 760px; padding-top: 82px; padding-bottom: 30px; }
  .hero__topline { align-items: flex-start; }
  .time-label { display: none; }
  .hero__content { padding: 76px 0 105px; }
  .hero h1 { font-size: clamp(2.85rem, 15vw, 4.3rem); }
  .hero__intro br { display: none; }
  .hero__actions { align-items: stretch; flex-direction: column; max-width: 280px; }
  .companion { align-self: flex-start; margin: -90px 0 30px; }
  .scroll-cue { display: none; }
  .identity-item { padding-inline: 8px; }
  .platform-grid { grid-template-columns: 1fr; }
  .platform-card:nth-child(odd) { border-right: 0; }
  .content-row { grid-template-columns: 32px 1fr auto; gap: 12px; }
  .content-row p { grid-column: 2 / -1; font-size: .88rem; }
  .collaboration-section h2 br { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hero__image, .signal-field i, .availability i, .companion__orbit, .scroll-cue i { animation: none !important; }
  .action, .research-card, .content-row { transition: none !important; }
}
</style>
