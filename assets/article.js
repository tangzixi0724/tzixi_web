/* 二级页面共用交互：入场、指针柔光、玻璃高光、阅读进度、目录高亮 */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- 页面类型：模组 / 地图 / 光影，各自一套排版 ---- */
var typeMatch = location.pathname.match(/\/(mods|saves|shaders)\//);
if (typeMatch) document.body.setAttribute("data-type", typeMatch[1]);

/* ---- 入场：依次浮现（主页同款节奏） ---- */
const revealables = [
  document.querySelector(".topbar"),
  document.querySelector(".sub-head"),
  ...document.querySelectorAll(".sub-main > *"),
  ...document.querySelectorAll(".sub-side > *"),
].filter(Boolean);

revealables.forEach((el, i) => {
  el.classList.add("reveal");
  el.style.transitionDelay = reduceMotion ? "0ms" : Math.min(60 * i, 540) + "ms";
});
requestAnimationFrame(() => requestAnimationFrame(() => revealables.forEach((el) => el.classList.add("is-in"))));

/* 从浏览器缓存返回时不要再播一次入场：字体/排版会先被压缩再展开（用户反馈的 bug） */
window.addEventListener("pageshow", (e) => {
  if (!e.persisted) return;
  document.documentElement.classList.add("no-anim");
  revealables.forEach((el) => { el.style.transitionDelay = "0ms"; el.classList.add("is-in"); });
});

/* ---- 指针柔光 ---- */
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
    light.style.opacity = "0.5";
    if (!raf) raf = requestAnimationFrame(loop);
  });
  window.addEventListener("pointerleave", () => { light.style.opacity = "0"; });
}

/* ---- 玻璃：指针位置写进 --mx/--my ---- */
document.querySelectorAll(".glass").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
    card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
  });
});

/* ---- 阅读进度 ---- */
const fill = document.querySelector(".read-progress__fill");
function updateProgress() {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (fill) fill.style.width = (h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) * 100 : 0).toFixed(2) + "%";
}
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

/* ---- 目录高亮 ---- */
const links = [...document.querySelectorAll(".toc__link")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if (sections.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = "#" + entry.target.id;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === id));
      });
    },
    { rootMargin: "-96px 0px -65% 0px", threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));
}

/* ---- 回到顶部 ---- */
document.querySelector("[data-to-top]")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---- 下载：按「游戏版本 / 加载器」筛选（Modrinth 式） ---- */
document.querySelectorAll("[data-dl]").forEach((root) => {
  const files = [...root.querySelectorAll(".dl__file")];
  if (!files.length) return;
  const mcSel = root.querySelector('[data-dl-filter="mc"]');
  const ldSel = root.querySelector('[data-dl-filter="loader"]');
  const count = root.querySelector("[data-dl-count]");
  const none = root.querySelector(".dl__none");
  const apply = () => {
    const mc = mcSel ? mcSel.value : "";
    const ld = ldSel ? ldSel.value : "";
    let shown = 0;
    files.forEach((f) => {
      const hit = (!mc || f.dataset.mc === mc) && (!ld || f.dataset.loader === ld);
      f.hidden = !hit;
      if (hit) shown++;
    });
    if (count) count.textContent = shown + " 个文件";
    if (none) none.hidden = shown !== 0;
  };
  mcSel?.addEventListener("change", apply);
  ldSel?.addEventListener("change", apply);
  apply();
});

/* ---- 上一篇 / 下一篇 / 相关页面（读 /assets/pages.json，静态也能工作） ---- */
(function () {
  var m = location.pathname.match(/^(.*\/)(mods|saves|shaders)\/([^\/]+)\/?$/);
  if (!m) return;
  var host = document.querySelector(".sub-page");
  if (!host) return;
  var prefix = m[1];
  var type = m[2];
  var slug = decodeURIComponent(m[3]);

  fetch(prefix + "assets/pages.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      var list = ((data && data.types && data.types[type]) || []).slice();
      if (!list.length) return;
      var idx = -1;
      list.forEach(function (p, i) { if (p.slug === slug) idx = i; });
      if (idx < 0) return;
      var cur = list[idx];
      var prev = list[idx - 1] || null;
      var next = list[idx + 1] || null;
      /* 预取相邻页与上级列表：静态站也能做到点了就到位（放在提前 return 之前，单页时也要预热列表） */
      [prev, next, { slug: "" }].forEach(function (p) {
        var l = document.createElement("link");
        l.rel = "prefetch";
        l.href = prefix + type + "/" + p.slug;
        document.head.appendChild(l);
      });

      if (!prev && !next) return;

      var myTags = cur.tags || [];
      var related = list
        .filter(function (p) { return p.slug !== slug; })
        .map(function (p) {
          var share = (p.tags || []).filter(function (t) { return myTags.indexOf(t) >= 0; }).length;
          return { p: p, share: share };
        })
        .filter(function (x) { return x.share > 0; })
        .sort(function (a, b) { return b.share - a.share || b.p.time - a.p.time; })
        .slice(0, 3)
        .map(function (x) { return x.p; });

      function card(p, label, cls) {
        var thumb = p.cover
          ? '<span class="pg-card__thumb"><img src="' + prefix + type + "/" + p.slug + "/" + p.cover + '" alt="" loading="lazy" /></span>'
          : "";
        return (
          '<a class="pg-card glass ' + cls + '" href="' + prefix + type + "/" + p.slug + '/">' +
          '<span class="pg-card__label">' + label + "</span>" +
          '<span class="pg-card__body">' + thumb +
          '<span class="pg-card__text"><span class="pg-card__zh">' + p.zh + "</span>" +
          '<span class="pg-card__en">' + (p.en || p.slug) + "</span></span></span>" +
          "</a>"
        );
      }

      var html = '<nav class="pager" aria-label="上一篇 / 下一篇">';
      html += prev ? card(prev, "← 上一篇", "pg-card--prev") : '<span class="pager__gap" aria-hidden="true"></span>';
      html += next ? card(next, "下一篇 →", "pg-card--next") : '<span class="pager__gap" aria-hidden="true"></span>';
      html += "</nav>";

      if (related.length) {
        html += '<section class="related" aria-label="相关页面"><h2 class="related__title">相关页面</h2><div class="related__grid">';
        related.forEach(function (p) { html += card(p, p.date || "", "pg-card--mini"); });
        html += "</div></section>";
      }

      var box = document.createElement("div");
      box.className = "pager-wrap";
      box.innerHTML = html;
      host.appendChild(box);
    })
    .catch(function () {});
})();


/* ---- 正文自动链接：老页面不用重新生成，打开就能点 ---- */
(function () {
  var re = /https?:\/\/[^\s<>"'\u3000-\u303f\uff00-\uffef]+/g;
  var hosts = document.querySelectorAll(".block p, .block li, .block dd, .block td, .sub-sub, .endnote");
  hosts.forEach(function (host) {
    var nodes = [];
    var walk = function (el) {
      Array.prototype.forEach.call(el.childNodes, function (n) {
        if (n.nodeType === 3) nodes.push(n);
        else if (n.nodeType === 1 && !/^(A|CODE|PRE|SCRIPT|STYLE|BUTTON)$/.test(n.tagName)) walk(n);
      });
    };
    walk(host);
    nodes.forEach(function (node) {
      var text = node.nodeValue || "";
      re.lastIndex = 0;
      if (!re.test(text)) return;
      var frag = document.createDocumentFragment();
      var last = 0, m;
      re.lastIndex = 0;
      while ((m = re.exec(text))) {
        var url = m[0].replace(/[.,;:!?)]+$/, "");
        if (!url) continue;
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        var a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = url;
        frag.appendChild(a);
        last = m.index + url.length;
        re.lastIndex = last;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  });
})();
