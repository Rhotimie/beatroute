/** Automated rendering checks over every converted screen. Run LINT.run() in phone.html. */
const LINT = (() => {
  const W = 360, H = 740;
  const box = Object.assign(document.createElement("div"), {});
  box.style.cssText = `position:fixed;left:-6000px;top:0;width:${W}px;height:${H - 24}px;overflow:hidden`;
  document.body.appendChild(box);
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const hidden = el => { for (let e = el; e && e !== box; e = e.parentElement) { const s = getComputedStyle(e); if (s.visibility === "hidden" || s.display === "none" || s.opacity === "0") return true; } return false; };
  const clipped = el => { for (let e = el.parentElement; e && e !== box; e = e.parentElement) if (e.classList.contains("scroll") || e.style.overflow === "hidden") return true; return false; };

  function check(name, screen) {
    state.showGone = false;
    const root = renderScreen(screen, box, W, H), out = {}, add = (k, d) => (out[k] = out[k] || []).push(d);
    const base = box.getBoundingClientRect(), texts = [];
    let leaves = 0;
    box.querySelectorAll(".n").forEach(el => {
      const n = el._n; if (!n || hidden(el)) return;
      const r = el.getBoundingClientRect();
      if (n.k === "text") {
        const sp = el.querySelector("span");
        const txt = (sp && sp.textContent || "").trim();
        if (txt) { leaves++; if (r.width <= 1 || r.height <= 1) add("zeroSizeText", `${n.id}:"${txt.slice(0, 20)}"`); }
        if (sp && txt) {
          const cs = getComputedStyle(sp);
          if (sp.scrollWidth > sp.clientWidth + 1 && cs.textOverflow === "ellipsis") add("ellipsized", n.id || txt.slice(0, 16));
          else if (sp.scrollWidth > sp.clientWidth + 1) add("textOverflowX", n.id || txt.slice(0, 16));
          if (sp.scrollHeight > sp.clientHeight + 2 && cs.display !== "-webkit-box") add("textOverflowY", n.id || txt.slice(0, 16));
          const rg = document.createRange(); rg.selectNodeContents(sp);
          texts.push({ id: n.id || txt.slice(0, 14), r: rg.getBoundingClientRect() });
        }
      } else if (n.k === "image" && n.d.src) leaves++;
      else if (n.d.background && n.d.background.bg) leaves += 0.2;
      if ((n.k === "text" || n.k === "image") && !clipped(el) && (r.left >= base.right - 1 || r.right <= base.left + 1 || r.top >= base.bottom || r.bottom <= base.top) && r.width > 1)
        add("offscreen", n.id || n.tag);
      if (el.classList.contains("ph") && n.k === "list") add("listPlaceholder", n.id);
      if (el.classList.contains("ph") && n.k === "fragment") add("fragmentPlaceholder", n.id);
    });
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i], b = texts[j], ov = inter(a.r, b.r), m = Math.min(a.r.width * a.r.height, b.r.width * b.r.height);
      if (m > 4 && ov / m > 0.3) add("textOverlap", `${a.id}|${b.id}`);
    }
    if (leaves < 4) add("nearlyEmpty", `${leaves.toFixed(1)} visible leaves`);
    box.innerHTML = "";
    return out;
  }

  async function run(names) {
    const res = {}, tally = {};
    for (const m of MANIFEST) {
      if (names && !names.includes(m.name)) continue;
      const issues = check(m.name, await load(m.name));
      res[m.name] = issues;
      for (const k in issues) (tally[k] = tally[k] || []).push([m.name, issues[k].length]);
    }
    const summary = Object.fromEntries(Object.entries(tally).map(([k, v]) => [k, { screens: v.length, total: v.reduce((a, x) => a + x[1], 0), worst: v.sort((a, b) => b[1] - a[1]).slice(0, 6) }]));
    return { summary, res };
  }
  return { run, check };
})();
