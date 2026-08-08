<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { withBase } from "vitepress";

const isOpen = ref(false);
const panelRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);

const shortcuts = [
  {
    label: "研究与学术",
    detail: "医学多模态与基础模型",
    href: "/research/",
    icon: "◇",
  },
  {
    label: "博士旅程",
    detail: "成长、思考与沿途记录",
    href: "/phd/",
    icon: "○",
  },
  {
    label: "山甲实验室",
    detail: "团队、技术与长期建设",
    href: "/lab/",
    icon: "△",
  },
  {
    label: "CardioMind AI",
    detail: "愿景、项目与创业历程",
    href: "/cardiomind/",
    icon: "✦",
  },
  {
    label: "合作与联系",
    detail: "研究、技术与内容合作",
    href: "/collaboration/",
    icon: "＋",
  },
] as const;

async function togglePanel() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    panelRef.value?.querySelector<HTMLAnchorElement>("a")?.focus();
  }
}

function closePanel({ restoreFocus = false } = {}) {
  if (!isOpen.value) return;
  isOpen.value = false;
  if (restoreFocus) nextTick(() => triggerRef.value?.focus());
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && isOpen.value) {
    event.preventDefault();
    closePanel({ restoreFocus: true });
  }
}

onMounted(() => document.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", handleKeydown));
</script>

<template>
  <aside class="cottage-assistant" aria-label="俊杰的小屋本地导航助手">
    <Transition name="cottage-panel">
      <section
        v-if="isOpen"
        id="cottage-assistant-panel"
        ref="panelRef"
        class="cottage-assistant__panel"
        aria-labelledby="cottage-assistant-title"
      >
        <div class="cottage-assistant__heading">
          <div>
            <p class="cottage-assistant__eyebrow">LOCAL GUIDE</p>
            <h2 id="cottage-assistant-title">从小屋去哪里？</h2>
          </div>
          <button
            class="cottage-assistant__close"
            type="button"
            aria-label="收起小屋助手"
            @click="closePanel({ restoreFocus: true })"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <p class="cottage-assistant__intro">
          沿着俊杰的不同身份，读科研、博士生活，也看看正在生长的团队与理想。
        </p>

        <nav aria-label="小屋快捷导航">
          <ul class="cottage-assistant__links">
            <li v-for="item in shortcuts" :key="item.href">
              <a :href="withBase(item.href)" @click="closePanel()">
                <span class="cottage-assistant__link-icon" aria-hidden="true">{{ item.icon }}</span>
                <span>
                  <strong>{{ item.label }}</strong>
                  <small>{{ item.detail }}</small>
                </span>
                <span class="cottage-assistant__arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </nav>

        <p class="cottage-assistant__privacy">
          <span class="cottage-assistant__status-dot" aria-hidden="true"></span>
          本地导航助手 · 不联网 · 不收集数据
        </p>
      </section>
    </Transition>

    <button
      ref="triggerRef"
      class="cottage-assistant__trigger"
      type="button"
      aria-controls="cottage-assistant-panel"
      :aria-expanded="isOpen"
      :aria-label="isOpen ? '收起俊杰的小屋导航助手' : '打开俊杰的小屋导航助手'"
      @click="togglePanel"
    >
      <span class="cottage-assistant__orbit cottage-assistant__orbit--one" aria-hidden="true"></span>
      <span class="cottage-assistant__orbit cottage-assistant__orbit--two" aria-hidden="true"></span>
      <span class="cottage-assistant__house" aria-hidden="true">
        <span class="cottage-assistant__roof"></span>
        <span class="cottage-assistant__home">
          <span class="cottage-assistant__window"></span>
          <span class="cottage-assistant__door"></span>
        </span>
        <span class="cottage-assistant__smoke"></span>
      </span>
      <span class="cottage-assistant__trigger-copy">
        <strong>小屋助手</strong>
        <small>站内导航</small>
      </span>
    </button>
  </aside>
</template>

<style scoped>
.cottage-assistant {
  --cottage-ink: #33241f;
  --cottage-wine: #743d39;
  --cottage-copper: #c7734c;
  --cottage-cream: #fff7eb;
  --cottage-line: rgba(116, 61, 57, 0.16);
  position: fixed;
  right: clamp(16px, 2.4vw, 34px);
  bottom: clamp(18px, 3vw, 34px);
  z-index: 40;
  color: var(--cottage-ink);
  font-family: inherit;
}

.cottage-assistant__trigger {
  position: relative;
  display: flex;
  width: 168px;
  min-height: 72px;
  align-items: center;
  gap: 11px;
  padding: 10px 15px 10px 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(255, 250, 240, 0.94), rgba(248, 222, 197, 0.91)),
    var(--cottage-cream);
  box-shadow:
    0 18px 45px rgba(77, 43, 33, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  color: var(--cottage-ink);
  cursor: pointer;
  backdrop-filter: blur(18px) saturate(1.15);
  -webkit-backdrop-filter: blur(18px) saturate(1.15);
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.cottage-assistant__trigger:hover {
  transform: translateY(-3px);
  box-shadow:
    0 22px 52px rgba(77, 43, 33, 0.27),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.cottage-assistant__trigger:focus-visible,
.cottage-assistant__close:focus-visible,
.cottage-assistant__links a:focus-visible {
  outline: 3px solid rgba(199, 115, 76, 0.52);
  outline-offset: 3px;
}

.cottage-assistant__trigger-copy {
  position: relative;
  display: grid;
  gap: 2px;
  z-index: 2;
  text-align: left;
}

.cottage-assistant__trigger-copy strong {
  font-size: 14px;
  letter-spacing: 0.08em;
}

.cottage-assistant__trigger-copy small {
  color: rgba(51, 36, 31, 0.62);
  font-size: 11px;
}

.cottage-assistant__house {
  position: relative;
  display: block;
  width: 50px;
  height: 50px;
  flex: 0 0 50px;
  z-index: 2;
}

.cottage-assistant__home {
  position: absolute;
  left: 9px;
  bottom: 5px;
  width: 34px;
  height: 27px;
  border: 1px solid rgba(107, 55, 45, 0.25);
  border-radius: 5px 5px 8px 8px;
  background: linear-gradient(155deg, #f6c58f, #d77750);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.55);
}

.cottage-assistant__roof {
  position: absolute;
  top: 6px;
  left: 7px;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: linear-gradient(135deg, #874741, #a95846);
  transform: rotate(45deg) scale(0.73);
  transform-origin: center;
  box-shadow: 3px 3px 8px rgba(82, 42, 35, 0.2);
}

.cottage-assistant__window {
  position: absolute;
  top: 7px;
  left: 7px;
  width: 9px;
  height: 9px;
  border: 1px solid rgba(119, 65, 41, 0.5);
  border-radius: 2px;
  background: #ffe6a6;
  box-shadow: 0 0 9px rgba(255, 203, 102, 0.76);
}

.cottage-assistant__door {
  position: absolute;
  right: 6px;
  bottom: 0;
  width: 9px;
  height: 15px;
  border-radius: 4px 4px 1px 1px;
  background: #74433b;
}

.cottage-assistant__smoke {
  position: absolute;
  top: 1px;
  right: 5px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(116, 61, 57, 0.26);
  box-shadow: 4px -5px 0 -1px rgba(116, 61, 57, 0.16);
  animation: cottage-smoke 3s ease-in-out infinite;
}

.cottage-assistant__orbit {
  position: absolute;
  border: 1px solid rgba(199, 115, 76, 0.16);
  border-radius: 50%;
  pointer-events: none;
}

.cottage-assistant__orbit--one {
  width: 94px;
  height: 94px;
  left: -28px;
  top: -35px;
  animation: cottage-orbit 12s linear infinite;
}

.cottage-assistant__orbit--two {
  width: 48px;
  height: 48px;
  left: 6px;
  top: 11px;
  border-style: dashed;
  animation: cottage-orbit 8s linear infinite reverse;
}

.cottage-assistant__panel {
  position: absolute;
  right: 0;
  bottom: calc(100% + 14px);
  width: min(370px, calc(100vw - 32px));
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 27px;
  background:
    radial-gradient(circle at 88% 5%, rgba(255, 199, 124, 0.35), transparent 34%),
    linear-gradient(145deg, rgba(255, 251, 244, 0.97), rgba(248, 231, 213, 0.95));
  box-shadow: 0 26px 70px rgba(64, 39, 31, 0.27);
  backdrop-filter: blur(24px) saturate(1.1);
  -webkit-backdrop-filter: blur(24px) saturate(1.1);
}

.cottage-assistant__panel::before {
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(128, 72, 54, 0.08);
  border-radius: 21px;
  content: "";
  pointer-events: none;
}

.cottage-assistant__heading {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.cottage-assistant__eyebrow {
  margin: 0 0 4px;
  color: var(--cottage-copper);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.22em;
}

.cottage-assistant__heading h2 {
  margin: 0;
  border: 0;
  font-size: 21px;
  line-height: 1.3;
  letter-spacing: 0.04em;
}

.cottage-assistant__close {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  place-items: center;
  border: 1px solid var(--cottage-line);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  color: var(--cottage-wine);
  cursor: pointer;
  font-size: 21px;
  line-height: 1;
}

.cottage-assistant__intro {
  position: relative;
  margin: 12px 0 17px;
  color: rgba(51, 36, 31, 0.68);
  font-size: 13px;
  line-height: 1.75;
}

.cottage-assistant__links {
  position: relative;
  display: grid;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cottage-assistant__links li {
  margin: 0;
}

.cottage-assistant__links a {
  display: grid;
  grid-template-columns: 34px 1fr auto;
  align-items: center;
  gap: 10px;
  min-height: 54px;
  padding: 7px 11px 7px 8px;
  border: 1px solid transparent;
  border-radius: 16px;
  color: var(--cottage-ink);
  text-decoration: none;
  transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
}

.cottage-assistant__links a:hover {
  border-color: var(--cottage-line);
  background: rgba(255, 255, 255, 0.62);
  transform: translateX(3px);
}

.cottage-assistant__links strong,
.cottage-assistant__links small {
  display: block;
}

.cottage-assistant__links strong {
  font-size: 13px;
  line-height: 1.4;
}

.cottage-assistant__links small {
  margin-top: 2px;
  color: rgba(51, 36, 31, 0.57);
  font-size: 11px;
  line-height: 1.4;
}

.cottage-assistant__link-icon {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid rgba(199, 115, 76, 0.18);
  border-radius: 11px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.82), rgba(245, 210, 181, 0.66));
  color: var(--cottage-wine);
  font-size: 14px;
}

.cottage-assistant__arrow {
  color: rgba(116, 61, 57, 0.5);
  font-size: 13px;
}

.cottage-assistant__privacy {
  position: relative;
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 16px 3px 0;
  color: rgba(51, 36, 31, 0.55);
  font-size: 10px;
  letter-spacing: 0.02em;
}

.cottage-assistant__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #749866;
  box-shadow: 0 0 0 4px rgba(116, 152, 102, 0.12);
}

.cottage-panel-enter-active,
.cottage-panel-leave-active {
  transition: opacity 180ms ease, transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
  transform-origin: right bottom;
}

.cottage-panel-enter-from,
.cottage-panel-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.96);
}

@keyframes cottage-smoke {
  0%, 100% { opacity: 0.42; transform: translate(0, 2px) scale(0.8); }
  50% { opacity: 0.12; transform: translate(4px, -5px) scale(1.25); }
}

@keyframes cottage-orbit {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .cottage-assistant {
    right: 12px;
    bottom: 14px;
  }

  .cottage-assistant__trigger {
    width: 62px;
    min-height: 62px;
    padding: 6px;
    border-radius: 21px;
  }

  .cottage-assistant__house {
    width: 50px;
    flex-basis: 50px;
  }

  .cottage-assistant__trigger-copy {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .cottage-assistant__panel {
    width: calc(100vw - 24px);
    max-height: min(620px, calc(100vh - 104px));
    overflow-y: auto;
    padding: 20px;
  }
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

:global(.dark) .cottage-assistant {
  --cottage-ink: #f8eadd;
  --cottage-line: rgba(255, 222, 193, 0.14);
}

:global(.dark) .cottage-assistant__panel {
  background:
    radial-gradient(circle at 88% 5%, rgba(183, 105, 69, 0.24), transparent 34%),
    linear-gradient(145deg, rgba(48, 35, 33, 0.97), rgba(36, 28, 28, 0.96));
  border-color: rgba(255, 236, 216, 0.13);
}

:global(.dark) .cottage-assistant__trigger {
  background: linear-gradient(135deg, rgba(58, 40, 36, 0.95), rgba(85, 51, 43, 0.92));
  border-color: rgba(255, 236, 216, 0.14);
}

:global(.dark) .cottage-assistant__trigger-copy small,
:global(.dark) .cottage-assistant__intro,
:global(.dark) .cottage-assistant__links small,
:global(.dark) .cottage-assistant__privacy {
  color: rgba(248, 234, 221, 0.62);
}

:global(.dark) .cottage-assistant__links a {
  color: var(--cottage-ink);
}

:global(.dark) .cottage-assistant__links a:hover,
:global(.dark) .cottage-assistant__close,
:global(.dark) .cottage-assistant__link-icon {
  background: rgba(255, 242, 227, 0.07);
}
</style>
