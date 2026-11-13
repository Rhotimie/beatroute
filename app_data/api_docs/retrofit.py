"""Parse the two decompiled Retrofit interfaces into endpoint records.

ApiInterface uses `Call<MyResponse<T>>`; ApiInterfaceKotlin uses suspend functions, which jadx shows as
`Object name(..., InterfaceC4399gm<? super Response<MyResponse<T>>>)`.
"""
import json
import re
from pathlib import Path

import consts

REST = consts.SOURCES / "com/gz/vitalwires/rest"
CLIENTS = {"retrofit": "ApiInterface.java", "kotlin": "ApiInterfaceKotlin.java"}
VERB = re.compile(r"@(GET|POST|PUT|DELETE|PATCH)(?:\((.*)\))?$")
HTTP = re.compile(r"@HTTP\((.*)\)$")
PARAM = re.compile(r"^((?:@\w+(?:\((?:[^()\"]|\"[^\"]*\")*\))?\s+)*)(.+?)\s+(\w+)$")
ANNOT = re.compile(r"@(\w+)(?:\(((?:[^()\"]|\"[^\"]*\")*)\))?")
CONTINUATION = "InterfaceC4399gm<"
COMMON_QUERY = "suppress_response_codes"


def split_top(s):
    """Split on commas outside quotes, <> and ()."""
    out, depth, cur, quoted = [], 0, "", False
    for ch in s:
        quoted ^= ch == '"'
        depth += (ch in "<(") - (ch in ">)") if not quoted else 0
        if ch == "," and depth == 0 and not quoted:
            out.append(cur.strip()); cur = ""
        else:
            cur += ch
    return [*out, cur.strip()] if cur.strip() else out


def unwrap(t):
    """(response type, envelope?) after removing Call/Response/MyResponse wrappers."""
    t = t.removeprefix("? super ").strip()
    while m := re.fullmatch(r"(?:Call|Response)<(.+)>", t):
        t = m.group(1)
    if m := re.fullmatch(r"MyResponse<(.+)>", t):
        return m.group(1), True
    return t, t == "MyResponse"


TABLE = consts.load()


def first_literal(args):
    """Annotation name: a string literal, else a resolved constant (`value = X`, or the bare argument)."""
    m = re.search(r'"((?:[^"\\]|\\.)*)"', args or "")
    if m:
        return m.group(1)
    expr = re.sub(r"^.*\bvalue\s*=\s*", "", (args or "").strip())
    return consts.resolve(expr, TABLE) if expr else None


def parse_params(sig_args):
    params = []
    for raw in split_top(sig_args):
        m = PARAM.match(raw)
        if not m:
            params.append({"kind": "unparsed", "raw": raw})
            continue
        annots, typ, var = m.groups()
        a = ANNOT.search(annots)
        params.append({"kind": a.group(1) if a else "plain", "name": first_literal(a.group(2)) if a else None, "type": typ, "var": var})
    return params


def method_path(annots, table):
    """(http verb, raw path expr, resolved path or None) from the method-level annotations."""
    for a in annots:
        if m := VERB.match(a):
            return m.group(1), m.group(2)
        if m := HTTP.match(a):
            verb = re.search(r"method\s*=\s*(?:\w+\.)?(\w+)", m.group(1)).group(1)
            path = re.search(r'path\s*=\s*("[^"]*"|[\w.]+)', m.group(1))
            return verb, path.group(1) if path else None
    return None, None


def parse_chunk(chunk, client, table):
    lines = [l.strip() for l in chunk.strip().splitlines() if l.strip()]
    annots = [l for l in lines if l.startswith("@")]
    sig = " ".join(l for l in lines if not l.startswith("@"))
    verb, raw = method_path(annots, table)
    m = re.match(r"(.+?)\s+(\w+)\((.*)\)$", sig)
    if not verb or not m:
        return None
    ret, name, args = m.groups()
    params = parse_params(args)
    flags = []
    if params and params[-1].get("type", "").startswith(CONTINUATION):
        ret = params.pop()["type"][len(CONTINUATION):-1]
    resp, envelope = unwrap(ret)
    if raw is None:
        path, flags = None, ["dynamic_url"]
    else:
        path = consts.resolve(raw, table)
        if path is None:
            path, flags = raw, ["const_unresolved"]
        if path != path.strip():
            flags.append("trailing_space")
        if path.strip().startswith("/"):
            flags.append("leading_slash")
    of = lambda *kinds: [p for p in params if p["kind"] in kinds]
    return {"id": f"{client}.{name}", "client": client, "java_name": name, "http": verb, "path": path.strip() if path else None, "path_raw": raw,
            "query": [{"name": p["name"], "type": p["type"]} for p in of("Query") if p["name"] != COMMON_QUERY],
            "path_params": [p["name"] for p in of("Path")], "form": [{"name": p["name"], "type": p["type"]} for p in of("Field")],
            "parts": [p["name"] for p in of("Part")], "body_type": (of("Body") or [{}])[0].get("type"),
            "header_params": [p["name"] for p in of("Header")], "response_type": resp, "envelope": envelope,
            "is_list": resp.startswith(("ArrayList<", "List<")), "flags": flags}


def parse_interface(client, table):
    text = (REST / CLIENTS[client]).read_text(errors="ignore")
    body = re.sub(r"/\*.*?\*/|//[^\n]*", "", text[text.index("public interface"):], flags=re.S)
    body = body[body.index("{") + 1:]
    return [r for chunk in body.split(";") if (r := parse_chunk(chunk, client, table))]


def verb_count(client):
    return len(re.findall(r"^    @(?:GET|POST|PUT|DELETE|PATCH|HTTP)\b", (REST / CLIENTS[client]).read_text(), flags=re.M))


def main():
    table = consts.load()
    out = {c: parse_interface(c, table) for c in CLIENTS}
    for c, recs in out.items():
        print(c, "parsed", len(recs), "of", verb_count(c), "annotated")
    all_recs = [r for recs in out.values() for r in recs]
    flags = {}
    for r in all_recs:
        for f in r["flags"]:
            flags[f] = flags.get(f, 0) + 1
    print("unique (verb, path):", len({(r["http"], r["path"]) for r in all_recs}), "flags:", flags)
    Path(__file__).parent.joinpath("build").mkdir(exist_ok=True)
    Path(__file__).parent.joinpath("build", "retrofit.json").write_text(json.dumps(all_recs, indent=1))


if __name__ == "__main__":
    main()
