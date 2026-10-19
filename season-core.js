/* ============================================================
   Bliss 季节 · 四季权重与混色
   和模组里两份代码一一对应：
     SeasonalCalculator.blendFactors()  —— 把经过的秒数拆成四季权重
     SeasonalColorApplier.applySeasonal() —— 在线性光里按权重混色
   时间轴、模拟场景、首页封面共用这一份，不做 CSS 近似。
   ============================================================ */

(function (global) {
  "use strict";

  /* 九条缓动曲线，与 TransitionCurve 枚举同名同序 */
  const CURVES = {
    LINEAR: (t) => t,
    SMOOTHSTEP: (t) => t * t * (3 - 2 * t),
    SMOOTHERSTEP: (t) => t * t * t * (t * (6 * t - 15) + 10),
    EASE_IN_QUAD: (t) => t * t,
    EASE_IN_OUT: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    EASE_OUT_QUAD: (t) => 1 - (1 - t) * (1 - t),
    EASE_OUT_CUBIC: (t) => 1 - Math.pow(1 - t, 3),
    EASE_OUT_QUARTIC: (t) => 1 - Math.pow(1 - t, 4),
    EASE_OUT_EXPO: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
  };

  /* 枚举顺序就是权重数组的下标顺序：0 夏 · 1 秋 · 2 冬 · 3 春。
     注意它不是自然年的顺序，模组里就是这样排的。 */
  const SEASONS = [
    { id: "SUMMER", cn: "夏", name: "夏季", en: "Summer" },
    { id: "AUTUMN", cn: "秋", name: "秋季", en: "Autumn" },
    { id: "WINTER", cn: "冬", name: "冬季", en: "Winter" },
    { id: "SPRING", cn: "春", name: "春季", en: "Spring" }
  ];

  /* 调色板默认值，十进制原样取自 ModConfig 的静态初始化 */
  const PALETTE = {
    SUMMER: { foliage: "#71A730", grass: "#79C05A" },
    AUTUMN: { foliage: "#CB7324", grass: "#B5A848" },
    WINTER: { foliage: "#FFFFFF", grass: "#FFFFFF" },
    SPRING: { foliage: "#86C644", grass: "#6CC84B" }
  };

  /* SeasonState 里的四个乘性天空色，1.0 表示不改 */
  const SKY = {
    SUMMER: [1.0, 1.0, 1.0],
    AUTUMN: [1.05, 0.98, 0.92],
    WINTER: [0.92, 0.95, 1.05],
    SPRING: [0.98, 1.02, 1.02]
  };

  /* 没装模组时场景自己的绿色。色彩浓度降到 0 就回到这两个值。 */
  const BASE = { foliage: "#5F8F3E", grass: "#6FA050" };

  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  /* ── sRGB ⇄ 线性光 ───────────────────────────────────────
     模组用一张查找表做同样的事。线性光里混色，两个季节
     各占一半时才不会比两端都暗。 */
  const srgbToLinear = (c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const linearToSrgb = (c) =>
    c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

  const parseHex = (hex) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16)
    ];
  };

  const toHex = (r, g, b) =>
    "#" +
    [r, g, b]
      .map((v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();

  /* ── 权重 ─────────────────────────────────────────────────
     一个周期是四个季节时长。每个季节末尾有一段过渡，
     长度取 transitionDuration（夹在 0.1 和季节时长之间），
     过渡之外权重是干净的 1 —— 也就是纯色，不掺下一季。 */
  function blendFactors(elapsed, seasonDuration, transitionDuration, startSeason, curveName) {
    const dur = seasonDuration > 0 ? seasonDuration : 1;
    const period = dur * 4;
    const curve = CURVES[curveName] || CURVES.SMOOTHSTEP;

    let t = (elapsed + startSeason * dur) % period;
    if (t < 0) t += period;

    const idx = Math.floor(t / dur) % 4;
    const local = t - idx * dur;

    const transition = Math.min(Math.max(0.1, transitionDuration), dur);
    const hold = dur - transition;

    const w = [0, 0, 0, 0];
    if (local < hold) {
      w[idx] = 1;
    } else {
      const p = (local - hold) / transition;
      const e = clamp01(curve(clamp01(p)));
      w[idx] = 1 - e;
      w[(idx + 1) % 4] = e;
    }
    return w;
  }

  /* 当前落在哪个季节、在这个季节里走了多少。
     blendFactors 内部用的是同一套取模，这里单独开放出来给时间轴用。 */
  function phase(elapsed, seasonDuration, startSeason) {
    const dur = seasonDuration > 0 ? seasonDuration : 1;
    const period = dur * 4;
    let t = (elapsed + startSeason * dur) % period;
    if (t < 0) t += period;
    const idx = Math.floor(t / dur) % 4;
    return { index: idx, local: t - idx * dur, period: period };
  }

  /* 当前季节：权重最大的那个。平手时取靠前的，和模组一致。 */
  function dominant(weights) {
    let best = 0;
    for (let i = 1; i < weights.length; i++) {
      if (weights[i] > weights[best]) best = i;
    }
    return best;
  }

  /* ── 混色 ─────────────────────────────────────────────────
     先把每个季节色转成线性光，按权重加权，再转回 8 位 sRGB。 */
  function mixLinear(hexes, weights) {
    let r = 0;
    let g = 0;
    let b = 0;
    let sum = 0;
    for (let i = 0; i < hexes.length; i++) {
      const w = weights[i] || 0;
      if (w <= 0) continue;
      const c = parseHex(hexes[i]);
      r += srgbToLinear(c[0] / 255) * w;
      g += srgbToLinear(c[1] / 255) * w;
      b += srgbToLinear(c[2] / 255) * w;
      sum += w;
    }
    if (sum <= 0) return "#000000";
    return toHex(
      linearToSrgb(r / sum),
      linearToSrgb(g / sum),
      linearToSrgb(b / sum)
    );
  }

  /* 天空乘子：本身已经是乘数，直接加权，不再过一遍 gamma */
  function mixSky(weights) {
    const out = [0, 0, 0];
    let sum = 0;
    for (let i = 0; i < SEASONS.length; i++) {
      const w = weights[i] || 0;
      if (w <= 0) continue;
      const s = SKY[SEASONS[i].id];
      out[0] += s[0] * w;
      out[1] += s[1] * w;
      out[2] += s[2] * w;
      sum += w;
    }
    if (sum <= 0) return [1, 1, 1];
    return [out[0] / sum, out[1] / sum, out[2] / sum];
  }

  /* 乘子写成 CSS 颜色。乘法的结果不可能超过 1，所以先把三个通道
     按最大值归一，再交给 mix-blend-mode: multiply —— 这样相对冷暖
     完全保留（秋偏暖、冬偏冷），只是整体亮度略降。
     页面上显示的是未归一的原始乘子，读数和模组一致。 */
  const skyToCss = (mul) => {
    const peak = Math.max(mul[0], mul[1], mul[2], 1);
    return toHex(mul[0] / peak, mul[1] / peak, mul[2] / peak);
  };

  /* 色彩浓度：0 时不做季节染色，1 是模组默认，2 是加强 */
  function applyIntensity(baseHex, seasonHex, intensity) {
    const k = clamp01(intensity);
    if (k >= 1) return seasonHex;
    const a = parseHex(baseHex);
    const b = parseHex(seasonHex);
    return toHex(
      (a[0] + (b[0] - a[0]) * k) / 255,
      (a[1] + (b[1] - a[1]) * k) / 255,
      (a[2] + (b[2] - a[2]) * k) / 255
    );
  }

  /* 一次算齐场景要的三个颜色，省得调用方重复拆包 */
  function paletteAt(weights, intensity) {
    const foliageHexes = SEASONS.map((s) => PALETTE[s.id].foliage);
    const grassHexes = SEASONS.map((s) => PALETTE[s.id].grass);
    const leaf = mixLinear(foliageHexes, weights);
    const grass = mixLinear(grassHexes, weights);
    return {
      leaf: applyIntensity(BASE.foliage, leaf, intensity),
      grass: applyIntensity(BASE.grass, grass, intensity),
      sky: mixSky(weights),
      skyCss: skyToCss(mixSky(weights))
    };
  }

  /* 天气：降雪只出现在冬季，其余三季是降雨 */
  function precipitation(seasonId) {
    return seasonId === "WINTER" ? "snow" : "rain";
  }

  global.BlissCore = {
    CURVES,
    SEASONS,
    PALETTE,
    SKY,
    BASE,
    blendFactors,
    phase,
    dominant,
    mixLinear,
    mixSky,
    skyToCss,
    applyIntensity,
    paletteAt,
    precipitation,
    clamp01
  };
})(window);
