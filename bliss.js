/* ============================================================
   Bliss 季节 · 页面脚本
   时间轴上的每一个读数都来自 season-core.js，也就是模组里
   blendFactors + 线性光混色的那一套，没有另写一份近似。
   ============================================================ */

(function () {
  "use strict";

  const C = window.BlissCore;
  const scene = document.getElementById("labScene");
  if (!C || !scene) return;

  const $ = (id) => document.getElementById(id);

  const inS = $("inS"), outS = $("outS");
  const inTr = $("inTr"), outTr = $("outTr");
  const inC = $("inC");
  const inStart = $("inStart");
  const inI = $("inI"), outI = $("outI");
  const inSky = $("inSky");
  const inW = $("inW");
  const inT = $("inT"), outT = $("outT");
  const bands = $("trackBands");
  const marker = $("trackMarker");
  const playBtn = $("playBtn");
  const resetLab = $("resetLab");
  const copyBtn = $("copyBtn");
  const copyNote = $("copyNote");

  const roSeason = $("roSeason");
  const roLocal = $("roLocal");
  const roPeriod = $("roPeriod");
  const roSky = $("roSky");
  const roLeaf = $("roLeaf");

  const weightEls = [0, 1, 2, 3].map((i) => $("wb" + i).closest(".weight"));
  const weightVals = [0, 1, 2, 3].map((i) => $("wv" + i));
  const weightBars = [0, 1, 2, 3].map((i) => $("wb" + i));
  const jumpBtns = Array.from(document.querySelectorAll("#jumps .jump"));
  const curveBtns = Array.from(document.querySelectorAll("#curveList .curve"));

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const DEFAULTS = {
    seasonDur: 30,
    trans: 2,
    curve: "SMOOTHSTEP",
    start: 0,
    intensity: 1,
    sky: true,
    weather: false
  };

  let state = Object.assign({}, DEFAULTS);
  let elapsed = 0;
  let raf = 0;
  let last = 0;

  const period = () => state.seasonDur * 4;

  /* ── 时间轴上的金色段 / 纸色段 ───────────────────────────── */
  function buildBands() {
    const dur = state.seasonDur;
    const tr = Math.min(Math.max(0.1, state.trans), dur);
    const hold = dur - tr;

    bands.querySelectorAll(".track__seg").forEach((n) => n.remove());

    const frag = document.createDocumentFragment();
    for (let i = 0; i < 4; i++) {
      const h = document.createElement("i");
      h.className = "track__seg";
      h.style.flex = hold + " 1 0";
      frag.appendChild(h);

      const t = document.createElement("i");
      t.className = "track__seg is-trans";
      t.style.flex = tr + " 1 0";
      frag.appendChild(t);
    }
    bands.insertBefore(frag, marker);
  }

  /* ── 一次完整的重绘 ─────────────────────────────────────── */
  function render() {
    const dur = state.seasonDur;
    const ph = C.phase(elapsed, dur, state.start);
    const w = C.blendFactors(elapsed, dur, state.trans, state.start, state.curve);
    const idx = C.dominant(w);
    const pal = C.paletteAt(w, state.intensity);
    const season = C.SEASONS[idx];

    scene.style.setProperty("--leaf", pal.leaf);
    scene.style.setProperty("--grass", pal.grass);
    scene.style.setProperty("--skyTint", state.sky ? pal.skyCss : "#FFFFFF");
    scene.dataset.weather = state.weather ? C.precipitation(season.id) : "none";

    for (let i = 0; i < 4; i++) {
      weightVals[i].textContent = w[i].toFixed(2);
      weightBars[i].style.width = (w[i] * 100).toFixed(1) + "%";
      weightEls[i].classList.toggle("is-on", i === idx);
    }

    jumpBtns.forEach((b) => {
      const on = Number(b.dataset.season) === idx;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    marker.style.setProperty("--pos", ((elapsed / ph.period) * 100).toFixed(2) + "%");

    inT.value = elapsed.toFixed(2);
    inT.style.setProperty("--fill", ((elapsed / ph.period) * 100).toFixed(2) + "%");

    outT.textContent = elapsed.toFixed(1) + " s";
    roSeason.textContent = season.name;
    roLocal.textContent = Math.round((ph.local / dur) * 100) + "%";
    roPeriod.textContent = ph.period + " s";
    roSky.textContent = state.sky
      ? "×" + pal.sky.map((v) => v.toFixed(2)).join(" ")
      : "已关闭";
    roLeaf.textContent = pal.leaf;
  }

  /* ── 播放 / 暂停 ────────────────────────────────────────── */
  function loop(now) {
    if (!last) last = now;
    const dt = Math.min(0.25, (now - last) / 1000);
    last = now;
    elapsed = (elapsed + dt) % period();
    render();
    raf = requestAnimationFrame(loop);
  }

  function play() {
    if (raf) return;
    last = 0;
    raf = requestAnimationFrame(loop);
    playBtn.textContent = "暂停";
    playBtn.setAttribute("aria-pressed", "true");
  }

  function pause() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    playBtn.textContent = "播放";
    playBtn.setAttribute("aria-pressed", "false");
  }

  /* ── 曲线小图 ───────────────────────────────────────────── */
  const PLOT_W = 100, PLOT_H = 60, PLOT_STEPS = 48;
  curveBtns.forEach((btn) => {
    const line = btn.querySelector(".curve__plot polyline");
    const fn = C.CURVES[btn.dataset.curve];
    if (!line || !fn) return;
    const pts = [];
    for (let i = 0; i <= PLOT_STEPS; i++) {
      const t = i / PLOT_STEPS;
      pts.push((t * PLOT_W).toFixed(2) + "," + (PLOT_H - fn(t) * PLOT_H).toFixed(2));
    }
    line.setAttribute("points", pts.join(" "));
  });

  function setCurve(name) {
    if (!C.CURVES[name]) return;
    state.curve = name;
    inC.value = name;
    curveBtns.forEach((b) => {
      const on = b.dataset.curve === name;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    render();
  }

  /* ── 参数同步 ───────────────────────────────────────────── */
  function syncLimits() {
    inT.max = period().toFixed(2);
    if (elapsed > period()) elapsed = elapsed % period();
  }

  inS.addEventListener("input", () => {
    state.seasonDur = Number(inS.value);
    outS.textContent = state.seasonDur + " s";
    inS.style.setProperty("--fill", ((inS.value - 1) / 59) * 100 + "%");
    syncLimits();
    buildBands();
    render();
  });

  inTr.addEventListener("input", () => {
    state.trans = Number(inTr.value);
    outTr.textContent = state.trans.toFixed(1) + " s";
    inTr.style.setProperty("--fill", ((inTr.value - 1) / 4) * 100 + "%");
    buildBands();
    render();
  });

  inI.addEventListener("input", () => {
    state.intensity = Number(inI.value);
    outI.textContent = state.intensity.toFixed(2);
    inI.style.setProperty("--fill", (inI.value / 2) * 100 + "%");
    render();
  });

  inC.addEventListener("change", () => setCurve(inC.value));

  inStart.addEventListener("change", () => {
    state.start = Number(inStart.value);
    render();
  });

  inSky.addEventListener("change", () => {
    state.sky = inSky.checked;
    render();
  });

  inW.addEventListener("change", () => {
    state.weather = inW.checked;
    render();
  });

  inT.addEventListener("input", () => {
    pause();
    elapsed = Number(inT.value);
    render();
  });

  jumpBtns.forEach((b) => {
    b.addEventListener("click", () => {
      pause();
      const s = Number(b.dataset.season);
      elapsed = ((s - state.start + 4) % 4) * state.seasonDur;
      render();
    });
  });

  curveBtns.forEach((b) => {
    b.addEventListener("click", () => setCurve(b.dataset.curve));
  });

  playBtn.addEventListener("click", () => {
    if (raf) pause();
    else play();
  });

  /* ── 重置 ───────────────────────────────────────────────── */
  resetLab.addEventListener("click", () => {
    state = Object.assign({}, DEFAULTS);
    elapsed = 0;

    inS.value = state.seasonDur;
    inTr.value = state.trans;
    inC.value = state.curve;
    inStart.value = String(state.start);
    inI.value = state.intensity;
    inSky.checked = state.sky;
    inW.checked = state.weather;

    outS.textContent = state.seasonDur + " s";
    outTr.textContent = state.trans.toFixed(1) + " s";
    outI.textContent = state.intensity.toFixed(2);
    inS.style.setProperty("--fill", ((state.seasonDur - 1) / 59) * 100 + "%");
    inTr.style.setProperty("--fill", ((state.trans - 1) / 4) * 100 + "%");
    inI.style.setProperty("--fill", (state.intensity / 2) * 100 + "%");

    curveBtns.forEach((b) => {
      const on = b.dataset.curve === state.curve;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    syncLimits();
    buildBands();
    render();
    copyNote.textContent = "已恢复到模组默认值。";
    copyNote.removeAttribute("data-fallback");
  });

  /* ── 复制参数 ───────────────────────────────────────────── */
  function currentConfig() {
    return {
      enableSeasons: true,
      seasonDurationSeconds: state.seasonDur,
      transitionDurationSeconds: state.trans,
      transitionCurve: state.curve,
      startSeason: state.start,
      springFoliageColor: 8832580,
      summerFoliageColor: 7448368,
      autumnFoliageColor: 13333284,
      winterFoliageColor: 16777215,
      springGrassColor: 7129163,
      summerGrassColor: 7979098,
      autumnGrassColor: 11905096,
      winterGrassColor: 16777215,
      colorIntensity: state.intensity,
      skyTint: state.sky,
      chunkRefreshMode: "ADAPTIVE",
      fixedRefreshIntervalTicks: 4,
      chunkRefreshBudget: 96,
      customWeather: state.weather,
      springRain: true,
      summerRain: true,
      autumnRain: true,
      winterSnow: true,
      weatherFadeSeconds: 1
    };
  }

  copyBtn.addEventListener("click", () => {
    const text = JSON.stringify(currentConfig(), null, 2);
    const done = () => {
      copyNote.removeAttribute("data-fallback");
      copyNote.textContent = "已复制。粘回 config/seasonalbliss.json 的同名字段即可。";
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallback(text));
    } else {
      fallback(text);
    }
  });

  function fallback(text) {
    const code = document.createElement("code");
    code.textContent = text;
    copyNote.textContent = "浏览器没给剪贴板权限，手动复制这段：";
    copyNote.appendChild(code);
    copyNote.setAttribute("data-fallback", "1");
  }

  /* ── 启动 ───────────────────────────────────────────────── */
  inS.style.setProperty("--fill", ((state.seasonDur - 1) / 59) * 100 + "%");
  inTr.style.setProperty("--fill", ((state.trans - 1) / 4) * 100 + "%");
  inI.style.setProperty("--fill", (state.intensity / 2) * 100 + "%");
  playBtn.setAttribute("aria-pressed", "false");
  syncLimits();
  buildBands();
  render();

  /* 关掉动画偏好的人不自动轮转，时间轴照样能拖 */
  if (reduce.matches) pause();
  else play();
})();
