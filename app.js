/* ============================================================
   电影挡条 · Cinematic Bars — 页面脚本
   挡条的几何与缓动按模组的实际行为实现：
   进度 u ∈ [0,1] 线性推进，输出 p = curve(u)，两条挡条对称滑动。
   ============================================================ */

(function () {
  "use strict";

  /* ── 九条缓动曲线（与模组 Curve 枚举同名同序） ─────────── */
  const CURVES = {
    LINEAR:            (t) => t,
    SMOOTHSTEP:        (t) => t * t * (3 - 2 * t),
    SMOOTHERSTEP:      (t) => t * t * t * (t * (6 * t - 15) + 10),
    EASE_IN_QUAD:      (t) => t * t,
    EASE_IN_OUT:       (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    EASE_OUT_QUAD:     (t) => 1 - (1 - t) * (1 - t),
    EASE_OUT_CUBIC:    (t) => 1 - Math.pow(1 - t, 3),
    EASE_OUT_QUARTIC:  (t) => 1 - Math.pow(1 - t, 4),
    EASE_OUT_EXPO:     (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
  };

  const CURVE_ORDER = Object.keys(CURVES);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ease = (name, u) => (CURVES[name] || CURVES.SMOOTHSTEP)(clamp(u, 0, 1));

  /* ── 一块屏幕上的挡条 ────────────────────────────────────── */
  class BarsView {
    constructor(el) {
      this.el = el;
      this.h = parseFloat(el.dataset.h) || 8;
      this.feather = parseFloat(el.dataset.feather) || 22;
      this.duration = parseInt(el.dataset.duration, 10) || 600;
      this.curve = CURVES[el.dataset.curve] ? el.dataset.curve : "SMOOTHSTEP";
      this.animate = el.dataset.anim !== "off";

      this.u = 0;
      this.target = 0;
      this._raf = 0;
      this._last = 0;
      this._tick = this._tick.bind(this);

      this.apply();
      if (el.dataset.state === "open") {
        this.u = 1;
        this.target = 1;
        this.apply();
      }
    }

    set(open) {
      const t = open ? 1 : 0;
      if (t === this.target) return;
      this.target = t;
      if (!this._raf) {
        this._last = performance.now();
        this._raf = requestAnimationFrame(this._tick);
      }
      if (open && this.onOpen) this.onOpen();
    }

    _tick(now) {
      const dt = Math.min(now - this._last, 64);
      this._last = now;

      const instant = !this.animate || reduceMotion.matches;
      const dir = Math.sign(this.target - this.u);
      if (dir === 0) { this._raf = 0; return; }

      const step = instant ? 1 : dt / Math.max(this.duration, 1);
      this.u = this.u + dir * step;

      if ((dir > 0 && this.u >= this.target) || (dir < 0 && this.u <= this.target)) {
        this.u = this.target;
        this._raf = 0;
        this.apply();
        return;
      }
      this.apply();
      this._raf = requestAnimationFrame(this._tick);
    }

    apply() {
      const p = ease(this.curve, this.u);
      const s = this.el.style;
      s.setProperty("--h", String(this.h));
      s.setProperty("--feather", String(this.feather));
      s.setProperty("--p", p.toFixed(4));
    }

    setParams(next) {
      if (next.h != null) this.h = next.h;
      if (next.feather != null) this.feather = next.feather;
      if (next.duration != null) this.duration = next.duration;
      if (next.curve != null && CURVES[next.curve]) this.curve = next.curve;
      if (next.animate != null) this.animate = next.animate;
      this.apply();
    }
  }

  /* ── 首映图：进场时滑入一次 ──────────────────────────────── */
  const heroEl = document.querySelector('.screen--hero');
  const hero = heroEl ? new BarsView(heroEl) : null;

  /* ── 放映室 ──────────────────────────────────────────────── */
  const labEl = document.getElementById("labScreen");
  if (!labEl) return;

  const lab = new BarsView(labEl);

  const $ = (id) => document.getElementById(id);
  const inH = $("inH"), inF = $("inF"), inD = $("inD"), inC = $("inC"), inA = $("inA");
  const outH = $("outH"), outF = $("outF"), outD = $("outD");
  const roH = $("roH"), roAspect = $("roAspect"), roPx = $("roPx"),
        roCurve = $("roCurve"), roDur = $("roDur");
  const holdBtn = $("holdBtn");
  const hint = $("holdHint");
  const copyBtn = $("copyCfg");
  const copyNote = $("copyNote");
  const chips = Array.from(document.querySelectorAll("#curveList .curve"));

  /* 把每条曲线按 apply(t) 采样成折线，画进参数表里的小图。
     用的就是上面那份 CURVES —— 图上的形状和演示里的运动是同一件事。 */
  const PLOT_W = 100, PLOT_H = 60, PLOT_STEPS = 48;
  chips.forEach((chip) => {
    const line = chip.querySelector(".curve__plot polyline");
    const fn = CURVES[chip.dataset.curve];
    if (!line || !fn) return;
    const pts = [];
    for (let i = 0; i <= PLOT_STEPS; i++) {
      const t = i / PLOT_STEPS;
      const x = t * PLOT_W;
      const y = PLOT_H - fn(t) * PLOT_H;
      pts.push(x.toFixed(2) + "," + y.toFixed(2));
    }
    line.setAttribute("points", pts.join(" "));
  });

  /* 用屏幕上的初始值初始化控件 */
  inH.value = lab.h;
  inF.value = lab.feather;
  inD.value = lab.duration;
  inC.value = lab.curve;

  function paintRange(input) {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const val = parseFloat(input.value);
    const pct = ((val - min) / (max - min)) * 100;
    input.style.setProperty("--fill", pct.toFixed(2) + "%");
  }

  function updateReadout() {
    const h = lab.h;
    const w = labEl.clientWidth;
    const ht = labEl.clientHeight;

    outH.textContent = h.toFixed(1) + "%";
    outF.textContent = Math.round(lab.feather) + "%";
    outD.textContent = lab.duration + " ms";

    roH.textContent = h.toFixed(1) + "%";
    roDur.textContent = lab.duration + " ms";
    roCurve.textContent = lab.curve;

    if (ht > 0 && w > 0) {
      const barPx = (ht * h) / 100;
      roPx.textContent = barPx.toFixed(1) + " px";
      const visible = ht * (1 - (2 * h) / 100);
      const aspect = visible > 1 ? w / visible : 0;
      roAspect.textContent = aspect > 0 ? aspect.toFixed(2) + " : 1" : "—";
    }

    const heroH = document.querySelector(".callout--bar .callout__label");
    if (heroH && hero) heroH.textContent = "单侧挡条 " + hero.h + "%";
  }

  function syncChips() {
    chips.forEach((c) => {
      const on = c.dataset.curve === lab.curve;
      c.classList.toggle("is-on", on);
      c.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (inC.value !== lab.curve) inC.value = lab.curve;
  }

  function commit() {
    lab.setParams({
      h: clamp(parseFloat(inH.value), 0, 24),
      feather: clamp(parseFloat(inF.value), 0, 80),
      duration: parseInt(inD.value, 10),
      curve: inC.value,
      animate: inA.checked
    });
    [inH, inF, inD].forEach(paintRange);
    updateReadout();
    syncChips();
    copyNote.textContent = "";
  }

  [inH, inF, inD].forEach((el) => {
    paintRange(el);
    el.addEventListener("input", commit);
  });
  inC.addEventListener("change", commit);
  inA.addEventListener("change", commit);

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      inC.value = chip.dataset.curve;
      commit();
    });
  });

  /* ── 按住显示 ────────────────────────────────────────────── */
  let pointerHeld = false;
  let keyHeld = false;

  function press() {
    lab.set(true);
    if (hint) hint.classList.add("is-gone");
  }
  function release() {
    lab.set(false);
  }

  function bindHold(el) {
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      pointerHeld = true;
      if (el.setPointerCapture && e.pointerId != null) {
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
      }
      press();
    });
    const end = () => {
      if (!pointerHeld) return;
      pointerHeld = false;
      release();
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("lostpointercapture", end);
    window.addEventListener("pointerup", end);
  }

  bindHold(labEl);
  bindHold(holdBtn);

  holdBtn.addEventListener("keydown", (e) => {
    if (e.key !== " " && e.key !== "Enter") return;
    if (e.repeat) return;
    e.preventDefault();
    keyHeld = true;
    press();
  });
  holdBtn.addEventListener("keyup", (e) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    keyHeld = false;
    release();
  });
  holdBtn.addEventListener("blur", () => {
    if (keyHeld) { keyHeld = false; release(); }
  });

  /* 键盘：聚焦屏幕后空格 / 回车按住 */
  labEl.addEventListener("keydown", (e) => {
    if (e.key !== " " && e.key !== "Enter") return;
    if (e.repeat) return;
    e.preventDefault();
    keyHeld = true;
    press();
  });
  labEl.addEventListener("keyup", (e) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    keyHeld = false;
    release();
  });

  /* 全局左 Shift —— 就是模组里的那个键 */
  function isTyping(t) {
    if (!t || !t.tagName) return false;
    const tag = t.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t.isContentEditable;
  }

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Shift" || isTyping(e.target)) return;
    keyHeld = true;
    press();
  });
  window.addEventListener("keyup", (e) => {
    if (e.key !== "Shift") return;
    keyHeld = false;
    release();
  });
  window.addEventListener("blur", () => {
    pointerHeld = false;
    keyHeld = false;
    release();
  });

  /* ── 重置 ────────────────────────────────────────────────── */
  $("resetLab").addEventListener("click", () => {
    inH.value = 8;
    inF.value = 22;
    inD.value = 600;
    inC.value = "SMOOTHSTEP";
    inA.checked = true;
    commit();
    copyNote.textContent = "已恢复到模组默认值。";
  });

  /* ── 复制配置 ────────────────────────────────────────────── */
  copyBtn.addEventListener("click", async () => {
    const cfg = {
      barHeightPercent: Number(lab.h.toFixed(1)),
      edgeFeatherPercent: Math.round(lab.feather),
      animationDurationMs: lab.duration,
      curve: lab.curve,
      keybindEnabled: true,
      activationKey: "key.keyboard.left.shift",
      showWhenHudHidden: false
    };
    const text = JSON.stringify(cfg, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      copyNote.textContent = "已复制，粘进 config/cinebars.json 即可。";
    } catch (_) {
      /* file:// 下没有 clipboard API，退回到选中一段可复制的文本 */
      copyNote.textContent = "";
      const pre = document.createElement("code");
      pre.textContent = text.replace(/\s+/g, " ").trim();
      pre.style.whiteSpace = "normal";
      copyNote.append(pre);
      copyNote.setAttribute("data-fallback", "1");
    }
  });

  /* ── 尺寸变化 ────────────────────────────────────────────── */
  if ("ResizeObserver" in window) {
    new ResizeObserver(updateReadout).observe(labEl);
  } else {
    window.addEventListener("resize", updateReadout);
  }

  /* ── 首映图进场 ──────────────────────────────────────────── */
  if (hero) {
    const heroH = document.querySelector(".callout--bar .callout__label");
    if (heroH) heroH.textContent = "单侧挡条 " + hero.h + "%";
    if (!reduceMotion.matches) {
      window.setTimeout(() => hero.set(true), 520);
    } else {
      hero.u = 1; hero.target = 1; hero.apply();
    }
  }

  /* ── 首屏 ────────────────────────────────────────────────── */
  [inH, inF, inD].forEach(paintRange);
  updateReadout();
  syncChips();

  /* 芯片默认状态 */
  chips.forEach((c) => c.setAttribute("aria-pressed", c.classList.contains("is-on") ? "true" : "false"));
})();
