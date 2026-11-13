"""Read model classes (decompiled Java) into field tables with server and Jackson names.

server_name: the shaded @SerializedName value (see NAMING.md), else the Jackson name.
client_name: what Jackson (default ObjectMapper) sends and reads: @JsonProperty, else the accessor/field name.
"""
import re
from functools import lru_cache

import consts

ROOT = consts.SOURCES / "com/gz/vitalwires"
PREFER = ("/model/Response/", "/dao/", "/model/")
FIELD = re.compile(r"^    (public|private|protected)\s+(?!static)(?:final\s+)?(.+?)\s+(\w+)(?:\s*=.*)?;$")
GETTER = re.compile(r"^    public (?!void|static)(.+?) (?:get|is)(\w+)\(\)")
SETTER = re.compile(r"^    public void set(\w+)\(")
EXTENDS = re.compile(r"class \w+(?:<[^>]*>)?\s+extends\s+(\w+)")
TABLE = consts.load()


@lru_cache(1)
def index():
    idx = {}
    for f in ROOT.rglob("*.java"):
        if "$" not in f.stem:
            idx.setdefault(f.stem, []).append(f)
    return idx


def find(name):
    hits = index().get(name, [])
    return next((h for p in PREFER for h in hits if p in str(h)), hits[0] if hits else None)


def implicit(name):
    """Jackson legacy property name: lower-case the leading run of capitals (URL -> url, TwoFA_otp -> twoFA_otp)."""
    i = 0
    while i < len(name) and name[i].isupper():
        i += 1
    return name[:i].lower() + name[i:] if i else name


def literal(arg):
    m = re.search(r'"((?:[^"\\]|\\.)*)"', arg or "")
    return m.group(1) if m else consts.resolve(arg or "", TABLE)


def annots_of(lines, i):
    """Annotation lines directly above line i."""
    out = []
    while i > 0 and lines[i - 1].strip().startswith("@"):
        i -= 1
        out.append(lines[i].strip())
    return out


def ann(annots, name):
    for a in annots:
        if m := re.match(rf"@{name}(?:\((.*)\))?$", a):
            return True, literal(m.group(1))
    return False, None


def parse_class(path):
    text = re.sub(r"/\*.*?\*/", "", path.read_text(errors="ignore"), flags=re.S)
    lines = text.splitlines()
    fields, getters, setters = [], {}, {}
    for i, line in enumerate(lines):
        a = annots_of(lines, i)
        if m := FIELD.match(line):
            fields.append((m.group(1), m.group(2), m.group(3), a))
        elif m := GETTER.match(line):
            getters[implicit(m.group(2))] = (m.group(1), a)
        elif m := SETTER.match(line):
            setters[implicit(m.group(1))] = a
    return fields, getters, setters, (EXTENDS.search(text) or [None, None])[1]


def field_record(vis, typ, name, a, getters, setters):
    acc = [a, *( [getters[name][1]] if name in getters else []), *([setters[name]] if name in setters else [])]
    ignored = any(ann(x, "JsonIgnore")[0] for x in acc)
    jp = next((v for x in acc for ok, v in [ann(x, "JsonProperty")] if ok and v), None)
    shaded = next((v for x in acc for ok, v in [ann(x, "InterfaceC1158On0")] if ok and v), None)
    linked = name in getters or name in setters or vis == "public"
    client = None if ignored else jp or (name if linked else None)
    flags = ["ignored"] if ignored else [] if linked or jp else ["no_accessor"]
    if shaded and client and shaded != client:
        flags.append("name_disagree")
    return {"field": name, "type": typ, "server_name": shaded or client or name, "client_name": client, "flags": flags}


def parse_dto(name):
    path = find(name)
    if not path:
        return None
    fields, getters, setters, parent = parse_class(path)
    recs = [field_record(*f[:3], f[3], getters, setters) for f in fields]
    known = {f[2] for f in fields}
    extra = [{"prop": p, "type": getters[p][0] if p in getters else None} for p in {*getters, *setters} - known]
    return {"name": name, "file": str(path.relative_to(consts.SOURCES)), "extends": parent, "fields": recs, "extra_props": sorted(extra, key=lambda e: e["prop"])}


def parse_all(name, seen=None):
    """The class plus its parents, parents first."""
    seen = seen if seen is not None else set()
    d = parse_dto(name)
    if not d or name in seen:
        return []
    seen.add(name)
    return [*(parse_all(d["extends"], seen) if d["extends"] else []), d]


if __name__ == "__main__":
    for n in ("LoginRequest", "MyResponse", "DataLogin"):
        d = parse_dto(n)
        bad = [f for f in d["fields"] if "name_disagree" in f["flags"]]
        print(n, len(d["fields"]), "fields;", len(bad), "disagree:", [(f["field"], f["server_name"], f["client_name"]) for f in bad][:4], "extra:", [e["prop"] for e in d["extra_props"]][:4])
