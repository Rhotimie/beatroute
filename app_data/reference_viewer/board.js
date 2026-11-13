/** Figma-style board: every converted screen as a frame on a pannable, zoomable canvas. */
const $ = id => document.getElementById(id);
const esc = v => String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const FW = 360, FH = 740, GX = 70, GY = 80, COLS = 6, HEAD = 90;
const ORDER = ["Sign-in", "Attendance", "Beat plan", "Customers", "Distributors", "Orders", "Stock", "Payment", "Visit",
               "Campaigns", "Approvals", "Team", "Expenses and assets", "Learning", "Other", "Third-party SDK"];
const view = { x: 40, y: 40, k: 0.7 };
let selected = null;
const frames = new Map();

/* ----- layout of frames in sections ----- */
function buildBoard() {
  const groups = {};
  MANIFEST.forEach(m => (groups[m.area] = groups[m.area] || []).push(m));
  let y = 0;
  for (const area of ORDER.filter(a => groups[a])) {
    const items = groups[area].sort((a, b) => a.title.localeCompare(b.title));
    const h = document.createElement("div");
    h.className = "area"; h.style.cssText = `left:0;top:${y}px`;
    h.innerHTML = `${esc(area)}<small>${items.length} screens</small>`;
    $("canvas").appendChild(h);
    y += HEAD + 30;
    items.forEach((m, i) => addFrame(m, (i % COLS) * (FW + GX), y + Math.floor(i / COLS) * (FH + GY)));
    y += Math.ceil(items.length / COLS) * (FH + GY) + 60;
  }
  $("canvas").style.height = y + "px";
  $("count").textContent = MANIFEST.length + " screens";
}

function addFrame(m, x, y) {
  const el = document.createElement("div");
  el.className = "frame"; el.style.cssText = `left:${x}px;top:${y}px`;
  el.innerHTML = `<div class="label">${esc(m.title)}<i>${esc(m.layout)}</i></div><div class="shell"><div class="sbar">9:41</div><div class="skel">${esc(m.title)}</div></div>`;
  el.onclick = e => { e.stopPropagation(); select(m.name); };
  el.ondblclick = () => zoomTo(m.name);
  $("canvas").appendChild(el);
  frames.set(m.name, { m, el, x, y, state: "idle" });
}

/* ----- lazy rendering ----- */
function loadScreen(name) {
  return new Promise((res, rej) => {
    if (window.SCREENS && SCREENS[name]) return res(SCREENS[name]);
    const s = document.createElement("script");
    s.src = `screens/${name}.js`; s.onload = () => res(SCREENS[name]); s.onerror = () => rej(new Error("missing " + name));
    document.head.appendChild(s);
  });
}
async function renderFrame(f) {
  if (f.state !== "idle") return;
  f.state = "loading";
  const shell = f.el.querySelector(".shell");
  try {
    const screen = await loadScreen(f.m.name);
    const scr = document.createElement("div"); scr.className = "scr";
    shell.appendChild(scr);
    f.root = renderScreen(screen, scr);
    shell.querySelector(".skel")?.remove();
    f.state = "done";
  } catch (e) {
    shell.querySelector(".skel")?.remove();
    shell.insertAdjacentHTML("beforeend", `<div class="err">render error\n${esc(e.message)}</div>`);
    f.state = "error"; f.error = e.message; console.error(f.m.name, e);
  }
}
function visibleFrames() {
  const W = $("board").clientWidth, H = $("board").clientHeight, m = 200;
  return [...frames.values()].filter(f => {
    const l = view.x + f.x * view.k, t = view.y + f.y * view.k;
    return l < W + m && l + FW * view.k > -m && t < H + m && t + FH * view.k > -m;
  });
}
let pending = false, flowK = 0;
function refresh() {
  if (view.k !== flowK) { flowK = view.k; drawFlows(); }
  $("canvas").style.transform = `translate(${view.x}px,${view.y}px) scale(${view.k})`;
  $("zpct").textContent = Math.round(view.k * 100) + "%";
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => { pending = false; if (view.k >= 0.15) visibleFrames().forEach(renderFrame); });
}

/* ----- pan and zoom ----- */
const clampK = k => Math.min(3, Math.max(0.04, k));
function zoomAt(k2, mx, my) {
  k2 = clampK(k2);
  view.x = mx - (mx - view.x) * (k2 / view.k); view.y = my - (my - view.y) * (k2 / view.k); view.k = k2;
  refresh();
}
$("board").addEventListener("wheel", e => {
  e.preventDefault();
  const r = $("board").getBoundingClientRect();
  if (e.ctrlKey || e.metaKey) zoomAt(view.k * Math.exp(-e.deltaY * 0.01), e.clientX - r.left, e.clientY - r.top);
  else { view.x -= e.deltaX; view.y -= e.deltaY; refresh(); }
}, { passive: false });
let drag = null;
$("board").addEventListener("mousedown", e => {
  if (e.target.closest(".frame") && e.button === 0) return;
  drag = { x: e.clientX - view.x, y: e.clientY - view.y }; $("board").classList.add("drag");
});
addEventListener("mousemove", e => { if (drag) { view.x = e.clientX - drag.x; view.y = e.clientY - drag.y; refresh(); } });
addEventListener("mouseup", () => { drag = null; $("board").classList.remove("drag"); });
$("board").addEventListener("click", () => select(null));
const mid = () => [$("board").clientWidth / 2, $("board").clientHeight / 2];
$("zin").onclick = () => zoomAt(view.k * 1.25, ...mid());
$("zout").onclick = () => zoomAt(view.k / 1.25, ...mid());
$("zfit").onclick = () => { view.k = clampK(($("board").clientWidth - 80) / (COLS * (FW + GX))); view.x = 40; view.y = 40; refresh(); };
function zoomTo(name) {
  const f = frames.get(name), k = clampK(Math.min(1.5, ($("board").clientHeight - 90) / (FH + 30)));
  view.k = k; view.x = ($("board").clientWidth - FW * k) / 2 - f.x * k; view.y = 50 - f.y * k + 10; refresh();
}

/* ----- selection, flows, layers ----- */
function select(name) {
  selected = name;
  frames.forEach((f, n) => f.el.classList.toggle("sel", n === name));
  document.querySelectorAll("#tree a").forEach(a => a.classList.toggle("on", a.dataset.n === name));
  drawFlows();
  const f = name && frames.get(name);
  if (!f) { $("info").textContent = "Select a frame, then hover any view to inspect it."; return; }
  const m = f.m, incoming = MANIFEST.filter(x => x.opens.includes(m.name));
  $("info").innerHTML = `<h3>${esc(m.title)}</h3>layout: ${esc(m.layout)}\nactivity: ${esc(m.activity.split(".").slice(-2).join("."))}\narea: ${esc(m.area)}\n\n` +
    (m.opens.length ? "Opens:\n" : "Opens: nothing found\n") + m.opens.map(o => `<a data-n="${esc(o)}">-> ${esc(frames.get(o).m.title)}</a>`).join("") +
    (incoming.length ? "\nOpened from:\n" : "") + incoming.map(o => `<a data-n="${esc(o.name)}"><- ${esc(o.title)}</a>`).join("") + "\n\nHover a view to inspect it.";
}
$("info").addEventListener("click", e => { const n = e.target.dataset.n; if (n) { select(n); zoomTo(n); } });

function drawFlows() {
  const svg = $("flows");
  svg.innerHTML = '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#0d99ff"/></marker></defs>';
  if (!selected) return;
  const src = frames.get(selected), edges = [];
  src.m.opens.forEach(t => edges.push([src, frames.get(t), false]));
  MANIFEST.filter(x => x.opens.includes(selected)).forEach(x => edges.push([frames.get(x.name), src, true]));
  for (const [a, b, incoming] of edges) {
    const x1 = a.x + FW, y1 = a.y + FH / 2, x2 = b.x, y2 = b.y + FH / 2, dx = Math.max(120, Math.abs(x2 - x1) / 2);
    const back = x2 < x1 + 20;
    const p = back ? `M${a.x + FW / 2} ${a.y + FH} C${a.x + FW / 2} ${a.y + FH + 160} ${b.x + FW / 2} ${b.y - 160} ${b.x + FW / 2} ${b.y}`
                   : `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
    svg.insertAdjacentHTML("beforeend", `<path d="${p}" fill="none" stroke="#0d99ff" stroke-width="${2.5 / view.k}" ${incoming ? 'stroke-dasharray="14 10" opacity=".55"' : ""} marker-end="url(#ah)"/>`);
  }
}

function buildTree(q = "") {
  const groups = {};
  MANIFEST.filter(m => (m.title + m.layout).toLowerCase().includes(q.toLowerCase())).forEach(m => (groups[m.area] = groups[m.area] || []).push(m));
  $("tree").innerHTML = ORDER.filter(a => groups[a]).map(a => `<h4>${esc(a)} (${groups[a].length})</h4>` +
    groups[a].sort((x, y) => x.title.localeCompare(y.title)).map(m => `<a data-n="${esc(m.name)}">${esc(m.title)}</a>`).join("")).join("");
}
$("tree").addEventListener("click", e => { const n = e.target.dataset.n; if (n) { select(n); zoomTo(n); } });
$("search").addEventListener("input", e => buildTree(e.target.value));

/* ----- inspector ----- */
function describe(n, el, frame) {
  const f = el.getBoundingClientRect(), p = frame.querySelector(".scr").getBoundingClientRect();
  const keep = Object.entries(n.a).filter(([k]) => /^(layout_|gravity|orientation|padding|visibility|text$|textSize|weightSum|background)/.test(k));
  return `<h3>${esc(n.tag)}  #${esc(n.id || "(no id)")}</h3>kind: ${esc(n.k)}\nx,y: ${Math.round((f.left - p.left) / view.k)}, ${Math.round((f.top - p.top) / view.k)}\n` +
    `size: ${Math.round(n.mw)} x ${Math.round(n.mh)}\n${n.autoItem ? `rows: ${esc(n.autoItem)} (${esc(n.autoHow)}${n.autoHow === "guess" ? ", unverified" : ""})\n` : ""}margin: ${n.mar.l} ${n.mar.t} ${n.mar.r} ${n.mar.b}\npadding: ${n.pad.l} ${n.pad.t} ${n.pad.r} ${n.pad.b}\n\n` +
    keep.map(([k, v]) => `${esc(k)} = ${esc(v)}`).join("\n");
}
$("canvas").addEventListener("mouseover", e => {
  document.querySelectorAll(".hl").forEach(x => x.classList.remove("hl"));
  const el = e.target.closest(".n"), frame = e.target.closest(".frame");
  if (!el || !el._n || !frame) return;
  el.classList.add("hl");
  $("info").innerHTML = describe(el._n, el, frame);
});
$("gone").onchange = e => { state.showGone = e.target.checked; frames.forEach(f => { if (f.state === "done" || f.state === "error") { f.el.querySelector(".scr")?.remove(); f.el.querySelector(".err")?.remove(); f.state = "idle"; } }); refresh(); };

/* ----- test helper: render everything and report problems ----- */
window.BOARD = {
  frames,
  async renderAll() {
    const bad = [];
    for (const f of frames.values()) {
      await renderFrame(f);
      if (f.state === "error") bad.push([f.m.name, f.error]);
      else if (f.root) {
        let nan = 0; (function walk(n) { if (!laid(n)) return; if (!isFinite(n.mw) || !isFinite(n.mh) || !isFinite(n.x) || !isFinite(n.y)) nan++; n.c.forEach(walk); })(f.root);
        if (nan) bad.push([f.m.name, nan + " nodes with NaN geometry"]);
      }
    }
    return bad;
  }
};

buildBoard(); buildTree();
$("zfit").click();
select(location.hash.slice(1) in Object.fromEntries(MANIFEST.map(m => [m.name, 1])) ? location.hash.slice(1) : null);
