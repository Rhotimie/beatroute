"""Build an OpenAPI 3.1 document (docs/openapi.json and .yaml) from the parsed endpoints and DTO tables.

Names follow NAMING.md: schema properties use the server name; where the Jackson client name differs it is
recorded in `x-client-name`. Examples are synthesised, not observed.
"""
import json
import re
from collections import defaultdict

import yaml

import dto
import synth

SCALAR = {"String": {"type": "string"}, "int": {"type": "integer"}, "Integer": {"type": "integer"}, "long": {"type": "integer", "format": "int64"},
          "Long": {"type": "integer", "format": "int64"}, "short": {"type": "integer"}, "double": {"type": "number"}, "Double": {"type": "number"},
          "float": {"type": "number"}, "Float": {"type": "number"}, "boolean": {"type": "boolean"}, "Boolean": {"type": "boolean"}, "Object": {}}
LIST = re.compile(r"(?:ArrayList|List|HashSet|Set)<(.+)>$")
MAP = re.compile(r"(?:HashMap|Map|LinkedHashMap)<")
PATH_OVERRIDES = {"retrofit.checkUser": "v1/user/check-username"}
ENVELOPE = {"type": "object", "description": "Response envelope. `sendmessage` and `sendStatus` are the server names (see NAMING.md).",
            "properties": {"data": {}, "success": {"type": "boolean"}, "sendStatus": {"type": "integer"}, "sendmessage": {"type": "string"},
                           "data_error": {"type": "object"}, "pagination": {"$ref": "#/components/schemas/Pagination"}}}
COMMON_QUERY = {"name": "suppress_response_codes", "in": "query", "required": False, "schema": {"type": "boolean", "default": True},
                "description": "Sent by the app on every call; makes the server answer HTTP 200 and put the status in the body."}


class Schemas:
    """Registry of component schemas, filled lazily as types are referenced."""

    def __init__(self):
        self.items = {"Envelope": ENVELOPE}

    def of(self, typ):
        typ = (typ or "").strip()
        if m := LIST.match(typ):
            return {"type": "array", "items": self.of(m.group(1))}
        if typ.endswith("[]"):
            return {"type": "array", "items": self.of(typ[:-2])}
        if MAP.match(typ):
            return {"type": "object", "additionalProperties": True}
        if typ in SCALAR:
            return dict(SCALAR[typ])
        name = typ.split("<")[0]
        if name in self.items:
            return {"$ref": f"#/components/schemas/{name}"}
        if not re.fullmatch(r"[A-Za-z0-9_]+", name) or not dto.find(name):
            return {"description": f"Type `{typ}` not found among the decompiled models."}
        self.items[name] = {}
        self.items[name] = self.build(name)
        return {"$ref": f"#/components/schemas/{name}"}

    def build(self, name):
        props = {}
        for f in synth.fields_of(name) or []:
            p = self.of(f["type"])
            if f["client_name"] and f["client_name"] != f["server_name"]:
                p = {**p, "x-client-name": f["client_name"]}
            if "no_accessor" in f["flags"]:
                p = {**p, "x-note": "no accessor: Jackson would not send this field"}
            props[f["server_name"]] = p
        return {"type": "object", "properties": props}


def norm(path):
    return "/" + path.strip().strip("/")


def parameters(group, path):
    seen, out = set(), [{"$ref": "#/components/parameters/suppress_response_codes"}]
    for name in re.findall(r"\{(\w+)\}", path):
        seen.add(name)
        out.append({"name": name, "in": "path", "required": True, "schema": {"type": "string"}})
    for r in group:
        for q in r["query"]:
            if q["name"] not in seen:
                seen.add(q["name"])
                out.append({"name": q["name"], "in": "query", "required": False, "schema": SCHEMAS.of(q["type"])})
    return out


def request_body(r):
    if r["body_type"]:
        return {"required": True, "content": {"application/json": {"schema": SCHEMAS.of(r["body_type"]), "example": synth.sample(r["body_type"])}}}
    if r["form"]:
        props = {f["name"]: SCHEMAS.of(f["type"]) for f in r["form"]}
        return {"content": {"application/x-www-form-urlencoded": {"schema": {"type": "object", "properties": props}}}}
    if r["parts"]:
        return {"content": {"multipart/form-data": {"schema": {"type": "object", "properties": {p: {"type": "string", "format": "binary"} for p in r["parts"]}}}}}
    return None


def operation(group, tag, path):
    r = group[0]
    data = SCHEMAS.of(r["response_type"]) if r["envelope"] else SCHEMAS.of(r["response_type"])
    resp = {"allOf": [{"$ref": "#/components/schemas/Envelope"}, {"type": "object", "properties": {"data": data}}]} if r["envelope"] else data
    op = {"operationId": r["id"], "tags": [tag], "summary": r["java_name"], "parameters": parameters(group, path),
          "responses": {"200": {"description": "OK", "content": {"application/json": {"schema": resp, "example": synth.envelope(synth.sample(r["response_type"]), any(q["name"] == "page" for q in r["query"]))}}}}}
    if body := request_body(r):
        op["requestBody"] = body
    if len(group) > 1:
        op["x-other-client-methods"] = [{"id": g["id"], "response_type": g["response_type"], "body_type": g["body_type"]} for g in group[1:]]
    if r["flags"]:
        op["x-flags"] = r["flags"]
    return op


def build(recs):
    global SCHEMAS
    SCHEMAS = Schemas()
    SCHEMAS.of("Pagination")
    groups, dynamic = defaultdict(list), []
    for r in recs:
        path = PATH_OVERRIDES.get(r["id"], r["path"])
        if path is None:
            dynamic.append(r["id"])
            continue
        groups[(norm(path), r["http"].lower())].append(r)
    paths = {}
    for (path, verb), group in sorted(groups.items()):
        parts = path.strip("/").split("/")
        tag = parts[1] if parts[0] == "v1" and len(parts) > 1 else parts[0]
        paths.setdefault(path, {})[verb] = operation(group, tag, path)
    desc = ("API surface reconstructed from the decompiled Android client (Retrofit interfaces). Request and response examples are synthesised; "
            "no real traffic was observed. Authentication is not documented because it was not traced. The base URL comes from the login "
            "response (`api_url`). Field names are server names; `x-client-name` marks where the Jackson client uses a different name. "
            f"Endpoints with a runtime-built URL and no known path: {', '.join(dynamic) or 'none'}.")
    return {"openapi": "3.1.0", "info": {"title": "Field sales API (reconstructed)", "version": "0.1.0", "description": desc},
            "servers": [{"url": "https://{host}/", "variables": {"host": {"default": "api.example.com"}}}],
            "paths": paths, "components": {"parameters": {"suppress_response_codes": COMMON_QUERY}, "schemas": SCHEMAS.items}}


def write(recs, docs):
    spec = build(recs)
    (docs / "openapi.json").write_text(json.dumps(spec, indent=1))
    (docs / "openapi.yaml").write_text(yaml.safe_dump(spec, sort_keys=False, width=120))
    return spec
