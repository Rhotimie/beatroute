"""Render view docs and the endpoint catalogue as Markdown from the parsed endpoints."""
import json
from collections import defaultdict
from pathlib import Path

import synth

HERE = Path(__file__).resolve().parent
DOCS = HERE / "docs"
BANNER = "> Samples are synthesised from field names and types. No real request or response was observed. See NAMING.md."


def table(rows, head):
    return "\n".join(["| " + " | ".join(head) + " |", "|" + "---|" * len(head), *("| " + " | ".join(str(c) for c in r) + " |" for r in rows)])


def code(obj):
    return "```json\n" + json.dumps(obj, indent=2) + "\n```"


def field_table(type_name):
    fields = synth.fields_of(type_name.split("<")[0].replace("ArrayList<", "").rstrip(">"), with_extra=True) if type_name else None
    if not fields:
        return f"Type `{type_name}` was not found among the decompiled models.\n"
    rows = [(f"`{f['server_name']}`", f"`{f['client_name']}`" if f["client_name"] else "-", f"`{f['type']}`", ", ".join(f["flags"])) for f in fields]
    return "\n" + table(rows, ["server name", "Jackson name", "type", "flags"]) + "\n"


def item_type(t):
    return t[t.index("<") + 1:-1] if t and t.startswith(("ArrayList<", "List<")) else t


def endpoint_md(r, path_override=None):
    path = path_override or r["path"] or "(dynamic)"
    out = [f"### {r['http']} `{path}`", f"`{r['id']}`" + (f" - flags: {', '.join(r['flags'])}" if r["flags"] else ""), ""]
    query = {q["name"]: synth.scalar(q["type"], q["name"]) if q["type"] in synth.SCALARS else "x" for q in r["query"]}
    form = {q["name"]: synth.scalar(q["type"], q["name"]) if q["type"] in synth.SCALARS else "x" for q in r["form"]}
    if r["query"]:
        out += ["**Query**", table([(f"`{q['name']}`", f"`{q['type']}`") for q in r["query"]], ["name", "type"]), ""]
    if r["body_type"]:
        out += [f"**Request body** `{r['body_type']}`", field_table(r["body_type"])]
    if form:
        out += ["**Form fields**", table([(f"`{q['name']}`", f"`{q['type']}`") for q in r["form"]], ["name", "type"]), ""]
    req = {k: v for k, v in {"query": query, "body": synth.sample(r["body_type"]) if r["body_type"] else None, "form": form}.items() if v}
    out += ["**Sample request**", code(req) if req else "(no parameters)", ""]
    resp_type = item_type(r["response_type"])
    out += [f"**Response data** `{r['response_type']}`" + (" (list)" if r["is_list"] else ""), field_table(resp_type)]
    data = synth.sample(r["response_type"])
    out += ["**Sample response**", code(synth.envelope(data, paginated=any(q["name"] == "page" for q in r["query"]))), ""]
    return "\n".join(out)


def view_md(view, by_id):
    out = [f"# {view['title']}", "", BANNER, "", view["summary"], "",
           f"Screens: prototype `{', '.join(view['screens']['prototype'])}`; app `{', '.join(view['screens']['apk'])}`.", "", "## Endpoints", ""]
    for eid in view["endpoints"]:
        out.append(endpoint_md(by_id[eid], view.get("path_overrides", {}).get(eid)))
    out += ["## Notes", "", *[f"- {n}" for n in view["notes"]], "", "## Not verified", "", *[f"- {n}" for n in view["open"]], ""]
    return "\n".join(out)


def catalogue_md(recs):
    groups = defaultdict(list)
    for r in recs:
        parts = (r["path"] or "dynamic").strip("/").split("/")
        groups[parts[1] if parts[0] == "v1" and len(parts) > 1 else parts[0]].append(r)
    (DOCS / "catalogue").mkdir(parents=True, exist_ok=True)
    index = []
    for g, rs in sorted(groups.items()):
        rows = [(r["http"], f"`{r['path']}`", r["client"], f"`{r['java_name']}`", f"`{r['body_type'] or '-'}`", f"`{r['response_type']}`") for r in sorted(rs, key=lambda r: (r["path"] or "", r["http"]))]
        (DOCS / "catalogue" / f"{g}.md").write_text(f"# {g}\n\n" + table(rows, ["verb", "path", "client", "method", "body", "response"]) + "\n")
        index.append(f"- [{g}](catalogue/{g}.md): {len(rs)}")
    (DOCS / "catalogue.md").write_text("# Endpoint catalogue\n\nEvery call carries `suppress_response_codes=true` (omitted from the tables).\n\n" + "\n".join(index) + "\n")
    return len(groups)


def api_md(recs, views):
    """One-file reference: every endpoint with parameters, body and response types, grouped by area."""
    groups = defaultdict(list)
    for r in recs:
        p = (r["path"] or "dynamic").strip("/").split("/")
        groups[p[1] if p[0] == "v1" and len(p) > 1 else p[0]].append(r)
    out = ["# API reference (reconstructed from the decompiled client)", "",
           "Machine-readable version: `openapi.json` / `openapi.yaml`; interactive: `swagger.html`. Worked examples per screen: `views/`.",
           "Every call carries `suppress_response_codes=true`. Names are server names; see `../NAMING.md`. Samples are synthesised.", "",
           "## Screens with worked examples", "", *[f"- [{v['title']}](views/{v['id']}.md)" for v in views], "", "## Endpoints", ""]
    for g, rs in sorted(groups.items()):
        out += [f"### {g} ({len(rs)})", ""]
        for r in sorted(rs, key=lambda r: (r["path"] or "", r["http"])):
            q = ", ".join(f"`{x['name']}`" for x in r["query"]) or "-"
            out.append(f"- **{r['http']} `{r['path'] or '(dynamic URL)'}`** ({r['client']}.{r['java_name']}) - query: {q}; body: `{r['body_type'] or '-'}`; response: `{r['response_type']}`"
                       + (f"; flags: {', '.join(r['flags'])}" if r["flags"] else ""))
        out.append("")
    return "\n".join(out)


def swagger_html(spec):
    """Self-contained Swagger UI page with the spec embedded, so it opens from disk."""
    return ('<!doctype html><html><head><meta charset="utf-8"><title>API reference</title>'
            '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui.css"></head><body><div id="ui"></div>'
            '<script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>'
            f'<script>SwaggerUIBundle({{spec: {json.dumps(spec)}, dom_id: "#ui", deepLinking: true}});</script></body></html>')
