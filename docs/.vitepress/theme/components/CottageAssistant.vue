<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useData, useRoute, withBase } from "vitepress";

type CompanionIntent = {
  id: string;
  label: string;
  detail: string;
  href: string;
  icon: string;
  response: string;
};

const { page } = useData();
const route = useRoute();

const isOpen = ref(false);
const isHidden = ref(false);
const isBlinking = ref(false);
const isGreeting = ref(false);
const isGuiding = ref(false);
const isPointerNear = ref(false);
const motionPaused = ref(false);
const prefersReducedMotion = ref(false);
const saveDataEnabled = ref(false);
const pageVisible = ref(true);
const eyeX = ref(0);
const eyeY = ref(0);
const wanderIndex = ref(0);
const greeting = ref("你好，我是小灯。想从小屋的哪一扇门开始？");
const selectedIntent = ref<CompanionIntent | null>(null);

const panelRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const restoreRef = ref<HTMLButtonElement | null>(null);
const openerRef = ref<HTMLElement | null>(null);

let blinkTimer: ReturnType<typeof setTimeout> | undefined;
let blinkEndTimer: ReturnType<typeof setTimeout> | undefined;
let greetingTimer: ReturnType<typeof setTimeout> | undefined;
let guidingTimer: ReturnType<typeof setTimeout> | undefined;
let greetingClock: ReturnType<typeof setInterval> | undefined;
let motionMedia: MediaQueryList | undefined;

const characterImage = withBase("/images/companion/xiaodeng-companion.webp");

const baseIntents: CompanionIntent[] = [
  {
    id: "about",
    label: "第一次来",
    detail: "先认识俊杰和这间小屋",
    href: "/about/",
    icon: "⌂",
    response: "这里连接医学人工智能、博士旅程、团队实践和真实生活。先从俊杰的自我介绍开始，会更容易找到适合你的阅读路径。",
  },
  {
    id: "research",
    label: "看研究方向",
    detail: "医学多模态与基础模型",
    href: "/research/",
    icon: "◇",
    response: "俊杰目前关注医学多模态模型、基础大模型开发，以及时空病理多模态基模。要去研究现场看看吗？",
  },
  {
    id: "phd",
    label: "读博士手记",
    detail: "选择、成长与阶段复盘",
    href: "/phd/",
    icon: "○",
    response: "这里不只整理结果，也记录困惑、方法、失败和慢慢发生的变化。博士旅程适合安静地一篇篇读。",
  },
  {
    id: "lab",
    label: "认识山甲实验室",
    detail: "团队、技术与长期建设",
    href: "/lab/",
    icon: "△",
    response: "山甲实验室是一处把技术路线、项目实践和团队成长放在一起思考的现场。我可以带你去看看它正在建设什么。",
  },
  {
    id: "cardiomind",
    label: "了解 CardioMind AI",
    detail: "医学智能愿景与创业过程",
    href: "/cardiomind/",
    icon: "✦",
    response: "CardioMind AI 记录的是一条仍在生长的医学智能探索线：从愿景，到项目，再到真实世界里的长期行动。",
  },
  {
    id: "latest",
    label: "看最近更新",
    detail: "从最新一篇开始阅读",
    href: "/articles",
    icon: "↗",
    response: "最近更新收在文章列表里。你可以从新到旧浏览，也可以沿分类进入科研、博士生活或项目实践。",
  },
  {
    id: "collaboration",
    label: "寻找合作入口",
    detail: "研究、技术与内容合作",
    href: "/collaboration/",
    icon: "+",
    response: "合作页整理了适合公开讨论的研究、技术和内容方向。涉及患者数据、未公开成果与团队内部信息的内容不会在公开页面交流。",
  },
];

const wanderChoices = [
  {
    href: "/journey/",
    response: "今天的小路通向心路历程。那里写的是身份变化、责任，以及如何在不确定里继续做长期的事。",
  },
  {
    href: "/life/",
    response: "今天的小路通向小屋日常。研究之外，也值得保存阅读、观察和让人重新安静下来的片刻。",
  },
  {
    href: "/projects/",
    response: "今天的小路通向项目实践。可以看看想法如何被拆解、验证，再慢慢落到真实问题里。",
  },
  {
    href: "/archives",
    response: "今天的小路通向时间归档。沿着日期走，也许会遇到一篇刚好适合此刻的记录。",
  },
] as const;

const wanderIntent = computed<CompanionIntent>(() => {
  const choice = wanderChoices[wanderIndex.value];
  return {
    id: "wander",
    label: "随便走走",
    detail: "让小灯挑一条今日小路",
    href: choice.href,
    icon: "≈",
    response: choice.response,
  };
});

const intents = computed(() => [...baseIntents, wanderIntent.value]);
const motionEnabled = computed(
  () =>
    !motionPaused.value &&
    !prefersReducedMotion.value &&
    !saveDataEnabled.value &&
    pageVisible.value &&
    !isHidden.value,
);

const currentContext = computed(() => {
  const title = page.value.title?.trim();
  if (route.path === "/" || !title) {
    return "我会沿着俊杰的不同身份，带你去读科研、博士生活，也看看正在生长的团队与理想。";
  }
  if (route.path.includes("/research/") || route.path.includes("/cardiomind/")) {
    return `你正在读《${title}》。这里分享科研与学习经历，不提供诊疗建议。`;
  }
  return `你正在读《${title}》。需要我带你去同类栏目，还是换一条阅读路径？`;
});

const companionState = computed(() => ({
  "is-open": isOpen.value,
  "is-blinking": isBlinking.value,
  "is-greeting": isGreeting.value,
  "is-guiding": isGuiding.value,
  "is-attentive": isPointerNear.value,
  "is-motion-paused": !motionEnabled.value,
}));

function getBeijingHour() {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Shanghai",
      hour: "2-digit",
      hour12: false,
    }).format(new Date()),
  );
}

function updateGreeting() {
  const hour = getBeijingHour();
  greeting.value =
    hour >= 5 && hour < 10
      ? "早上好，我是小灯。今天想从一个清晰的问题开始吗？"
      : hour >= 10 && hour < 17
        ? "午安。这里收着俊杰的研究、实践与成长记录。"
        : hour >= 17 && hour < 22
          ? "晚上好。先慢一点，选一扇想进入的门吧。"
          : "夜深了，小屋还亮着一盏灯。愿你在这里安静地读一会儿。";
}

function clearBlinkTimers() {
  if (blinkTimer) clearTimeout(blinkTimer);
  if (blinkEndTimer) clearTimeout(blinkEndTimer);
  blinkTimer = undefined;
  blinkEndTimer = undefined;
}

function scheduleBlink() {
  clearBlinkTimers();
  if (!motionEnabled.value) {
    isBlinking.value = false;
    return;
  }
  blinkTimer = setTimeout(
    () => {
      isBlinking.value = true;
      blinkEndTimer = setTimeout(() => {
        isBlinking.value = false;
        scheduleBlink();
      }, 150);
    },
    7_000 + Math.round(Math.random() * 4_000),
  );
}

function resetEyes() {
  eyeX.value = 0;
  eyeY.value = 0;
  isPointerNear.value = false;
}

function handlePointerMove(event: PointerEvent) {
  if (!motionEnabled.value) return;
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
  const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
  eyeX.value = Math.max(-3, Math.min(3, normalizedX * 7));
  eyeY.value = Math.max(-2, Math.min(2, normalizedY * 5));
  isPointerNear.value = true;
}

function playGreeting() {
  if (!motionEnabled.value) return;
  if (greetingTimer) clearTimeout(greetingTimer);
  isGreeting.value = true;
  greetingTimer = setTimeout(() => (isGreeting.value = false), 720);
}

function playGuiding() {
  if (!motionEnabled.value) return;
  if (guidingTimer) clearTimeout(guidingTimer);
  isGuiding.value = true;
  guidingTimer = setTimeout(() => (isGuiding.value = false), 520);
}

async function openPanel() {
  if (document.activeElement instanceof HTMLElement) {
    openerRef.value = document.activeElement;
  }
  isHidden.value = false;
  isOpen.value = true;
  selectedIntent.value = null;
  playGreeting();
  await nextTick();
  panelRef.value?.querySelector<HTMLButtonElement>(".companion-intent")?.focus();
}

function closePanel({ restoreFocus = false } = {}) {
  if (!isOpen.value) return;
  isOpen.value = false;
  selectedIntent.value = null;
  resetEyes();
  if (restoreFocus) {
    nextTick(() => {
      const opener = openerRef.value;
      if (opener?.isConnected) opener.focus();
      else triggerRef.value?.focus();
      openerRef.value = null;
    });
  }
}

function togglePanel() {
  if (isOpen.value) closePanel({ restoreFocus: true });
  else openPanel();
}

function selectIntent(intent: CompanionIntent) {
  selectedIntent.value = intent;
  playGuiding();
}

function toggleMotion() {
  if (prefersReducedMotion.value || saveDataEnabled.value) return;
  motionPaused.value = !motionPaused.value;
}

function hideForSession() {
  closePanel();
  isHidden.value = true;
  resetEyes();
  nextTick(() => restoreRef.value?.focus());
}

function restoreCompanion() {
  isHidden.value = false;
  nextTick(() => {
    triggerRef.value?.focus();
    scheduleBlink();
  });
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && isOpen.value) {
    event.preventDefault();
    closePanel({ restoreFocus: true });
  }
}

function handleVisibilityChange() {
  pageVisible.value = document.visibilityState === "visible";
}

function handleMotionPreference(event: MediaQueryListEvent) {
  prefersReducedMotion.value = event.matches;
}

watch(motionEnabled, scheduleBlink);
watch(
  () => route.path,
  () => closePanel(),
);

onMounted(() => {
  updateGreeting();
  wanderIndex.value = Math.floor((Date.now() + 8 * 3_600_000) / 86_400_000) % wanderChoices.length;
  greetingClock = setInterval(updateGreeting, 60_000);
  pageVisible.value = document.visibilityState === "visible";
  motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
  prefersReducedMotion.value = motionMedia.matches;
  motionMedia.addEventListener("change", handleMotionPreference);
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  saveDataEnabled.value = Boolean(connection?.saveData);
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("cottage-companion:open", openPanel);
  scheduleBlink();
});

onBeforeUnmount(() => {
  clearBlinkTimers();
  if (greetingTimer) clearTimeout(greetingTimer);
  if (guidingTimer) clearTimeout(guidingTimer);
  if (greetingClock) clearInterval(greetingClock);
  motionMedia?.removeEventListener("change", handleMotionPreference);
  document.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("cottage-companion:open", openPanel);
});
</script>

<template>
  <aside class="cottage-assistant" :class="companionState" aria-label="俊杰的小屋本地数字伙伴">
    <Transition name="companion-restore">
      <button
        v-if="isHidden"
        ref="restoreRef"
        class="companion-restore"
        type="button"
        aria-label="重新显示小灯数字伙伴"
        @click="restoreCompanion"
      >
        <span aria-hidden="true">✦</span>
        <span>召回小灯</span>
      </button>
    </Transition>

    <Transition name="companion-panel">
      <section
        v-if="isOpen && !isHidden"
        id="cottage-companion-panel"
        ref="panelRef"
        class="companion-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="cottage-companion-title"
      >
        <header class="companion-panel__header">
          <div>
            <p class="companion-panel__eyebrow">LOCAL COMPANION · AWAKE</p>
            <h2 id="cottage-companion-title">小灯</h2>
            <p class="companion-panel__subtitle">俊杰的小屋数字伙伴</p>
          </div>
          <button class="companion-panel__close" type="button" aria-label="收起小灯" @click="closePanel({ restoreFocus: true })">
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <p class="companion-panel__greeting">{{ greeting }}</p>
        <p class="companion-panel__context">
          <span aria-hidden="true">◌</span>
          {{ currentContext }}
        </p>

        <div class="companion-intents" aria-label="小灯可以带你去的地方">
          <button
            v-for="intent in intents"
            :key="intent.id"
            class="companion-intent"
            :class="{ 'is-selected': selectedIntent?.id === intent.id }"
            type="button"
            @click="selectIntent(intent)"
          >
            <span class="companion-intent__icon" aria-hidden="true">{{ intent.icon }}</span>
            <span>
              <strong>{{ intent.label }}</strong>
              <small>{{ intent.detail }}</small>
            </span>
          </button>
        </div>

        <div class="companion-response" aria-live="polite" aria-atomic="true">
          <template v-if="selectedIntent">
            <p>{{ selectedIntent.response }}</p>
            <a :href="withBase(selectedIntent.href)" @click="closePanel()">
              进入此页
              <span aria-hidden="true">↗</span>
            </a>
          </template>
          <p v-else class="companion-response__hint">选择一条路径，我会先告诉你门后有什么。</p>
        </div>

        <footer class="companion-panel__footer">
          <p>
            <span class="companion-panel__status" aria-hidden="true"></span>
            本地互动 · 不联网 · 不记录
          </p>
          <div class="companion-panel__controls">
            <button type="button" :disabled="prefersReducedMotion || saveDataEnabled" @click="toggleMotion">
              {{ prefersReducedMotion || saveDataEnabled ? "已减少动作" : motionPaused ? "恢复动作" : "暂停动作" }}
            </button>
            <button type="button" @click="hideForSession">本次访问隐藏</button>
          </div>
        </footer>
      </section>
    </Transition>

    <div v-if="!isHidden" class="companion-stage">
      <Transition name="companion-whisper">
        <span v-if="!isOpen && route.path !== '/'" class="companion-whisper">想从哪里开始？</span>
      </Transition>

      <button
        ref="triggerRef"
        class="companion-trigger"
        type="button"
        aria-controls="cottage-companion-panel"
        :aria-expanded="isOpen"
        :aria-label="isOpen ? '收起小灯数字伙伴' : '和小灯数字伙伴打个招呼'"
        :style="{ '--companion-eye-x': `${eyeX}px`, '--companion-eye-y': `${eyeY}px` }"
        @click="togglePanel"
        @pointermove="handlePointerMove"
        @pointerleave="resetEyes"
      >
        <span class="companion-trigger__orbit companion-trigger__orbit--outer" aria-hidden="true"></span>
        <span class="companion-trigger__orbit companion-trigger__orbit--inner" aria-hidden="true"></span>
        <span class="companion-trigger__glow" aria-hidden="true"></span>

        <span class="companion-character" aria-hidden="true">
          <span class="companion-character__body">
            <img
              :src="characterImage"
              alt=""
              width="394"
              height="760"
              decoding="async"
              fetchpriority="low"
            />
            <span class="companion-character__face">
              <span class="companion-character__eyes">
                <span class="companion-character__eye"><i></i></span>
                <span class="companion-character__eye"><i></i></span>
              </span>
              <span class="companion-character__mouth"></span>
            </span>
            <span class="companion-character__hand-signal"></span>
          </span>
        </span>

        <span class="companion-trigger__label">
          <strong>小灯</strong>
          <small>本地数字伙伴</small>
        </span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.cottage-assistant {
  --companion-copper: #c87855;
  --companion-wine: #70413c;
  --companion-ink: #312420;
  --companion-gold: #f3bf6a;
  --companion-sage: #7c9274;
  --companion-line: rgba(112, 65, 60, 0.15);
  position: fixed;
  right: clamp(18px, 2.3vw, 34px);
  bottom: calc(88px + env(safe-area-inset-bottom, 0px));
  z-index: 120;
  color: var(--companion-ink);
  font-family: inherit;
}

.companion-stage {
  position: relative;
  width: 154px;
}

.companion-trigger {
  position: relative;
  display: grid;
  width: 154px;
  min-height: 244px;
  place-items: end center;
  padding: 0 8px 8px;
  overflow: visible;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.companion-trigger::after {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 29px;
  height: 22px;
  border-radius: 50%;
  background: rgba(61, 38, 34, 0.2);
  filter: blur(9px);
  content: "";
  pointer-events: none;
}

.companion-trigger:focus-visible,
.companion-panel button:focus-visible,
.companion-panel a:focus-visible,
.companion-restore:focus-visible {
  outline: 3px solid rgba(200, 120, 85, 0.58);
  outline-offset: 4px;
}

.companion-trigger__glow {
  position: absolute;
  left: 19px;
  bottom: 37px;
  width: 116px;
  height: 116px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(243, 191, 106, 0.22), rgba(200, 120, 85, 0.08) 45%, transparent 70%);
  filter: blur(2px);
  pointer-events: none;
  transition: opacity 180ms ease, transform 220ms ease;
}

.companion-trigger__orbit {
  position: absolute;
  left: 50%;
  bottom: 48px;
  border: 1px solid rgba(200, 120, 85, 0.18);
  border-radius: 50%;
  pointer-events: none;
}

.companion-trigger__orbit::after {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--companion-gold);
  box-shadow: 0 0 13px rgba(243, 191, 106, 0.88);
  content: "";
}

.companion-trigger__orbit--outer {
  width: 142px;
  height: 142px;
  margin-left: -71px;
  animation: companion-orbit 18s linear infinite;
}

.companion-trigger__orbit--outer::after { top: 20px; right: 12px; }

.companion-trigger__orbit--inner {
  width: 98px;
  height: 98px;
  margin-left: -49px;
  border-style: dashed;
  animation: companion-orbit 14s linear infinite reverse;
}

.companion-trigger__orbit--inner::after { left: -3px; top: 46px; width: 4px; height: 4px; }

.companion-character {
  position: absolute;
  left: 19px;
  bottom: 25px;
  width: 116px;
  aspect-ratio: 394 / 760;
  z-index: 2;
  transform-origin: 50% 88%;
  transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 220ms ease;
}

.companion-character__body {
  position: absolute;
  inset: 0;
  display: block;
  transform-origin: 50% 88%;
  animation: companion-breathe 4.8s ease-in-out infinite;
}

.companion-character img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 13px 12px rgba(62, 39, 34, 0.18));
  pointer-events: none;
  user-select: none;
}

.companion-character__face {
  position: absolute;
  left: 29.5%;
  top: 17.3%;
  width: 45%;
  height: 8.2%;
  transform: rotate(-1deg);
  pointer-events: none;
}

.companion-character__eyes {
  position: absolute;
  inset: 0 6% 32%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.companion-character__eye {
  display: grid;
  width: 22%;
  height: 35%;
  min-height: 3px;
  place-items: center;
  transform-origin: center;
  transition: transform 80ms linear;
}

.companion-character__eye i {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: #ffdca0;
  box-shadow: 0 0 6px rgba(255, 190, 102, 0.95), 0 0 13px rgba(255, 155, 91, 0.55);
  transform: translate(var(--companion-eye-x), var(--companion-eye-y));
  transition: transform 80ms linear, width 180ms ease;
}

.companion-character__mouth {
  position: absolute;
  left: 41%;
  bottom: 8%;
  width: 18%;
  height: 10%;
  border-bottom: 1.5px solid rgba(255, 215, 158, 0.9);
  border-radius: 0 0 999px 999px;
  filter: drop-shadow(0 0 3px rgba(255, 171, 103, 0.7));
  transition: width 180ms ease, left 180ms ease, height 180ms ease;
}

.companion-character__hand-signal {
  position: absolute;
  left: 1%;
  top: 35.5%;
  width: 20%;
  height: 10%;
  border: 1px solid rgba(255, 205, 127, 0.32);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.7);
  pointer-events: none;
}

.is-blinking .companion-character__eye { transform: scaleY(0.08); }

.is-greeting .companion-character,
.companion-trigger:hover .companion-character {
  transform: translateY(-3px) rotate(-1.2deg);
  filter: saturate(1.04);
}

.is-greeting .companion-character__hand-signal {
  opacity: 1;
  animation: companion-hand-signal 720ms ease-out both;
}

.is-greeting .companion-character__mouth,
.is-guiding .companion-character__mouth,
.is-open .companion-character__mouth { left: 36%; width: 28%; height: 16%; }
.is-guiding .companion-character { animation: companion-nod 520ms ease-in-out; }

.is-attentive .companion-trigger__glow,
.is-open .companion-trigger__glow { opacity: 1; transform: scale(1.1); }

.companion-trigger__label {
  position: relative;
  display: flex;
  width: 126px;
  min-height: 42px;
  z-index: 4;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(255, 250, 240, 0.96), rgba(247, 220, 194, 0.94));
  box-shadow: 0 10px 25px rgba(70, 42, 34, 0.18);
  backdrop-filter: blur(16px) saturate(1.1);
  -webkit-backdrop-filter: blur(16px) saturate(1.1);
}

.companion-trigger__label strong,
.companion-trigger__label small { display: block; white-space: nowrap; }
.companion-trigger__label strong { color: var(--companion-wine); font-size: 13px; letter-spacing: 0.08em !important; }
.companion-trigger__label small { color: rgba(49, 36, 32, 0.58); font-size: 10px; }

.companion-whisper {
  position: absolute;
  right: calc(100% - 14px);
  top: 34px;
  width: max-content;
  max-width: 150px;
  padding: 8px 11px;
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 14px 14px 4px 14px;
  background: rgba(255, 249, 239, 0.94);
  box-shadow: 0 10px 24px rgba(65, 40, 34, 0.15);
  color: rgba(49, 36, 32, 0.72);
  font-size: 11px;
  pointer-events: none;
  backdrop-filter: blur(14px);
}

.companion-panel {
  position: absolute;
  right: calc(100% + 18px);
  bottom: 0;
  width: min(400px, calc(100vw - 210px));
  max-height: min(680px, calc(100vh - 110px));
  padding: 22px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 27px;
  background:
    radial-gradient(circle at 90% 3%, rgba(255, 198, 121, 0.32), transparent 33%),
    linear-gradient(145deg, rgba(255, 252, 246, 0.98), rgba(248, 232, 215, 0.97));
  box-shadow: 0 28px 80px rgba(58, 37, 31, 0.28);
  backdrop-filter: blur(25px) saturate(1.08);
  -webkit-backdrop-filter: blur(25px) saturate(1.08);
  scrollbar-width: thin;
  scrollbar-color: rgba(112, 65, 60, 0.28) transparent;
}

.companion-panel::before {
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(112, 65, 60, 0.07);
  border-radius: 21px;
  content: "";
  pointer-events: none;
}

.companion-panel__header {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.companion-panel__eyebrow {
  margin: 0 0 4px;
  color: var(--companion-copper);
  font: 750 9px/1.4 ui-monospace, monospace;
  letter-spacing: 0.17em !important;
}

.companion-panel__header h2 {
  margin: 0;
  border: 0;
  color: var(--companion-ink);
  font-family: "Noto Serif SC", "Songti SC", serif;
  font-size: 26px;
  line-height: 1.2;
}

.companion-panel__subtitle { margin: 4px 0 0; color: rgba(49, 36, 32, 0.55); font-size: 11px; }

.companion-panel__close {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  place-items: center;
  border: 1px solid var(--companion-line);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  color: var(--companion-wine);
  cursor: pointer;
  font-size: 21px;
  line-height: 1;
}

.companion-panel__greeting {
  position: relative;
  margin: 15px 0 10px;
  color: var(--companion-ink);
  font-family: "Noto Serif SC", "Songti SC", serif;
  font-size: 15px;
  line-height: 1.8;
}

.companion-panel__context {
  position: relative;
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 6px;
  margin: 0 0 16px;
  padding: 10px 12px;
  border: 1px solid rgba(124, 146, 116, 0.16);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.48);
  color: rgba(49, 36, 32, 0.66);
  font-size: 11px;
  line-height: 1.65;
}

.companion-panel__context > span { color: var(--companion-sage); font-size: 15px; }

.companion-intents {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.companion-intent {
  display: grid;
  grid-template-columns: 31px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  min-height: 54px;
  padding: 7px 8px;
  border: 1px solid transparent;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.38);
  color: var(--companion-ink);
  cursor: pointer;
  text-align: left;
  transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
}

.companion-intent:hover,
.companion-intent.is-selected {
  border-color: rgba(200, 120, 85, 0.22);
  background: rgba(255, 255, 255, 0.75);
  transform: translateY(-1px);
}

.companion-intent__icon {
  display: grid;
  width: 31px;
  height: 31px;
  place-items: center;
  border: 1px solid rgba(200, 120, 85, 0.18);
  border-radius: 10px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.84), rgba(245, 211, 183, 0.67));
  color: var(--companion-wine);
  font-size: 13px;
}

.companion-intent strong,
.companion-intent small { display: block; overflow: hidden; text-overflow: ellipsis; }
.companion-intent strong { font-size: 11px; line-height: 1.4; white-space: nowrap; }
.companion-intent small { margin-top: 2px; color: rgba(49, 36, 32, 0.53); font-size: 9px; line-height: 1.35; white-space: nowrap; }

.companion-response {
  position: relative;
  min-height: 82px;
  margin-top: 12px;
  padding: 12px 13px;
  border: 1px solid rgba(200, 120, 85, 0.15);
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(255, 250, 241, 0.85), rgba(250, 223, 197, 0.53));
}

.companion-response p { margin: 0; color: rgba(49, 36, 32, 0.72); font-size: 11px; line-height: 1.7; }
.companion-response .companion-response__hint { color: rgba(49, 36, 32, 0.48); }

.companion-response a {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 9px;
  color: var(--companion-wine);
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
}

.companion-panel__footer { position: relative; display: grid; gap: 8px; margin-top: 12px; }
.companion-panel__footer > p { display: flex; align-items: center; gap: 7px; margin: 0; color: rgba(49, 36, 32, 0.5); font-size: 9px; }
.companion-panel__status { width: 6px; height: 6px; border-radius: 50%; background: var(--companion-sage); box-shadow: 0 0 0 4px rgba(124, 146, 116, 0.12); }
.companion-panel__controls { display: flex; flex-wrap: wrap; gap: 7px; }

.companion-panel__controls button {
  min-height: 29px;
  padding: 0 10px;
  border: 1px solid var(--companion-line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.45);
  color: rgba(49, 36, 32, 0.63);
  cursor: pointer;
  font-size: 9px;
}

.companion-panel__controls button:disabled { cursor: default; opacity: 0.58; }

.companion-restore {
  display: inline-flex;
  min-height: 39px;
  align-items: center;
  gap: 7px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 999px 6px 6px 999px;
  background: rgba(255, 247, 236, 0.94);
  box-shadow: 0 11px 26px rgba(58, 37, 31, 0.17);
  color: var(--companion-wine);
  cursor: pointer;
  font-size: 10px;
}

.companion-panel-enter-active,
.companion-panel-leave-active { transition: opacity 180ms ease, transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1); transform-origin: right bottom; }
.companion-panel-enter-from,
.companion-panel-leave-to { opacity: 0; transform: translate(12px, 8px) scale(0.97); }
.companion-whisper-enter-active,
.companion-whisper-leave-active,
.companion-restore-enter-active,
.companion-restore-leave-active { transition: opacity 160ms ease, transform 180ms ease; }
.companion-whisper-enter-from,
.companion-whisper-leave-to,
.companion-restore-enter-from,
.companion-restore-leave-to { opacity: 0; transform: translateY(5px); }

@keyframes companion-breathe {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-1.5px) scale(1.006); }
}

@keyframes companion-orbit { to { transform: rotate(1turn); } }
@keyframes companion-nod {
  0%, 100% { transform: translateY(0) rotate(0); }
  45% { transform: translateY(3px) rotate(1deg); }
}

@keyframes companion-hand-signal {
  0% { opacity: 0; transform: scale(0.62); }
  40% { opacity: 1; transform: scale(1.18); }
  100% { opacity: 0; transform: scale(1.55); }
}

@media (max-width: 820px) {
  .cottage-assistant { right: 12px; bottom: calc(76px + env(safe-area-inset-bottom, 0px)); }
  .companion-panel {
    position: fixed;
    right: 12px;
    bottom: calc(240px + env(safe-area-inset-bottom, 0px));
    left: 12px;
    width: auto;
    max-height: min(62dvh, calc(100dvh - 262px - env(safe-area-inset-bottom, 0px)));
    background: linear-gradient(150deg, #fffdf8, #f7e7d8);
  }
  .companion-stage,
  .companion-trigger { width: 94px; }
  .companion-trigger { min-height: 154px; padding-inline: 3px; }
  .companion-character { left: 11px; bottom: 23px; width: 72px; }
  .companion-trigger__glow { left: 10px; bottom: 31px; width: 74px; height: 74px; }
  .companion-trigger__orbit { bottom: 37px; }
  .companion-trigger__orbit--outer { width: 88px; height: 88px; margin-left: -44px; }
  .companion-trigger__orbit--inner { width: 62px; height: 62px; margin-left: -31px; }
  .companion-trigger__orbit--inner::after { top: 28px; }
  .companion-trigger__label { width: 84px; min-height: 34px; justify-content: center; padding: 5px 8px; }
  .companion-trigger__label strong { font-size: 11px; }
  .companion-trigger__label small { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .companion-whisper { display: none; }
}

@media (max-width: 420px) {
  .companion-panel { padding: 18px; border-radius: 23px; }
  .companion-panel::before { border-radius: 17px; }
  .companion-intents { grid-template-columns: 1fr; }
  .companion-intent { min-height: 48px; }
  .companion-intent strong,
  .companion-intent small { white-space: normal; }
}

@media (prefers-reduced-motion: reduce) {
  .cottage-assistant *,
  .cottage-assistant *::before,
  .cottage-assistant *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.is-motion-paused .companion-character__body,
.is-motion-paused .companion-trigger__orbit,
.is-motion-paused .companion-character__hand-signal { animation: none !important; }

:global(.dark) .cottage-assistant { --companion-ink: #f8eadd; --companion-line: rgba(255, 222, 193, 0.14); }
:global(.dark) .companion-panel {
  border-color: rgba(255, 236, 216, 0.13);
  background:
    radial-gradient(circle at 90% 3%, rgba(183, 105, 69, 0.24), transparent 33%),
    linear-gradient(145deg, rgba(48, 35, 33, 0.98), rgba(36, 28, 28, 0.97));
}

:global(.dark) .companion-panel__header h2,
:global(.dark) .companion-panel__greeting,
:global(.dark) .companion-intent { color: var(--companion-ink); }

:global(.dark) .companion-panel__subtitle,
:global(.dark) .companion-panel__context,
:global(.dark) .companion-intent small,
:global(.dark) .companion-response p,
:global(.dark) .companion-panel__footer > p,
:global(.dark) .companion-panel__controls button { color: rgba(248, 234, 221, 0.62); }

:global(.dark) .companion-panel__context,
:global(.dark) .companion-intent,
:global(.dark) .companion-panel__controls button,
:global(.dark) .companion-panel__close { background: rgba(255, 242, 227, 0.06); }

:global(.dark) .companion-intent:hover,
:global(.dark) .companion-intent.is-selected { background: rgba(255, 242, 227, 0.1); }

:global(.dark) .companion-response { background: linear-gradient(145deg, rgba(76, 49, 42, 0.72), rgba(48, 35, 33, 0.65)); }

@media print {
  .cottage-assistant { display: none !important; }
}
</style>
