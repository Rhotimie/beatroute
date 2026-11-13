"""Convert apktool layout XML into resolved JSON trees for the reference viewer.

Usage: uv run convert.py <layout_name> [<layout_name> ...]
Writes screens/<name>.js and copies the drawables each screen uses into assets/.
"""
import json
import re
import shutil
import struct
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

HERE = Path(__file__).resolve().parent
RES = HERE.parent.parent / "apktool" / "res"
ASSETS, SCREENS = HERE / "assets", HERE / "screens"
AND = "{http://schemas.android.com/apk/res/android}"
TOOLS = "{http://schemas.android.com/tools}"
DENSITY = {"xxxhdpi": 4, "xxhdpi": 3, "xhdpi": 2, "hdpi": 1.5, "mdpi": 1}
DRAWABLE_DIRS = ["drawable", "drawable-anydpi", "drawable-v21", "drawable-v23", "drawable-v24", "drawable-v26",
                 "drawable-xxhdpi", "drawable-xhdpi", "drawable-hdpi", "drawable-mdpi", "drawable-nodpi",
                 "mipmap-xxxhdpi", "mipmap-xxhdpi", "mipmap-xhdpi", "mipmap-hdpi", "mipmap-mdpi", "mipmap-anydpi-v26"]
ATTR_DEFAULTS = {"actionBarSize": "56dp", "colorControlNormal": "#8a000000", "colorPrimary": "#3f51b5",
                 "colorAccent": "#ff4081", "textColorPrimary": "#de000000", "colorBackground": "#ffffff"}
ANDROID_COLORS = {"white": "#ffffff", "black": "#000000", "transparent": "#00000000", "darker_gray": "#aaaaaa"}
DRAWABLE_KEYS = {"background": "background", "src": "src", "srcCompat": "src", "foreground": "foreground",
                 "drawableLeft": "drawableLeft", "drawableStart": "drawableLeft",
                 "drawableRight": "drawableRight", "drawableEnd": "drawableRight",
                 "drawableTop": "drawableTop", "drawableBottom": "drawableBottom"}
EXACT = {"LinearLayout": "linear", "RadioGroup": "linear", "RelativeLayout": "relative", "FrameLayout": "frame",
         "ScrollView": "vscroll", "NestedScrollView": "vscroll", "HorizontalScrollView": "hscroll",
         "CoordinatorLayout": "coordinator", "AppBarLayout": "linear", "CardView": "card",
         "MaterialCardView": "card", "ConstraintLayout": "constraint", "RecyclerView": "list", "ListView": "list",
         "GridView": "list", "ViewPager": "list", "ViewPager2": "list", "FragmentContainerView": "fragment",
         "fragment": "fragment", "ProgressBar": "progress", "View": "view", "Space": "view", "WebView": "fragment"}
TEXT_SUFFIXES = ("TextView", "Button", "EditText", "CheckBox", "RadioButton", "Switch", "Chip")


def css_color(c):
    """Convert Android #AARRGGBB / #ARGB to CSS #RRGGBBAA / #RGBA-expanded."""
    if not re.fullmatch(r"#[0-9a-fA-F]{3,8}", c) or len(c) in (7, 4, 6):
        return c
    if len(c) == 5:
        c = "#" + "".join(ch * 2 for ch in c[1:])
    return "#" + c[3:] + c[1:3] if len(c) == 9 else c


def num(v, default=0.0):
    """Leading number of a dimension string such as 9.5dp."""
    m = re.match(r"-?[\d.]+", str(v or ""))
    return float(m.group()) if m else default


class Resources:
    """Values, styles, theme and drawables from the decoded res/ folder."""

    def __init__(self):
        self.v = {k: {} for k in ("color", "string", "dimen", "bool", "integer")}
        self.styles, self.missing, self.used_assets = {}, set(), {}
        for folder in ("values", "values-sw360dp"):
            for f in sorted((RES / folder).glob("*.xml")):
                self._load(f)
        self.theme = self.style_items("AppTheme")

    def _load(self, f):
        for e in ET.parse(f).getroot():
            name, kind = e.get("name"), e.get("type") or e.tag
            if e.tag == "public":
                continue
            if e.tag == "style":
                self.styles[name] = {"parent": e.get("parent"),
                                     "items": {i.get("name").split(":")[-1]: (i.text or "").strip() for i in e}}
            elif kind in self.v and name:
                self.v[kind][name] = "".join(e.itertext()).strip()

    def style_items(self, name, depth=0):
        s = self.styles.get(name)
        if not s or depth > 10:
            return {}
        parent = (s["parent"] or "").removeprefix("@style/").removeprefix("style/")
        if not parent and "." in name:
            parent = name.rsplit(".", 1)[0]
        return {**(self.style_items(parent, depth + 1) if parent else {}), **s["items"]}

    def resolve(self, v, depth=0):
        """Resolve @res, ?attr and id references to concrete strings."""
        if not isinstance(v, str) or depth > 8:
            return v
        if v.startswith("@android:color/"):
            return ANDROID_COLORS.get(v.split("/")[1], v)
        if m := re.fullmatch(r"@\+?id/(.+)", v):
            return m.group(1)
        if m := re.fullmatch(r"@(color|string|dimen|bool|integer)/(.+)", v):
            kind, name = m.groups()
            if name in self.v[kind]:
                return self.resolve(self.v[kind][name], depth + 1)
            if kind == "color" and (c := self.color_file(name)):
                return c
            self.missing.add(v)
            return v
        if v.startswith("?"):
            name = re.split(r"[/?]", v)[-1]
            return self.resolve(self.theme.get(name, ATTR_DEFAULTS.get(name, "")), depth + 1)
        return css_color(v)

    def color_file(self, name):
        f = RES / "color" / f"{name}.xml"
        if not f.exists():
            return None
        items = list(ET.parse(f).getroot())
        stateless = [i for i in items if not any("state_" in k for k in i.attrib)]
        pick = (stateless or items)[0]
        return self.resolve(pick.get(AND + "color"))

    def dim(self, v):
        return num(self.resolve(v))

    # ----- drawables -----
    def drawable(self, ref, depth=0):
        """Descriptor dict for a drawable/color reference, or None."""
        if not ref or depth > 6:
            return None
        if ref.startswith("#") or ref.startswith("@color/") or ref.startswith("@android:color/"):
            c = self.resolve(ref)
            return {"bg": c} if c.startswith("#") else None
        if m := re.fullmatch(r"@(drawable|mipmap)/(.+)", ref):
            return self._named(m.group(2), depth)
        return None

    def _find(self, name):
        for d in DRAWABLE_DIRS:
            for ext in (".xml", ".png", ".webp", ".jpg"):
                if (f := RES / d / f"{name}{ext}").exists():
                    return f
        return None

    def _named(self, name, depth):
        if name in self.used_assets:
            return self.used_assets[name]
        f = self._find(name)
        if not f:
            self.missing.add("@drawable/" + name)
            return None
        if f.suffix == ".xml":
            d = self._el(ET.parse(f).getroot(), name, depth)
        else:
            ASSETS.mkdir(exist_ok=True)
            shutil.copy(f, ASSETS / f.name)
            scale = next((v for k, v in DENSITY.items() if f.parent.name.endswith(k)), 1)
            d = {"img": f"assets/{f.name}"}
            if f.suffix == ".png":
                w, h = struct.unpack(">II", f.read_bytes()[16:24])
                d.update(w=round(w / scale, 1), h=round(h / scale, 1))
        self.used_assets[name] = d
        return d

    def _el(self, el, name, depth):
        t, a = el.tag, lambda k: el.get(AND + k)
        if t == "shape":
            return self._shape(el)
        if t == "vector":
            return self._vector(el, name)
        if t == "layer-list":
            layers = []
            for it in el:
                d = self._item(it, name, depth + 1)
                if d:
                    layers.append({**d, "inset": [self.dim(a2) for a2 in
                                                  (it.get(AND + k) for k in ("left", "top", "right", "bottom"))]})
            return {"layers": layers} if layers else None
        if t in ("selector", "level-list", "animated-selector", "ripple", "transition"):
            items = [i for i in el if i.get(AND + "id") != "@android:id/mask"]
            plain = [i for i in items if not any("state_" in k for k in i.attrib)]
            for it in (plain or items):
                if d := self._item(it, name, depth + 1):
                    return d
            return None
        if t in ("inset", "rotate", "scale", "clip", "animated-vector"):
            return self.drawable(a("drawable"), depth + 1) or next(
                (self._el(c, name, depth + 1) for c in el), None)
        if t == "bitmap":
            return self.drawable(a("src"), depth + 1)
        if t == "color":
            return {"bg": self.resolve(a("color"))}
        return None

    def _item(self, it, name, depth):
        d = self.drawable(it.get(AND + "drawable"), depth)
        return d or next((self._el(c, name, depth) for c in it), None)

    def _shape(self, s):
        out = {"oval": True} if s.get(AND + "shape") == "oval" else {}
        for ch in s:
            g = lambda k: ch.get(AND + k)
            if ch.tag == "solid":
                out["bg"] = self.resolve(g("color"))
            elif ch.tag == "corners":
                r = self.dim(g("radius"))
                out["radius"] = [self.dim(g(k)) if g(k) else r for k in
                                 ("topLeftRadius", "topRightRadius", "bottomRightRadius", "bottomLeftRadius")]
            elif ch.tag == "stroke":
                out["border"] = {"w": self.dim(g("width")), "color": self.resolve(g("color")),
                                 "dash": self.dim(g("dashWidth"))}
            elif ch.tag == "gradient":
                out["gradient"] = {"start": self.resolve(g("startColor")), "end": self.resolve(g("endColor")),
                                   "angle": num(g("angle"))}
            elif ch.tag == "size":
                out["w"], out["h"] = self.dim(g("width")), self.dim(g("height"))
        return out

    def _vector(self, root, name):
        a = lambda e, k: e.get(AND + k)
        vw, vh = num(a(root, "viewportWidth"), 24), num(a(root, "viewportHeight"), 24)
        w, h = self.dim(a(root, "width")) or vw, self.dim(a(root, "height")) or vh
        body = "".join(self._svg(c) for c in root)
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vw} {vh}" width="{w}" height="{h}">{body}</svg>'
        ASSETS.mkdir(exist_ok=True)
        (ASSETS / f"{name}.svg").write_text(svg)
        return {"img": f"assets/{name}.svg", "w": w, "h": h}

    def _svg(self, e):
        a = lambda k: e.get(AND + k)
        if e.tag == "group":
            px, py = num(a("pivotX")), num(a("pivotY"))
            tf = (f"translate({num(a('translateX'))} {num(a('translateY'))}) translate({px} {py}) "
                  f"rotate({num(a('rotation'))}) scale({num(a('scaleX'), 1)} {num(a('scaleY'), 1)}) "
                  f"translate({-px} {-py})")
            return f'<g transform="{tf}">' + "".join(self._svg(c) for c in e) + "</g>"
        if e.tag != "path":
            return ""
        fill, stroke = self.resolve(a("fillColor")), self.resolve(a("strokeColor"))
        ok = lambda c: c if c and c.startswith("#") else "none"
        rule = ' fill-rule="evenodd"' if a("fillType") == "evenOdd" else ""
        return (f'<path d="{a("pathData")}" fill="{ok(fill)}" stroke="{ok(stroke)}" '
                f'stroke-width="{num(a("strokeWidth"))}"{rule}/>')


TITLE = [""]
R = Resources()
ALL_LINKS = json.loads((HERE / "links.json").read_text()) if (HERE / "links.json").exists() else {}
CTX = {"candidates": [], "links": {}, "adapters": [], "lists": 0, "fragments": [], "ids": set(), "in_row": 0}
STOP = {"rv", "list", "recycler", "view", "lv", "rec", "recyclerview", "listview"}


def tnode(text, **a):
    return {"k": "text", "tag": "TextView", "id": None, "a": {"text": text, **a}, "d": {}, "c": []}


def layout_root(name, depth):
    return build(ET.parse(RES / "layout" / f"{name}.xml").getroot(), depth + 1)[0]


NOT_ROW = r"dialog|popup|filter|header|footer|progress|loading|shimmer|empty|toolbar"


def auto_item(node):
    """Row layout for a list. Returns (layout, confidence): name match, only adapter, or ordered guess."""
    idx, CTX["lists"] = CTX["lists"], CTX["lists"] + 1
    ids = set(re.findall(r"[a-z]+", re.sub(r"(?<=[a-z])(?=[A-Z])|_", " ", node["id"] or "").lower())) - STOP
    pools = [[l for l in p if not re.search(NOT_ROW, l)] for p in CTX["adapters"]]
    pools = [p for p in pools if p]
    flat = list(dict.fromkeys([l for p in pools for l in p] + [c for c in CTX["candidates"] if re.search(r"row|item|card", c) and not re.search(NOT_ROW, c)]))
    overlap = lambda l: len(ids & set(l.split("_")))
    best = max(flat, key=overlap, default=None)
    if best and overlap(best) > 0:
        return best, "name"
    if not pools:
        return None, None
    pool = pools[min(idx, len(pools) - 1)]
    pick = next((l for l in pool if re.search(r"row|item|card", l)), pool[0])
    return pick, ("adapter" if len(pools) == 1 and CTX["lists"] == 1 else "guess")


def visible_nodes(n):
    return 0 if n["a"].get("visibility") == "gone" else 1 + sum(visible_nodes(k) for k in n["c"])


def richest_fragment(depth):
    """Of the fragment layouts this screen can host, the one showing the most views; used up once."""
    cands = list(dict.fromkeys(CTX["fragments"]))
    if not cands:
        return None
    saved = CTX["lists"]
    best = max(cands, key=lambda l: visible_nodes(layout_root(l, depth)))
    CTX["lists"] = saved
    CTX["fragments"] = [f for f in CTX["fragments"] if f != best]
    return best


def fragment_layout(cls):
    from map_screens import layouts_for
    found, _ = layouts_for(cls)
    return found[0] if found else None


def apply_link(node, link, depth, title):
    """Fill runtime content: list rows, fragment layouts, toolbar title, forced visibility."""
    if "visible" in link:
        node["a"]["visibility"] = "visible" if link["visible"] else "gone"
    if "item" in link:
        node["k"], node["clip"] = "linear", True
        node["a"].setdefault("orientation", "vertical")
        node["c"] = [layout_root(link["item"], depth) for _ in range(link.get("count", 4))]
    if link.get("auto") and (found := auto_item(node))[0]:
        item, how = found
        node["k"], node["clip"] = "linear", True
        node["a"].setdefault("orientation", "vertical")
        CTX["in_row"] += 1
        node["c"] = [layout_root(item, depth) for _ in range(5 if node["a"]["orientation"] == "horizontal" else 4)]
        CTX["in_row"] -= 1
        node["autoItem"], node["autoHow"] = item, how
    if "layout" in link:
        node["k"], node["c"] = "frame", [layout_root(link["layout"], depth)]
    if link.get("title"):
        node["k"] = "frame"
        node["c"] = [tnode("\u2039", textSize="30dp", textColor="#333333", layout_gravity="center_vertical",
                           layout_marginLeft="16dp", layout_width="wrap_content", layout_height="wrap_content"),
                     tnode(title, textSize="18dp", textColor="#333333", textStyle="bold", layout_gravity="center_vertical",
                           layout_marginLeft="56dp", layout_width="wrap_content", layout_height="wrap_content")]


def kind_of(tag, has_children):
    t = tag.rsplit(".", 1)[-1]
    if t in EXACT:
        return EXACT[t]
    if t.endswith("ImageView") or t.endswith("ImageButton"):
        return "image"
    if t.endswith(TEXT_SUFFIXES):
        return "text"
    return "frame" if t.endswith("Layout") or has_children else "view"


SAMPLES = [("chip|categor", "Category"), ("price|amount|total|value|mrp|rate|discount|tax", "$1,250.00"), ("qty|quantity|count|stock|units|number", "24"),
           ("phone|mobile|contact", "555-0142"), ("email", "name@example.com"), ("date", "13 Nov 2026"),
           ("address|location", "12 Market Street, Springfield"), ("desc|remark|note|message", "Short sample description text"),
           ("name|title|product|sku|customer|retailer|distributor", "Sample Name")]


def humanize(ident):
    """Sample text for a runtime-filled view, chosen from keywords in its id."""
    low = (ident or "").lower()
    for words, sample in SAMPLES:
        if re.search(words, low):
            return sample
    s = re.sub(r"^(tv|txt|text|et|edt|btn|lbl|label)(?=[A-Za-z_])", "", ident or "text").replace("_", " ")
    return re.sub(r"(?<=[a-z0-9])(?=[A-Z])", " ", s).strip().title() or "Text"


def attrs_of(el):
    return {k.split("}")[-1]: v for k, v in el.attrib.items() if not k.startswith(TOOLS)}


def build(el, depth=0):
    """Return a list of nodes (a merge root or include may expand to several)."""
    raw = attrs_of(el)
    if el.tag == "include":
        return build_include(raw, depth)
    base = {}
    if raw.get("textAppearance"):
        base.update(R.style_items(raw["textAppearance"].removeprefix("@style/")))
    if raw.get("style"):
        base.update(R.style_items(raw["style"].removeprefix("@style/")))
    raw = {**base, **raw}
    kids = [n for c in el for n in build(c, depth)]
    node = {"k": kind_of(el.tag, bool(kids)), "tag": el.tag.rsplit(".", 1)[-1], "id": R.resolve(raw.get("id")),
            "a": {}, "d": {}, "c": kids}
    for k, v in raw.items():
        if k in DRAWABLE_KEYS:
            if d := R.drawable(v):
                node["d"][DRAWABLE_KEYS[k]] = d
        elif k not in ("style", "id"):
            node["a"][k] = R.resolve(v)
    if node["tag"] == "AppBarLayout":
        node["a"].setdefault("orientation", "vertical")
    if node["k"] == "text" and not node["a"].get("text") and not node["a"].get("hint"):
        node["a"]["text"], node["ph"] = humanize(node["id"]), True
    link = CTX["links"].get(node["id"])
    if not link and node["k"] == "list" and depth < 4 and CTX["in_row"] == 0:
        link = {"auto": True}
    if not link and node["k"] == "fragment" and depth < 4:
        fl = fragment_layout(raw["name"]) if raw.get("name") else richest_fragment(depth)
        link = {"layout": fl} if fl else None
    big = "match_parent" in (raw.get("layout_width"), raw.get("layout_height")) or raw.get("layout_height") == "0.0dp"
    if (not link and not kids and node["k"] in ("frame", "linear", "relative") and node["id"] in CTX["ids"]
            and big and depth < 4 and (fl := richest_fragment(depth))):
        link = {"layout": fl}
    if node["id"] == "toolbar" and not link:
        link = {"title": True}
    if link:
        apply_link(node, link, depth, TITLE[0])
    return [node]


def build_include(raw, depth):
    name = raw["layout"].removeprefix("@layout/")
    root = ET.parse(RES / "layout" / f"{name}.xml").getroot()
    if depth > 8:
        return []
    nodes = build(root, depth + 1) if root.tag != "merge" else [n for c in root for n in build(c, depth + 1)]
    if root.tag != "merge" and nodes:
        over = {k: R.resolve(v) for k, v in raw.items() if k.startswith("layout_") or k == "visibility"}
        nodes[0]["a"].update({k: v for k, v in over.items() if k != "layout"})
        if raw.get("id"):
            nodes[0]["id"] = R.resolve(raw["id"])
    return nodes


def convert(layout, out=None, title=None, candidates=(), adapters=(), fragments=(), ids=()):
    """Convert one layout to screens/<out>.js. Returns the payload."""
    out = out or layout
    TITLE[0] = title or layout.replace("activity_", "").replace("_", " ").title()
    CTX["candidates"], CTX["adapters"], CTX["lists"] = [c for c in candidates if c != layout], list(adapters), 0
    CTX["fragments"], CTX["ids"], CTX["in_row"] = [f for f in fragments if f != layout], set(ids), 0
    CTX["links"] = {**ALL_LINKS.get("*", {}), **ALL_LINKS.get(layout, {})}
    tree = build(ET.parse(RES / "layout" / f"{layout}.xml").getroot())[0]
    bg = R.drawable(R.theme.get("windowBackground")) or {"bg": "#ffffff"}
    SCREENS.mkdir(exist_ok=True)
    payload = {"name": out, "layout": layout, "title": TITLE[0], "window": bg, "root": tree}
    (SCREENS / f"{out}.js").write_text(f'(window.SCREENS=window.SCREENS||{{}})["{out}"]={json.dumps(payload)};\n')
    return payload


if __name__ == "__main__":
    for n in sys.argv[1:]:
        convert(n)
        print(n, "ok")
    print("unresolved:", sorted(R.missing)[:20])
