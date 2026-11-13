"""Map each manifest activity to the layout it shows, via the decompiled Java.

Direct: R.layout.x in the activity source. Indirect: obfuscated view-binding classes called from it.
Writes screens_map.json {activity_class: [layout, ...]} and prints coverage.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SRC = ROOT / "jadx" / "sources"
LAYOUTS = {f.stem for f in (ROOT / "apktool/res/layout").glob("*.xml")}
LAYOUT_REF = re.compile(r"R\.layout\.([A-Za-z0-9_]+)")
CLASS_REF = re.compile(r"\b([A-Za-z][A-Za-z0-9_]{0,12})\.(?:b|c|d|a|inflate)\(")


def source_of(cls):
    f = SRC / (cls.replace(".", "/") + ".java")
    if f.exists():
        return f
    hits = list(SRC.rglob(cls.split(".")[-1] + ".java"))
    return hits[0] if hits else None


def binding_layout(name, cache={}):
    if name not in cache:
        f = SRC / "defpackage" / f"{name}.java"
        cache[name] = LAYOUT_REF.findall(f.read_text(errors="ignore")) if f.exists() else []
    return cache[name]


_INDEX = {}


def find_class(name, near=None):
    """Source file for a class name: same package as `near`, else defpackage, else the only match."""
    if not _INDEX:
        for f in SRC.rglob("*.java"):
            _INDEX.setdefault(f.stem, []).append(f)
    hits = _INDEX.get(name, [])
    for pick in ([h for h in hits if near and h.parent == near.parent], [h for h in hits if h.parent.name == "defpackage"], hits):
        if len(pick) == 1:
            return pick[0]
    return None


FRAG_REF = re.compile(r"\b([A-Z]\w*Fragment)\b")
GENERIC_FRAGMENTS = {"Fragment", "SupportMapFragment", "BaseFragment", "DialogFragment", "BottomSheetDialogFragment", "NavHostFragment"}
NEW_REF = re.compile(r"new ([A-Za-z][A-Za-z0-9_]*)\(")
ADAPTER_MARK = ("onCreateViewHolder", "extends BaseAdapter", "extends ArrayAdapter", "extends CursorAdapter", "getView(int")


def adapter_layouts(cls, near=None):
    """Layouts used by one adapter class: its own refs, inner classes, and binding classes it calls."""
    f = find_class(cls, near)
    if not f:
        return []
    texts = [f.read_text(errors="ignore")] + [g.read_text(errors="ignore") for g in f.parent.glob(f"{cls}$*.java")]
    found = []
    for t in texts:
        found += [l for l in LAYOUT_REF.findall(t) if l in LAYOUTS]
        found += [l for c in set(CLASS_REF.findall(t)) for l in binding_layout(c) if l in LAYOUTS]
    return list(dict.fromkeys(found))


def adapter_pools(cls):
    """One list of row layouts per adapter class that the activity constructs, in source order."""
    f = source_of(cls)
    if not f:
        return []
    pools = []
    for name in dict.fromkeys(NEW_REF.findall(f.read_text(errors="ignore"))):
        g = find_class(name, f)
        if g and any(mark in g.read_text(errors="ignore") for mark in ADAPTER_MARK):
            if layouts := adapter_layouts(name, f):
                pools.append(layouts)
    return pools


def layouts_in(f):
    """Layouts a source file shows: direct R.layout refs, else via the binding classes it calls."""
    text = f.read_text(errors="ignore")
    direct = [l for l in LAYOUT_REF.findall(text) if l in LAYOUTS]
    via = [l for c in set(CLASS_REF.findall(text)) for l in binding_layout(c) if l in LAYOUTS]
    return list(dict.fromkeys(direct or via))


def fragment_layouts(cls):
    """Main layout of each Fragment class the activity constructs, in source order."""
    f = source_of(cls)
    if not f:
        return []
    out = []
    for name in dict.fromkeys(FRAG_REF.findall(f.read_text(errors="ignore"))):
        g = find_class(name, f) if name not in GENERIC_FRAGMENTS else None
        if g and re.search(r"extends (\w+\.)?\w*Fragment\b", g.read_text(errors="ignore")):
            if found := layouts_in(g):
                out.append(found[0])
    return out


def ids_in(cls):
    """View ids (R.id.x) the activity's source refers to; empty containers among them host fragments."""
    f = source_of(cls)
    return set(re.findall(r"R\.id\.([A-Za-z0-9_]+)", f.read_text(errors="ignore"))) if f else set()


def layouts_for(cls):
    f = source_of(cls)
    if not f:
        return [], "no-source"
    text = f.read_text(errors="ignore")
    direct = [l for l in LAYOUT_REF.findall(text) if l in LAYOUTS]
    via = [l for c in sorted(set(CLASS_REF.findall(text))) for l in binding_layout(c) if l in LAYOUTS]
    both = list(dict.fromkeys(direct + via))
    return both, ("direct+binding" if direct and via else "direct" if direct else "binding" if via else "none")


if __name__ == "__main__":
    acts = [a.strip() for a in (ROOT / "activities.txt").read_text().splitlines() if a.strip()]
    out, kinds = {}, {}
    for a in acts:
        ls, how = layouts_for(a)
        out[a] = ls
        kinds[how] = kinds.get(how, 0) + 1
    (Path(__file__).parent / "screens_map.json").write_text(json.dumps(out, indent=1))
    print(len(acts), "activities", kinds)
