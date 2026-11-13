/** Mini Android layout engine: measure, layout, then render to DOM.
 *  Ported from the AOSP rules for LinearLayout, RelativeLayout, FrameLayout and ScrollView.
 *  1dp = 1css px in a 360px wide phone. Approximate, not pixel exact. */
const MATCH = -1, WRAP = -2;
const state = { showGone: false };
const spec = (m, s) => ({ m, s }); // m: E exactly, A at most, U unspecified

const dim = (v, d = 0) => {
  if (v == null || v === "") return d;
  if (v === "match_parent" || v === "fill_parent") return MATCH;
  if (v === "wrap_content") return WRAP;
  const m = /^(-?[\d.]+)(dp|sp|dip|px)?$/.exec(String(v));
  return m ? parseFloat(m[1]) : d;
};
const num = (n, k, d = 0) => dim(n.a[k], d);
const laid = n => n.a.visibility !== "gone" || state.showGone;

function box(n, kind) {
  const all = num(n, kind), h = n.a[kind + "Horizontal"] != null ? num(n, kind + "Horizontal") : all;
  const v = n.a[kind + "Vertical"] != null ? num(n, kind + "Vertical") : all;
  const pick = (...ks) => { for (const k of ks) if (n.a[k] != null) return num(n, k); };
  return { l: pick(kind + "Left", kind + "Start") ?? h, r: pick(kind + "Right", kind + "End") ?? h,
           t: pick(kind + "Top") ?? v, b: pick(kind + "Bottom") ?? v };
}

const grav = s => {
  const t = new Set(String(s || "").split("|"));
  const c = t.has("center");
  return { h: c || t.has("center_horizontal") ? "c" : t.has("right") || t.has("end") ? "r" : "l",
           v: c || t.has("center_vertical") ? "c" : t.has("bottom") ? "b" : "t" };
};

/** Precompute padding, margin and layout size on every node. */
function prep(n, parent) {
  n.parent = parent;
  n.pad = box(n, "padding"); n.mar = box(n, "layout_margin");
  n.lw = dim(n.a.layout_width, WRAP); n.lh = dim(n.a.layout_height, WRAP);
  n.c.forEach(c => prep(c, n));
}

function childSpec(ps, pad, d) {
  const size = Math.max(0, ps.s - pad);
  if (ps.m === "E") return d >= 0 ? spec("E", d) : d === MATCH ? spec("E", size) : spec("A", size);
  if (ps.m === "A") return d >= 0 ? spec("E", d) : spec("A", size);
  return d >= 0 ? spec("E", d) : spec("U", 0);
}
const resolveSize = (size, s) => (s.m === "E" ? s.s : s.m === "A" ? Math.min(size, s.s) : size);

function finish(n, ws, hs, cw, ch) {
  n.mw = resolveSize(Math.max(cw + n.pad.l + n.pad.r, num(n, "minWidth")), ws);
  n.mh = resolveSize(Math.max(ch + n.pad.t + n.pad.b, num(n, "minHeight")), hs);
}
const hMar = c => c.mar.l + c.mar.r, vMar = c => c.mar.t + c.mar.b;
const specFor = (n, c, ws, hs) => [childSpec(ws, n.pad.l + n.pad.r + hMar(c), c.lw), childSpec(hs, n.pad.t + n.pad.b + vMar(c), c.lh)];

function measure(n, ws, hs) {
  if (!laid(n)) { n.mw = n.mh = 0; return; }
  (MEASURE[n.k] || measureFrame)(n, ws, hs);
}

/* ---------- containers ---------- */
function measureFrame(n, ws, hs) {
  let mw = 0, mh = 0; const match = [];
  for (const c of n.c.filter(laid)) {
    measure(c, ...specFor(n, c, ws, hs));
    mw = Math.max(mw, c.mw + hMar(c)); mh = Math.max(mh, c.mh + vMar(c));
    if ((ws.m !== "E" && c.lw === MATCH) || (hs.m !== "E" && c.lh === MATCH)) match.push(c);
  }
  finish(n, ws, hs, mw, mh);
  for (const c of match) {
    const w = c.lw === MATCH ? spec("E", n.mw - n.pad.l - n.pad.r - hMar(c)) : childSpec(ws, n.pad.l + n.pad.r + hMar(c), c.lw);
    const h = c.lh === MATCH ? spec("E", n.mh - n.pad.t - n.pad.b - vMar(c)) : childSpec(hs, n.pad.t + n.pad.b + vMar(c), c.lh);
    measure(c, w, h);
  }
}
function layoutFrame(n) {
  for (const c of n.c.filter(laid)) {
    const g = grav(c.a.layout_gravity), cw = n.mw - n.pad.l - n.pad.r, ch = n.mh - n.pad.t - n.pad.b;
    c.x = n.pad.l + (g.h === "c" ? (cw - c.mw - hMar(c)) / 2 : g.h === "r" ? cw - c.mw - hMar(c) : 0) + c.mar.l;
    c.y = n.pad.t + (g.v === "c" ? (ch - c.mh - vMar(c)) / 2 : g.v === "b" ? ch - c.mh - vMar(c) : 0) + c.mar.t;
  }
}

function measureCoordinator(n, ws, hs) {
  const kids = n.c.filter(laid), bar = kids.find(c => c.tag === "AppBarLayout");
  let mw = 0, mh = 0;
  for (const c of kids) {
    let [w, h] = specFor(n, c, ws, hs);
    const scrolling = bar && c !== bar && /ScrollingViewBehavior|scrolling_view_behavior/.test(c.a.layout_behavior || "");
    if (scrolling && h.m !== "U") h = spec(h.m, Math.max(0, h.s - bar.mh));
    measure(c, w, h);
    mw = Math.max(mw, c.mw + hMar(c)); mh = Math.max(mh, c.mh + vMar(c));
    if (c === bar) n.barH = c.mh;
  }
  finish(n, ws, hs, mw, mh);
}
function layoutCoordinator(n) {
  layoutFrame(n);
  const bar = n.c.find(c => c.tag === "AppBarLayout" && laid(c));
  for (const c of n.c.filter(laid)) if (bar && c !== bar && /ScrollingViewBehavior|scrolling_view_behavior/.test(c.a.layout_behavior || "")) c.y += bar.mh;
}

function measureScroll(n, ws, hs) {
  const hor = n.k === "hscroll", c = n.c.filter(laid)[0];
  if (c) {
    const [w, h] = specFor(n, c, ws, hs);
    measure(c, hor ? spec("U", 0) : w, hor ? h : spec("U", 0));
  }
  finish(n, ws, hs, c ? c.mw + hMar(c) : 0, c ? c.mh + vMar(c) : 0);
  if (c && n.a.fillViewport === "true" && !hor && hs.m === "E" && c.mh < n.mh) measure(c, spec("E", c.mw), spec("E", n.mh - n.pad.t - n.pad.b - vMar(c)));
}
function layoutScroll(n) {
  for (const c of n.c.filter(laid)) { c.x = n.pad.l + c.mar.l; c.y = n.pad.t + c.mar.t; }
}

function measureLinear(n, ws, hs) {
  const vert = n.a.orientation === "vertical", kids = n.c.filter(laid);
  const padMain = vert ? n.pad.t + n.pad.b : n.pad.l + n.pad.r, padCross = vert ? n.pad.l + n.pad.r : n.pad.t + n.pad.b;
  const mainSpec = vert ? hs : ws, crossSpec = vert ? ws : hs;
  const mainOf = c => (vert ? c.lh : c.lw), crossOf = c => (vert ? c.lw : c.lh);
  const mm = c => (vert ? vMar(c) : hMar(c)), cm = c => (vert ? hMar(c) : vMar(c));
  const ms = c => (vert ? c.mh : c.mw), cs = c => (vert ? c.mw : c.mh);
  const run = (c, mainS, crossS) => (vert ? measure(c, crossS, mainS) : measure(c, mainS, crossS));
  const weight = c => parseFloat(c.a.layout_weight || 0);
  const crossFor = c => childSpec(crossSpec, padCross + cm(c), crossOf(c));
  const skip = c => weight(c) > 0 && mainOf(c) === 0 && mainSpec.m === "E";
  let total = 0, maxCross = 0, wsum = parseFloat(n.a.weightSum || 0) || 0, seen = 0; const matchCross = [];
  for (const c of kids) {
    seen += weight(c);
    if (!n.a.weightSum) wsum += weight(c);
    if (skip(c)) { total += mm(c); continue; }
    const d = weight(c) > 0 && mainOf(c) === 0 ? WRAP : mainOf(c);
    const avail = mainSpec.m === "U" || n.clip ? spec("U", 0) : spec(mainSpec.m, Math.max(0, mainSpec.s - (seen > 0 ? 0 : total)));
    run(c, childSpec(avail, padMain + mm(c), d), crossFor(c));
    total += ms(c) + mm(c); maxCross = Math.max(maxCross, cs(c) + cm(c));
    if (crossOf(c) === MATCH && crossSpec.m !== "E") matchCross.push(c);
  }
  const resolved = resolveSize(total + padMain, mainSpec);
  let excess = resolved - padMain - total, remaining = wsum;
  if (wsum > 0 && excess !== 0) {
    for (const c of kids.filter(k => weight(k) > 0)) {
      const share = excess * weight(c) / remaining; excess -= share; remaining -= weight(c);
      const before = skip(c) ? 0 : ms(c), target = Math.max(0, before + share);
      run(c, spec("E", target), crossFor(c));
      total += ms(c) - before; maxCross = Math.max(maxCross, cs(c) + cm(c));
    }
  }
  const crossSize = resolveSize(maxCross + padCross, crossSpec);
  for (const c of matchCross) run(c, spec("E", ms(c)), spec("E", crossSize - padCross - cm(c)));
  if (vert) finish(n, ws, hs, maxCross, total); else finish(n, ws, hs, total, maxCross);
}
function layoutLinear(n) {
  const vert = n.a.orientation === "vertical", kids = n.c.filter(laid), g = grav(n.a.gravity);
  const ms = c => (vert ? c.mh + vMar(c) : c.mw + hMar(c)), cs = c => (vert ? c.mw + hMar(c) : c.mh + vMar(c));
  const contentMain = vert ? n.mh - n.pad.t - n.pad.b : n.mw - n.pad.l - n.pad.r;
  const contentCross = vert ? n.mw - n.pad.l - n.pad.r : n.mh - n.pad.t - n.pad.b;
  const used = kids.reduce((a, c) => a + ms(c), 0), mg = vert ? g.v : g.h;
  let pos = (vert ? n.pad.t : n.pad.l) + (mg === "c" ? (contentMain - used) / 2 : mg === "r" || mg === "b" ? contentMain - used : 0);
  for (const c of kids) {
    const cg = c.a.layout_gravity ? grav(c.a.layout_gravity) : g, al = vert ? cg.h : cg.v;
    const room = contentCross - cs(c), start = vert ? n.pad.l : n.pad.t;
    const cross = start + (al === "c" ? room / 2 : al === "r" || al === "b" ? room : 0);
    if (vert) { c.y = pos + c.mar.t; c.x = cross + c.mar.l; } else { c.x = pos + c.mar.l; c.y = cross + c.mar.t; }
    pos += ms(c);
  }
}

/* ---------- RelativeLayout (port of the AOSP two-pass algorithm) ---------- */
const REL = { toLeftOf: "left", toStartOf: "left", toRightOf: "right", toEndOf: "right", above: "above", below: "below",
              alignLeft: "alignLeft", alignStart: "alignLeft", alignRight: "alignRight", alignEnd: "alignRight",
              alignTop: "alignTop", alignBottom: "alignBottom", alignBaseline: "alignTop" };
const ruleOf = (c, name) => { for (const k in REL) if (REL[k] === name && c.a["layout_" + k]) return c.a["layout_" + k]; };
const yes = (c, ...ks) => ks.some(k => c.a["layout_" + k] === "true");

function anchor(n, c, name) {
  let id = ruleOf(c, name), a = id && n.c.find(x => x.id === id), guard = 0;
  while (a && !laid(a) && guard++ < 10) { id = ruleOf(a, name); a = id && n.c.find(x => x.id === id); }
  return a && laid(a) ? a : null;
}
function sortRel(n, kids, names) {
  const out = [], left = [...kids];
  while (left.length) {
    const i = Math.max(0, left.findIndex(c => names.every(nm => { const a = anchor(n, c, nm); return !a || out.includes(a) || a === c; })));
    out.push(left.splice(i, 1)[0]);
  }
  return out;
}
function relChildSpec(cs, ce, size, ms, me, ps, pe, mine) {
  if (mine < 0) return cs != null && ce != null ? spec("E", Math.max(0, ce - cs)) : size >= 0 ? spec("E", size) : spec("U", 0);
  const ts = cs ?? ps + ms, te = ce ?? mine - pe - me, avail = te - ts;
  if (cs != null && ce != null) return spec("E", Math.max(0, avail));
  if (size >= 0) return spec("E", avail >= 0 ? Math.min(avail, size) : size);
  if (size === MATCH) return spec("E", Math.max(0, avail));
  return avail >= 0 ? spec("A", Math.max(0, avail)) : spec("U", 0);
}

function measureRelative(n, ws, hs) {
  const kids = n.c.filter(laid), { l: pl, r: pr, t: pt, b: pb } = n.pad;
  const myW = ws.m === "U" ? -1 : ws.s, myH = hs.m === "U" ? -1 : hs.s, wrapW = ws.m !== "E", wrapH = hs.m !== "E";
  let width = ws.m === "E" ? ws.s : 0, height = hs.m === "E" ? hs.s : 0;
  const H = sortRel(n, kids, ["left", "right", "alignLeft", "alignRight"]), V = sortRel(n, kids, ["above", "below", "alignTop", "alignBottom"]);
  kids.forEach(c => (c.p = {}));
  for (const c of H) {
    const p = c.p, a = nm => anchor(n, c, nm);
    p.l = p.r = undefined;
    let s;
    if ((s = a("left"))) p.r = s.p.l - s.mar.l - c.mar.r;
    if ((s = a("right"))) p.l = s.p.r + s.mar.r + c.mar.l;
    if ((s = a("alignLeft"))) p.l = s.p.l + c.mar.l;
    if ((s = a("alignRight"))) p.r = s.p.r - c.mar.r;
    if (yes(c, "alignParentLeft", "alignParentStart") && p.l === undefined) p.l = pl + c.mar.l;
    if (yes(c, "alignParentRight", "alignParentEnd") && myW >= 0 && p.r === undefined) p.r = myW - pr - c.mar.r;
    const cw = relChildSpec(p.l, p.r, c.lw, c.mar.l, c.mar.r, pl, pr, myW);
    const ch = myH < 0 ? (c.lh >= 0 ? spec("E", c.lh) : spec("U", 0)) : c.lh === MATCH ? spec("E", Math.max(0, myH - pt - pb - vMar(c))) : spec("A", Math.max(0, myH - pt - pb - vMar(c)));
    measure(c, cw, ch);
    const w = c.mw;
    if (p.l === undefined && p.r !== undefined) p.l = p.r - w;
    else if (p.l !== undefined && p.r === undefined) p.r = p.l + w;
    else if (p.l === undefined) {
      const ctr = yes(c, "centerInParent", "centerHorizontal");
      p.l = ctr && !wrapW ? (myW - w) / 2 : pl + c.mar.l; p.r = p.l + w;
    }
  }
  for (const c of V) {
    const p = c.p, a = nm => anchor(n, c, nm);
    p.t = p.b = undefined;
    let s;
    if ((s = a("above"))) p.b = s.p.t - s.mar.t - c.mar.b;
    if ((s = a("below"))) p.t = s.p.b + s.mar.b + c.mar.t;
    if ((s = a("alignTop"))) p.t = s.p.t + c.mar.t;
    if ((s = a("alignBottom"))) p.b = s.p.b - c.mar.b;
    if (yes(c, "alignParentTop") && p.t === undefined) p.t = pt + c.mar.t;
    if (yes(c, "alignParentBottom") && myH >= 0 && p.b === undefined) p.b = myH - pb - c.mar.b;
    const cw = relChildSpec(p.l, p.r, c.lw, c.mar.l, c.mar.r, pl, pr, myW);
    const chs = relChildSpec(p.t, p.b, c.lh, c.mar.t, c.mar.b, pt, pb, myH);
    measure(c, cw, chs);
    const h = c.mh;
    if (p.t === undefined && p.b !== undefined) p.t = p.b - h;
    else if (p.t !== undefined && p.b === undefined) p.b = p.t + h;
    else if (p.t === undefined) {
      const ctr = yes(c, "centerInParent", "centerVertical");
      p.t = ctr && !wrapH ? (myH - h) / 2 : pt + c.mar.t; p.b = p.t + h;
    }
    if (wrapW) width = Math.max(width, c.p.r + c.mar.r);
    if (wrapH) height = Math.max(height, p.b + c.mar.b);
  }
  if (wrapW) width = resolveSize(Math.max(width + pr, num(n, "minWidth")), ws); else width = ws.s;
  if (wrapH) height = resolveSize(Math.max(height + pb, num(n, "minHeight")), hs); else height = hs.s;
  n.mw = width; n.mh = height;
  for (const c of kids) {
    const p = c.p;
    if (wrapW && yes(c, "centerInParent", "centerHorizontal") && !(ruleOf(c, "left") || ruleOf(c, "right"))) { p.l = (width - c.mw) / 2; }
    else if (wrapW && yes(c, "alignParentRight", "alignParentEnd") && !ruleOf(c, "alignLeft")) { p.l = width - pr - c.mw - c.mar.r; }
    if (wrapH && yes(c, "centerInParent", "centerVertical") && !(ruleOf(c, "above") || ruleOf(c, "below"))) { p.t = (height - c.mh) / 2; }
    else if (wrapH && yes(c, "alignParentBottom") && !ruleOf(c, "alignTop")) { p.t = height - pb - c.mh - c.mar.b; }
    if (!wrapW && yes(c, "centerInParent", "centerHorizontal") && p.l === pl + c.mar.l) p.l = (width - c.mw) / 2;
  }
}
function layoutRelative(n) { for (const c of n.c.filter(laid)) { c.x = c.p.l; c.y = c.p.t; } }


/* ---------- ConstraintLayout (anchors, bias, match-constraint, guidelines, barriers; no chains) ---------- */
const CRULES = {
  hs: [["Left_toLeftOf", "start"], ["Start_toStartOf", "start"], ["Left_toRightOf", "end"], ["Start_toEndOf", "end"]],
  he: [["Right_toRightOf", "end"], ["End_toEndOf", "end"], ["Right_toLeftOf", "start"], ["End_toStartOf", "start"]],
  vs: [["Top_toTopOf", "start"], ["Top_toBottomOf", "end"], ["Baseline_toBaselineOf", "start"]],
  ve: [["Bottom_toBottomOf", "end"], ["Bottom_toTopOf", "start"]] };
const cAnchor = (c, key) => { for (const [k, side] of CRULES[key]) { const id = c.a["layout_constraint" + k]; if (id) return { id, side }; } };
const cDeps = c => {
  const ids = Object.keys(c.a).filter(k => /^layout_constraint.*_to.*Of$/.test(k)).map(k => c.a[k]);
  return ids.concat((c.a.constraint_referenced_ids || "").split(",").map(x => x.trim()).filter(Boolean));
};

function measureConstraint(n, ws, hs) {
  const kids = n.c.filter(laid), { l: pl, r: pr, t: pt, b: pb } = n.pad;
  const byId = id => kids.find(k => k.id === id);
  const order = [], left = [...kids];
  while (left.length) {
    const i = Math.max(0, left.findIndex(c => cDeps(c).every(id => id === "parent" || !byId(id) || byId(id) === c || order.includes(byId(id)))));
    order.push(left.splice(i, 1)[0]);
  }
  /** One placement pass. known[axis] says whether the parent size on that axis is fixed yet. */
  const pass = (W, H, known) => {
    const edge = (id, side, axis) => {
      if (id === "parent" || id === n.id) {
        if (side === "start") return axis === "h" ? pl : pt;
        return known[axis] ? (axis === "h" ? W - pr : H - pb) : undefined;
      }
      const s = byId(id);
      if (!s || s.cl === undefined) return undefined;
      return axis === "h" ? (side === "start" ? s.cl : s.cr) : (side === "start" ? s.ct : s.cb);
    };
    for (const c of order) {
      const gb = c.a.layout_constraintGuide_begin, ge = c.a.layout_constraintGuide_end, gp = c.a.layout_constraintGuide_percent;
      if (c.tag === "Guideline" || c.tag === "Barrier") {
        c.mw = c.mh = 0;
        let vert, pos;
        if (c.tag === "Guideline") {
          vert = c.a.orientation === "vertical";
          const size = vert ? W - pl - pr : H - pt - pb, base = vert ? pl : pt;
          pos = gb != null ? base + dim(gb) : ge != null ? base + size - dim(ge) : base + size * parseFloat(gp || 0);
        } else {
          const refs = (c.a.constraint_referenced_ids || "").split(",").map(x => byId(x.trim())).filter(r => r && r.cl !== undefined && laid(r));
          const d = c.a.barrierDirection || "end"; vert = /start|left|end|right/.test(d);
          const vals = refs.map(r => (d === "start" || d === "left" ? r.cl : d === "end" || d === "right" ? r.cr : d === "top" ? r.ct : r.cb));
          pos = vals.length ? (/start|left|top/.test(d) ? Math.min(...vals) : Math.max(...vals)) : 0;
        }
        if (vert) { c.cl = c.cr = pos; c.ct = pt; c.cb = H - pb; } else { c.ct = c.cb = pos; c.cl = pl; c.cr = W - pr; }
        continue;
      }
      const plan = (key, axis, lm, rm, size, total, pStart, pEnd) => {
        const a = cAnchor(c, key + "s"), b = cAnchor(c, key + "e");
        const s0 = a ? edge(a.id, a.side, axis) : undefined, e0 = b ? edge(b.id, b.side, axis) : undefined;
        const s = s0 === undefined ? undefined : s0 + lm, e = e0 === undefined ? undefined : e0 - rm, kn = known[axis];
        let sp;
        if (size === 0) sp = s !== undefined && e !== undefined ? spec("E", Math.max(0, e - s)) : kn ? spec("E", Math.max(0, (e ?? total - pEnd - rm) - (s ?? pStart + lm))) : spec("U", 0);
        else if (size === MATCH) sp = kn ? spec("E", Math.max(0, total - pStart - pEnd - lm - rm)) : spec("U", 0);
        else if (size >= 0) sp = spec("E", size);
        else sp = kn ? spec("A", Math.max(0, (e ?? total - pEnd - rm) - (s ?? pStart + lm))) : spec("U", 0);
        return { s, e, sp };
      };
      const h = plan("h", "h", c.mar.l, c.mar.r, c.lw, W, pl, pr), v = plan("v", "v", c.mar.t, c.mar.b, c.lh, H, pt, pb);
      measure(c, h.sp, v.sp);
      const place = (p, size, bias, pStart, lm) => (p.s !== undefined && p.e !== undefined ? p.s + (p.e - p.s - size) * bias : p.s !== undefined ? p.s : p.e !== undefined ? p.e - size : pStart + lm);
      c.cl = place(h, c.mw, parseFloat(c.a.layout_constraintHorizontal_bias ?? 0.5), pl, c.mar.l); c.cr = c.cl + c.mw;
      c.ct = place(v, c.mh, parseFloat(c.a.layout_constraintVertical_bias ?? 0.5), pt, c.mar.t); c.cb = c.ct + c.mh;
    }
  };
  const known = { h: ws.m === "E", v: hs.m === "E" };
  kids.forEach(c => (c.cl = c.cr = c.ct = c.cb = undefined));
  pass(ws.m === "U" ? 0 : ws.s, hs.m === "U" ? 0 : hs.s, known);
  let mw = 0, mh = 0;
  for (const c of kids) { mw = Math.max(mw, (c.cr ?? 0) + c.mar.r); mh = Math.max(mh, (c.cb ?? 0) + c.mar.b); }
  n.mw = resolveSize(Math.max(mw + pr, num(n, "minWidth")), ws); n.mh = resolveSize(Math.max(mh + pb, num(n, "minHeight")), hs);
  for (let i = 0; i < (!known.h || !known.v ? 3 : 2); i++) pass(n.mw, n.mh, { h: true, v: true });
}
function layoutConstraint(n) { for (const c of n.c.filter(laid)) { c.x = c.cl ?? 0; c.y = c.ct ?? 0; } }

/* ---------- leaves ---------- */
const probe = (() => {
  const d = document.createElement("div");
  d.style.cssText = "position:absolute;visibility:hidden;left:-9999px;top:0;display:inline-block;box-sizing:content-box";
  document.body.appendChild(d); return d;
})();
const FONT = 'Roboto, "Helvetica Neue", Arial, sans-serif';
const isButton = n => ["Button", "AppCompatButton", "MaterialButton"].includes(n.tag);
const textOf = n => (n.a.text !== undefined && n.a.text !== "" ? n.a.text : n.a.hint || "");

function tstyle(n) {
  const fam = (n.a.fontFamily || "").toLowerCase(), ts = n.a.textStyle || "";
  const bold = ts.includes("bold") || /bold|black/.test(fam), medium = /medium/.test(fam), light = /light/.test(fam);
    return { size: num(n, "textSize", 14), weight: bold ? 700 : medium ? 500 : light ? 300 : 400,
           italic: ts.includes("italic") || /italic/.test(fam),
           caps: n.a.textAllCaps === "true" || (isButton(n) && n.a.textAllCaps !== "false" && !n.a.background && !n.d.background) };
}
const lineH = st => Math.round(st.size * 1.17 * 100) / 100;
const maxLines = n => (n.a.singleLine === "true" ? 1 : parseInt(n.a.maxLines || 0) || 0);
function drawExtent(n) {
  const side = k => n.d[k] && { w: n.d[k].w || 24, h: n.d[k].h || 24 }, pad = num(n, "drawablePadding");
  const l = side("drawableLeft"), r = side("drawableRight"), t = side("drawableTop"), b = side("drawableBottom");
  return { w: (l ? l.w + pad : 0) + (r ? r.w + pad : 0), h: (t ? t.h + pad : 0) + (b ? b.h + pad : 0), l, r, t, b };
}

function measureText(n, ws, hs) {
  const st = tstyle(n), dr = drawExtent(n), ml = maxLines(n), lh = lineH(st);
  let text = textOf(n); if (st.caps) text = text.toUpperCase();
  const avail = ws.m === "U" ? Infinity : Math.max(0, ws.s - n.pad.l - n.pad.r - dr.w);
  probe.style.cssText += `;font:${st.italic ? "italic " : ""}${st.weight} ${st.size}px/${lh}px ${FONT};white-space:${ml === 1 ? "nowrap" : "normal"};width:auto;max-width:${avail === Infinity ? "none" : avail + "px"}`;
  probe.textContent = text || "​";
  const range = document.createRange(); range.selectNodeContents(probe);
  let cw = text ? range.getBoundingClientRect().width : 0, ch = probe.getBoundingClientRect().height;
  if (ml > 1) ch = Math.min(ch, ml * lh);
  cw = Math.min(text ? Math.ceil(cw) + 1 : cw, avail);
  if (/Check|Radio/.test(n.tag)) { cw += 32; ch = Math.max(ch, 32); }
  const hasBg = n.a.background || n.d.background;
  const minH = !hasBg && (isButton(n) || /EditText$/.test(n.tag)) ? 48 : 0, minW = !hasBg && isButton(n) ? 88 : 0;
  n.mw = resolveSize(Math.max(cw + dr.w + n.pad.l + n.pad.r, num(n, "minWidth"), minW), ws);
  n.mh = resolveSize(Math.max(ch + dr.h + n.pad.t + n.pad.b, num(n, "minHeight"), minH), hs);
}

function measureImage(n, ws, hs) {
  const d = n.d.src; let iw = d && d.w ? d.w : 0, ih = d && d.h ? d.h : 0;
  if (n.a.adjustViewBounds === "true" && iw && ih) {
    if (ws.m === "E" && n.lh === WRAP) ih = ((ws.s - n.pad.l - n.pad.r) * ih) / iw, iw = ws.s - n.pad.l - n.pad.r;
    else if (hs.m === "E" && n.lw === WRAP) iw = ((hs.s - n.pad.t - n.pad.b) * iw) / ih, ih = hs.s - n.pad.t - n.pad.b;
  }
  finish(n, ws, hs, iw, ih);
}
const measureBox = (w, h) => (n, ws, hs) => finish(n, ws, hs, w(n), h(n));
const measureList = measureBox(() => 0, n => (n.lh === WRAP ? 120 : 0));
const measureProgress = measureBox(() => 48, () => 48);
const measureView = measureBox(() => 0, () => 0);

const MEASURE = { linear: measureLinear, relative: measureRelative, frame: measureFrame, card: measureFrame,
  constraint: measureConstraint, coordinator: measureCoordinator, vscroll: measureScroll, hscroll: measureScroll,
  text: measureText, image: measureImage, list: measureList, fragment: measureList, progress: measureProgress, view: measureView };
const LAYOUT = { linear: layoutLinear, relative: layoutRelative, constraint: layoutConstraint, vscroll: layoutScroll, hscroll: layoutScroll, coordinator: layoutCoordinator };
const LEAF = new Set(["text", "image", "list", "fragment", "progress", "view"]);

function layout(n) {
  if (!LEAF.has(n.k)) (LAYOUT[n.k] || layoutFrame)(n);
  n.c.filter(laid).forEach(layout);
}

/* ---------- render ---------- */
function paint(el, d, tint) {
  if (!d) return;
  if (d.layers) {
    for (const l of d.layers) {
      const sub = document.createElement("div"), [a, b, c, e] = l.inset;
      sub.style.cssText = `position:absolute;left:${a}px;top:${b}px;right:${c}px;bottom:${e}px;pointer-events:none`;
      paint(sub, l); el.appendChild(sub);
    }
    return;
  }
  if (d.bg !== undefined) el.style.backgroundColor = tint || d.bg;
  if (d.gradient) el.style.backgroundImage = `linear-gradient(${90 - d.gradient.angle}deg,${d.gradient.start},${d.gradient.end})`;
  if (d.radius) el.style.borderRadius = d.radius.map(r => r + "px").join(" ");
  if (d.oval) el.style.borderRadius = "50%";
  if (d.border && d.border.w) {
    if (d.border.dash) el.style.border = `${d.border.w}px dashed ${d.border.color}`;
    else el.style.boxShadow = `inset 0 0 0 ${d.border.w}px ${d.border.color}`;
  }
  if (d.img) { el.style.backgroundImage = `url(${d.img})`; el.style.backgroundRepeat = "no-repeat"; el.style.backgroundSize = "100% 100%"; }
}
const iconEl = (d, tint, w, h) => {
  const e = document.createElement("div"); e.className = "ic";
  e.style.cssText = `width:${w || d.w || 24}px;height:${h || d.h || 24}px;flex:none`;
  if (tint) e.style.cssText += `;background-color:${tint};-webkit-mask:url(${d.img}) center/contain no-repeat;mask:url(${d.img}) center/contain no-repeat`;
  else e.style.cssText += `;background:url(${d.img}) center/contain no-repeat`;
  return e;
};
const SCALE = { centerCrop: "cover", fitXY: "100% 100%", center: "auto", centerInside: "contain" };

function render(n, parentEl, ox = 0, oy = 0) {
  if (!laid(n)) return;
  const el = document.createElement("div");
  el.className = `n k-${n.k}`;
  el._n = n;
  el.style.cssText = `left:${n.x}px;top:${n.y}px;width:${n.mw}px;height:${n.mh}px`;
  if (n.a.visibility === "gone") el.classList.add("gone");
  if (n.a.visibility === "invisible") el.style.visibility = "hidden";
  if (n.a.alpha) el.style.opacity = n.a.alpha;
  const tint = n.a.backgroundTint;
  paint(el, n.d.background, tint && /^#/.test(tint) ? tint : undefined);
  if (n.a.elevation && parseFloat(n.a.elevation) > 0 && n.d.background) el.style.boxShadow = [el.style.boxShadow, `0 ${parseFloat(n.a.elevation) / 2}px ${parseFloat(n.a.elevation)}px rgba(0,0,0,.25)`].filter(Boolean).join(",");
  if (n.k === "vscroll" || n.k === "hscroll") el.classList.add("scroll");
  if (n.clip) el.style.overflow = "hidden";
  if (n.k === "card") {
    el.style.overflow = "hidden"; el.style.borderRadius = num(n, "cardCornerRadius", 4) + "px";
    el.style.background = n.a.cardBackgroundColor || "#fff"; el.style.boxShadow = "0 1px 4px rgba(0,0,0,.25)";
  }
  if (n.k === "text") renderText(n, el);
  if (n.k === "image" && n.d.src) {
    const d = n.d.src, ic = document.createElement("div"), t = n.a.tint || n.a.imageTint;
    ic.className = "ic"; ic.style.cssText = `position:absolute;left:${n.pad.l}px;top:${n.pad.t}px;right:${n.pad.r}px;bottom:${n.pad.b}px`;
    const size = SCALE[n.a.scaleType] || "contain";
    if (t && /^#/.test(t)) ic.style.cssText += `;background-color:${t};-webkit-mask:url(${d.img}) center/${size} no-repeat`;
    else if (d.img) ic.style.cssText += `;background:url(${d.img}) center/${size} no-repeat`;
    else paint(ic, d);
    el.appendChild(ic);
  }
  if (n.k === "list" || n.k === "fragment") {
    el.classList.add("ph"); el.textContent = `${n.tag}${n.id ? " #" + n.id : ""}`;
  }
  if (n.k === "progress") el.classList.add("spin");
  n.c.forEach(c => render(c, el));
  parentEl.appendChild(el);
}

function renderText(n, el) {
  const st = tstyle(n), dr = drawExtent(n), g = grav(n.a.gravity), lh = lineH(st), ml = maxLines(n);
  if (n.tag.endsWith("EditText") && !n.a.gravity) g.v = "c";
  const hint = n.a.text === undefined || n.a.text === "" ? n.a.hint : null;
  let text = textOf(n); if (st.caps) text = text.toUpperCase();
  const col = hint ? n.a.textColorHint || "#9e9e9e" : n.a.textColor || "#de000000";
  const vertical = dr.t || dr.b;
  el.classList.add("tx");
  el.style.cssText += `;display:flex;flex-direction:${vertical ? "column" : "row"};align-items:${g.v === "c" ? "center" : g.v === "b" ? "flex-end" : "flex-start"};` +
    `justify-content:${g.h === "c" ? "center" : g.h === "r" ? "flex-end" : "flex-start"};padding:${n.pad.t}px ${n.pad.r}px ${n.pad.b}px ${n.pad.l}px;` +
    `font:${st.italic ? "italic " : ""}${st.weight} ${st.size}px/${lh}px ${FONT};color:${col}`;
  if (vertical) el.style.alignItems = g.h === "c" ? "center" : g.h === "r" ? "flex-end" : "flex-start";
  const pad = num(n, "drawablePadding"), tintC = n.a.drawableTint;
  const add = (k, m) => { if (n.d[k] && n.d[k].img) { const i = iconEl(n.d[k], tintC); i.style[m] = pad + "px"; el.appendChild(i); return i; } };
  const mk = () => {
    const s = document.createElement("span");
    s.textContent = text; s.style.cssText = `white-space:${ml === 1 ? "nowrap" : "pre-wrap"};text-align:${g.h === "c" ? "center" : g.h === "r" ? "right" : "left"};` +
      (ml === 1 || n.a.ellipsize === "end" ? "overflow:hidden;text-overflow:ellipsis;min-width:0;" : "") + (n.ph ? "text-decoration:underline dotted rgba(0,0,0,.25);" : "");
    if (ml > 1) s.style.cssText += `display:-webkit-box;-webkit-line-clamp:${ml};-webkit-box-orient:vertical;overflow:hidden`;
    return s;
  };
  if (/Check|Radio/.test(n.tag)) { const b = document.createElement("div"); b.className = "chk"; b.style.borderRadius = /Radio/.test(n.tag) ? "50%" : "3px"; el.appendChild(b); }
  add("drawableLeft", "marginRight"); add("drawableTop", "marginBottom");
  el.appendChild(mk());
  add("drawableRight", "marginLeft"); add("drawableBottom", "marginTop");
  if (n.tag.endsWith("EditText") && !n.d.background && !n.a.background) { el.style.borderBottom = "1px solid #8a8a8a"; el.style.boxSizing = "border-box"; }
  if (isButton(n) && !n.d.background && !n.a.background) {
    el.style.background = "#d6d7d7"; el.style.borderRadius = "2px"; el.style.alignItems = "center"; el.style.justifyContent = "center";
  }
}

/** Build the whole screen into a container. Returns the root node. */
function renderScreen(screen, container, W = 360, H = 740) {
  const root = JSON.parse(JSON.stringify(screen.root));
  const S = 24;
  prep(root, null);
  root.lw = root.lh = MATCH;
  measure(root, spec("E", W), spec("E", H - S));
  root.x = root.y = 0; root.mw = W; root.mh = H - S;
  layout(root);
  container.innerHTML = "";
  container.style.background = screen.window.bg || "#fff";
  render(root, container);
  return root;
}
