// Imports a dumped frame set (see ../dump.py) as one page per area.
// Re-importing the same set rebuilds each page. No styles, components or variables are created.
figma.showUI(__html__, { width: 280, height: 150 });

const COLS = 6, GX = 70, GY = 80, TOP = 90;
const STUDY_BANNER = "STUDY - reference only. Derived from a third-party app's layouts. Do not reuse.";
const WEIGHTS = [[600, "Bold"], [500, "Medium"], [0, "Regular"]];

function parseColor(s, neutral) {
  if (!s) return null;
  let r, g, b, a = 1, m;
  if ((m = /^#([0-9a-f]{3,8})$/i.exec(s))) {
    let h = m[1];
    if (h.length <= 4) h = h.split("").map(c => c + c).join("");
    [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
    if (h.length === 8) a = parseInt(h.slice(6, 8), 16) / 255;
  } else if ((m = /rgba?\(([^)]+)\)/.exec(s))) {
    [r, g, b, a = 1] = m[1].split(",").map(Number);
  } else return null;
  if (neutral) r = g = b = 0.299 * r + 0.587 * g + 0.114 * b;
  return { color: { r: r / 255, g: g / 255, b: b / 255 }, a };
}

const paint = (css, opacity = 1, neutral = false) => {
  const c = parseColor(css, neutral);
  return c ? [{ type: "SOLID", color: c.color, opacity: c.a * opacity }] : [];
};

const fontFor = weight => ({ family: "Inter", style: WEIGHTS.find(([w]) => weight >= w)[1] });

function place(node, n) {
  node.x = n.x; node.y = n.y;
  node.resize(Math.max(n.w, 0.01), Math.max(n.h, 0.01));
  if (n.op !== undefined) node.opacity = n.op;
  node.name = n.name || n.t;
}

function addRect(parent, n, neutral) {
  const r = figma.createRectangle();
  parent.appendChild(r);
  place(r, n);
  r.fills = n.fill ? paint(n.fill, n.fa, neutral) : [];
  [r.topLeftRadius, r.topRightRadius, r.bottomRightRadius, r.bottomLeftRadius] = n.r;
  if (n.stroke) {
    r.strokes = paint(n.stroke.c, 1, neutral);
    r.strokeWeight = n.stroke.w;
    r.strokeAlign = "INSIDE";
    if (n.stroke.dash) r.dashPattern = [4, 4];
  }
  if (n.shadow) {
    const s = parseColor(n.shadow.c, neutral);
    if (s) r.effects = [{ type: "DROP_SHADOW", color: { ...s.color, a: n.shadow.a }, offset: { x: n.shadow.x, y: n.shadow.y }, radius: n.shadow.blur, visible: true, blendMode: "NORMAL" }];
  }
}

function addImg(parent, n) {
  const r = figma.createRectangle();
  parent.appendChild(r);
  place(r, n);
  r.name = "img " + n.label;
  r.fills = paint("#d9d9d9");
}

function addText(parent, n, neutral) {
  const t = figma.createText();
  parent.appendChild(t);
  t.fontName = fontFor(n.weight);
  t.fontSize = n.size;
  t.characters = n.text;
  t.fills = paint(n.color, n.a, neutral);
  if (n.lh) t.lineHeight = { value: n.lh, unit: "PIXELS" };
  if (n.ls) t.letterSpacing = { value: n.ls, unit: "PIXELS" };
  t.x = n.x; t.y = n.y;
  if (n.lines > 1) { t.resize(Math.max(n.w, 1), t.height); t.textAutoResize = "HEIGHT"; }
  else t.textAutoResize = "WIDTH_AND_HEIGHT";
  if (n.op !== undefined) t.opacity = n.op;
  t.name = n.name || "text";
}

function addFrame(page, data, f, i, y0) {
  const frame = figma.createFrame();
  page.appendChild(frame);
  const neutral = data.set === "study";
  const prefix = neutral ? "STUDY | " : `${f.area} / `;
  frame.name = prefix + f.title + (f.pick === "guess" ? " [UNVERIFIED LAYOUT]" : "");
  frame.resize(f.w, f.h);
  frame.x = (i % COLS) * (f.w + GX);
  frame.y = y0 + Math.floor(i / COLS) * (f.h + GY);
  frame.fills = paint(f.bg, 1, neutral);
  frame.clipsContent = true;
  frame.setPluginData("key", `${data.set}:${f.name}`);
  frame.setPluginData("origin", data.set);
  for (const n of f.nodes) {
    if (n.t === "rect") addRect(frame, n, neutral);
    else if (n.t === "img") addImg(frame, n);
    else addText(frame, n, neutral);
  }
}

async function pageFor(title) {
  let page = figma.root.children.find(p => p.name === title);
  if (!page) { page = figma.createPage(); page.name = title; }
  await figma.setCurrentPageAsync(page);
  page.children.slice().forEach(c => c.remove());
  return page;
}

async function importSet(data) {
  await Promise.all(["Regular", "Medium", "Bold"].map(style => figma.loadFontAsync({ family: "Inter", style })));
  const label = data.set.toUpperCase();
  const areas = [...new Set(data.frames.map(f => f.area))];
  let done = 0;
  for (const area of areas) {
    const page = await pageFor(`${label} / ${area}`);
    if (data.set === "study") {
      const banner = figma.createText();
      page.appendChild(banner);
      banner.fontName = fontFor(700); banner.fontSize = 28; banner.characters = STUDY_BANNER;
      banner.fills = paint("#e67e22"); banner.x = 0; banner.y = 0;
    }
    data.frames.filter(f => f.area === area).forEach((f, i) => { addFrame(page, data, f, i, TOP); done++; });
    figma.ui.postMessage(`Imported ${done}/${data.frames.length}`);
  }
  figma.notify(`Imported ${done} ${data.set} frames`);
  figma.ui.postMessage(`Done: ${done} frames on ${areas.length} pages`);
}

figma.ui.onmessage = data => importSet(data).catch(e => { figma.ui.postMessage("Error: " + e.message); console.error(e); });
