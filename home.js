/* 首页封面：每张卡用自己那套算法演示自己的模组。
   挡条卡默认是「按住」的状态；鼠标移上去 = 松开按键，挡条按 SMOOTHSTEP 退回画面外。
   季节卡默认停在夏季；鼠标移上去 = 时间开始走，四季按真实权重和线性光混色轮换。
   两处都复用介绍页的同一份函数，不是 CSS 近似。 */
(() => {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smoothstep = (t) => t * t * (3 - 2 * t);

  /* ── 卡片一：电影挡条 ───────────────────────────────────── */
  (() => {
    const screen = document.querySelector("[data-card-bars]");
    const card = screen && screen.closest("[data-mod-card]");
    if (!card || !screen) return;

    const OPEN = 1;
    const CLOSED = 0;
    const DURATION = 600;

    let raf = 0;
    let current = OPEN;
    let from = OPEN;
    let to = OPEN;
    let started = 0;

    const apply = (v) => {
      current = v;
      screen.style.setProperty("--p", v.toFixed(4));
    };

    const step = (now) => {
      const t = Math.min(1, (now - started) / DURATION);
      apply(from + (to - from) * smoothstep(t));
      raf = t < 1 ? requestAnimationFrame(step) : 0;
    };

    const run = (target) => {
      if (target === to && (raf || current === target)) return;
      if (reduce.matches) {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        apply(OPEN);
        return;
      }
      from = current;
      to = target;
      started = performance.now();
      if (!raf) raf = requestAnimationFrame(step);
    };

    card.addEventListener("pointerenter", (e) => { if (e.pointerType !== "touch") run(CLOSED); });
    card.addEventListener("pointerleave", () => run(OPEN));

    /* 键盘走到标题链接上，也要像鼠标移上去一样把挡条退开 */
    card.addEventListener("focusin", () => run(CLOSED));
    card.addEventListener("focusout", (e) => {
      if (!card.contains(e.relatedTarget)) run(OPEN);
    });

    apply(OPEN);
  })();

  /* ── 卡片二：四季流转 ───────────────────────────────────── */
  (() => {
    const C = window.BlissCore;
    const screen = document.querySelector("[data-card-season]");
    const card = screen && screen.closest("[data-mod-card]");
    if (!C || !card || !screen) return;

    const scene = screen.querySelector(".scene");
    const tag = screen.querySelector(".tag");
    if (!scene) return;

    /* 首页只用来示意，把一季压到 1.8 秒，一轮七秒出头 */
    const DUR = 1.8;
    const TR = 0.7;
    const IDLE = "模拟画面 · 悬停换季";

    let elapsed = 0;
    let raf = 0;
    let last = 0;

    const paint = () => {
      const w = C.blendFactors(elapsed, DUR, TR, 0, "SMOOTHSTEP");
      const pal = C.paletteAt(w, 1);
      scene.style.setProperty("--leaf", pal.leaf);
      scene.style.setProperty("--grass", pal.grass);
      scene.style.setProperty("--skyTint", pal.skyCss);
      if (tag) {
        tag.textContent = elapsed > 0
          ? "模拟画面 · " + C.SEASONS[C.dominant(w)].name
          : IDLE;
      }
    };

    const step = (now) => {
      if (!last) last = now;
      const dt = Math.min(0.2, (now - last) / 1000);
      last = now;
      elapsed = (elapsed + dt) % (DUR * 4);
      paint();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (raf || reduce.matches) return;
      last = 0;
      raf = requestAnimationFrame(step);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      elapsed = 0;
      paint();
    };

    card.addEventListener("pointerenter", (e) => { if (e.pointerType !== "touch") start(); });
    card.addEventListener("pointerleave", stop);
    card.addEventListener("focusin", start);
    card.addEventListener("focusout", (e) => {
      if (!card.contains(e.relatedTarget)) stop();
    });

    paint();
  })();
})();
