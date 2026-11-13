/* Page-side walker: rendered DOM -> flat node list for the Figma plugin.
 * Called as walk(rootEl, originEl, {neutral}). Coordinates are relative to originEl.
 * Images are never serialised: every image-like element becomes {t:"img"} with a size label.
 * neutral=true converts every colour to a luma grey (used for the APK-derived study set).
 */
(function () {
  const rgb = s => { const m = /rgba?\(([^)]+)\)/.exec(s || ""); if (!m) return null; const [r, g, b, a = 1] = m[1].split(",").map(Number); return { r, g, b, a }; };
  const h2 = v => Math.round(v).toString(16).padStart(2, "0");
  const colour = (c, neutral) => {
    if (!c) return null;
    const v = neutral ? 0.299 * c.r + 0.587 * c.g + 0.114 * c.b : null;
    return "#" + (neutral ? h2(v) + h2(v) + h2(v) : h2(c.r) + h2(c.g) + h2(c.b));
  };
  const px = s => parseFloat(s) || 0;
  const splitTop = s => s.split(/,(?![^(]*\))/).map(t => t.trim()).filter(Boolean);

  function radii(cs, w, h) {
    const one = v => (v.endsWith("%") ? (parseFloat(v) / 100) * Math.min(w, h) : px(v));
    return [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].map(v => Math.min(one(v), Math.min(w, h) / 2));
  }

  function strokeOf(cs, neutral) {
    if (px(cs.borderTopWidth) > 0 && cs.borderTopStyle !== "none") {
      return { w: px(cs.borderTopWidth), c: colour(rgb(cs.borderTopColor), neutral), dash: cs.borderTopStyle === "dashed" };
    }
    const inset = splitTop(cs.boxShadow).find(s => s.includes("inset"));
    if (!inset) return null;
    const c = rgb(inset), len = (inset.replace(/rgba?\([^)]*\)/, "").match(/-?[\d.]+px/g) || []).map(px);
    return len[3] ? { w: len[3], c: colour(c, neutral) } : null;
  }

  function shadowOf(cs, neutral) {
    const s = splitTop(cs.boxShadow).find(t => !t.includes("inset") && t !== "none");
    if (!s) return null;
    const len = (s.replace(/rgba?\([^)]*\)/, "").match(/-?[\d.]+px/g) || []).map(px);
    const c = rgb(s);
    return { x: len[0] || 0, y: len[1] || 0, blur: len[2] || 0, c: colour(c, neutral), a: c ? c.a : 1 };
  }

  function textStyle(el, cs, neutral) {
    let c = rgb(cs.color);
    return { size: px(cs.fontSize), weight: parseInt(cs.fontWeight) || 400, italic: cs.fontStyle === "italic", color: colour(c, neutral), a: c ? c.a : 1,
             lh: cs.lineHeight === "normal" ? null : px(cs.lineHeight), ls: px(cs.letterSpacing) };
  }

  function emitText(node, parentEl, cs, ctx) {
    let raw = node.textContent;
    const pre = cs.whiteSpace.startsWith("pre");
    let text = pre ? raw.replace(/^\s+|\s+$/g, "") : raw.replace(/\s+/g, " ").trim();
    if (!text) return;
    if (cs.textTransform === "uppercase") text = text.toUpperCase();
    const range = document.createRange(); range.selectNodeContents(node);
    const rects = [...range.getClientRects()].filter(r => r.width > 0);
    if (!rects.length) return;
    const b = range.getBoundingClientRect(), lines = new Set(rects.map(r => Math.round(r.top))).size;
    ctx.emit({ t: "text", x: b.left, y: b.top, w: b.width, h: b.height, text, lines, ...textStyle(parentEl, cs, ctx.neutral), name: ctx.name(parentEl) }, ctx.clip, ctx.op);
  }

  function walk(root, origin, opts = {}) {
    const neutral = !!opts.neutral, o = origin.getBoundingClientRect(), out = [];
    const name = el => (el._n ? el._n.id || el._n.tag : el.id || (typeof el.className === "string" ? el.className.split(" ")[0] : "") || el.tagName.toLowerCase());
    const emit = (n, clip, op) => {
      const x0 = Math.max(n.x, clip.l), y0 = Math.max(n.y, clip.t), x1 = Math.min(n.x + n.w, clip.r), y1 = Math.min(n.y + n.h, clip.b);
      if (x1 <= x0 || y1 <= y0) return;
      out.push({ ...n, x: +(x0 - o.left).toFixed(2), y: +(y0 - o.top).toFixed(2), w: +(x1 - x0).toFixed(2), h: +(y1 - y0).toFixed(2), ...(op < 1 ? { op: +op.toFixed(3) } : {}) });
    };

    function visit(el, clip, op) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      const r = el.getBoundingClientRect(), o2 = op * parseFloat(cs.opacity);
      const ctx = { emit, clip, op: o2, neutral, name };
      const tag = el.tagName;
      if (tag === "IMG" || tag === "SVG" || tag === "svg" || tag === "CANVAS") {
        emit({ t: "img", x: r.left, y: r.top, w: r.width, h: r.height, label: `${Math.round(r.width)}x${Math.round(r.height)}`, name: name(el) }, clip, o2);
        return;
      }
      const bg = rgb(cs.backgroundColor), grad = /gradient/.test(cs.backgroundImage);
      const masked = /url\(/.test(cs.maskImage || cs.webkitMaskImage || "");
      const urlBg = /url\(/.test(cs.backgroundImage);
      const stroke = strokeOf(cs, neutral), shadow = shadowOf(cs, neutral);
      const fillC = grad ? rgb((cs.backgroundImage.match(/rgba?\([^)]*\)/) || [])[0]) : bg;
      if (!masked && ((fillC && fillC.a > 0) || stroke || shadow)) {
        emit({ t: "rect", x: r.left, y: r.top, w: r.width, h: r.height, fill: fillC && fillC.a > 0 ? colour(fillC, neutral) : null, fa: fillC ? fillC.a : 0,
               r: radii(cs, r.width, r.height), ...(stroke ? { stroke } : {}), ...(shadow ? { shadow } : {}), name: name(el) }, clip, o2);
      }
      if (masked || urlBg) emit({ t: "img", x: r.left, y: r.top, w: r.width, h: r.height, label: `${Math.round(r.width)}x${Math.round(r.height)}`, name: name(el) }, clip, o2);
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        const v = tag === "SELECT" ? (el.selectedOptions[0] || {}).textContent : el.value || el.placeholder;
        if (v) emit({ t: "text", x: r.left + px(cs.paddingLeft), y: r.top + (r.height - px(cs.fontSize) * 1.2) / 2, w: r.width - px(cs.paddingLeft) * 2, h: px(cs.fontSize) * 1.2, text: v, lines: 1, ...textStyle(el, cs, neutral), name: name(el) }, clip, o2);
        return;
      }
      let childClip = clip;
      if (cs.overflowX !== "visible" || cs.overflowY !== "visible") {
        childClip = { l: Math.max(clip.l, r.left), t: Math.max(clip.t, r.top), r: Math.min(clip.r, r.right), b: Math.min(clip.b, r.bottom) };
      }
      for (const ch of el.childNodes) {
        if (ch.nodeType === 3) emitText(ch, el, cs, { ...ctx, clip: childClip });
        else if (ch.nodeType === 1) visit(ch, childClip, o2);
      }
    }
    const whole = { l: o.left, t: o.top, r: o.right, b: o.bottom };
    for (const ch of root.children) visit(ch, whole, 1);
    return out;
  }
  window.__walk = walk;
})();
