/* 子茜的小站 · 交互（无依赖） */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- 入场：依次浮现 ---- */
const revealables = [
  document.querySelector(".hero"),
  ...document.querySelectorAll(".nav-link"),
  document.querySelector(".foot"),
].filter(Boolean);

revealables.forEach((el, i) => {
  el.classList.add("reveal");
  el.style.transitionDelay = reduceMotion ? "0ms" : 90 * i + "ms";
});
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    revealables.forEach((el) => el.classList.add("is-in"));
  });
});

/* ---- 卡片：跟随指针的液体高光 ---- */
document.querySelectorAll(".nav-link").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
    card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
  });
});

/* ---- 全局柔光跟随（仅精确指针） ---- */
const light = document.querySelector(".cursor-light");
if (light && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const loop = () => {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    light.style.transform = `translate3d(${cx - light.offsetWidth / 2}px, ${cy - light.offsetHeight / 2}px, 0)`;
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.4 ? requestAnimationFrame(loop) : 0;
  };
  window.addEventListener("pointermove", (e) => {
    tx = e.clientX; ty = e.clientY;
    light.style.opacity = "0.55";
    if (!raf) raf = requestAnimationFrame(loop);
  });
  window.addEventListener("pointerleave", () => { light.style.opacity = "0"; });
}

/* ---- 吐司 ---- */
const toastEl = document.getElementById("toast");
let toastTimer = 0;
function toast(text) {
  toastEl.textContent = text;
  toastEl.dataset.show = "true";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.dataset.show = "false"; }, 2000);
}

/* ---- 入口卡片：占位页提示 ---- */
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    // 真实的二级页面照常跳转，只有占位锚点才提示
    if (!(link.getAttribute("href") || "").startsWith("#")) return;
    e.preventDefault();
    const name = link.dataset.page || "这里";
    toast(`「${name}」板块正在整理中`);
  });
});

/* ---- 关于弹窗 ---- */
const dialog = document.getElementById("aboutDialog");
document.querySelector("[data-open-about]")?.addEventListener("click", () => {
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
});
dialog?.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});
dialog?.addEventListener("close", () => {
  document.querySelector("[data-open-about]")?.focus({ preventScroll: true });
});
