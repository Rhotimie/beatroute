"""Deterministic sample JSON from DTO field tables. Values are invented; no real payload was observed."""
import re

import dto

MAX_DEPTH = 2
BY_NAME = [(r"email", "sam.rivera@example.com"), (r"mobile|phone|contact_?no|whatsapp", "555-0101"), (r"token", "<token>"),
           (r"lat", 37.7749), (r"lon|lng", -122.4194), (r"date|time", "2026-11-13 09:02:00"), (r"image|photo|logo|url|avatar", "https://example.com/file.jpg"),
           (r"name", "Corner Mart"), (r"city", "Springfield"), (r"pincode|zip", "62704"), (r"remark|message|note", "Sample text"),
           (r"price|amount|value|total|cash|discount", 12.5), (r"quantity|qty", 2), (r"status", "Active")]
SCALARS = {"String": "text", "int": 1, "Integer": 1, "long": 1, "Long": 1, "short": 1, "double": 1.5, "Double": 1.5, "float": 1.5, "Float": 1.5,
           "boolean": True, "Boolean": True, "Object": {}}
LIST = re.compile(r"(?:ArrayList|List|HashSet|Set)<(.+)>$")
MAP = re.compile(r"(?:HashMap|Map|LinkedHashMap)<")


EXACT = {"username": "sam.rivera", "password": "<password>", "otp": "482915", "twoFA_otp": "", "ver": "10.1.2", "lang": "en", "os_ver": "14",
         "bat_status": "85", "device": "mobile", "device_model": "Pixel 8", "method": "password", "terms_accepted": "1", "gp_service_version": "24.40.1"}
NUMERIC_HINT = re.compile(r"page|count|limit|remaining|^id$|_id$|^sku$|^retailer$", re.I)


def scalar(typ, key):
    base = SCALARS[typ]
    if typ in ("boolean", "Boolean") or not isinstance(base, (str, int, float)):
        return base
    if typ == "String" and key in EXACT:
        return EXACT[key]
    if typ == "String" and NUMERIC_HINT.search(key):
        return "1"
    for pat, val in BY_NAME:
        if re.search(pat, key, re.I) and (isinstance(val, str) == (typ == "String")):
            return val
    if typ == "String":
        return key
    return base


def fields_of(name, with_extra=False):
    """Merged (parents first) non-ignored fields of a model class, or None if the class is not found.

    with_extra adds getter-only properties Jackson would also send: they have no server name.
    """
    chain = dto.parse_all(name)
    if not chain:
        return None
    merged = {}
    for d in chain:
        for f in d["fields"]:
            if "ignored" not in f["flags"]:
                merged[f["server_name"]] = f
        if with_extra:
            for e in d["extra_props"]:
                if e["type"]:
                    merged[f"extra:{e['prop']}"] = {"field": None, "type": e["type"], "server_name": "(none)", "client_name": e["prop"], "flags": ["accessor_only"]}
    return list(merged.values())


def sample(typ, key="value", depth=0):
    typ = typ.strip()
    if m := LIST.match(typ):
        return [sample(m.group(1), key, depth)]
    if MAP.match(typ):
        return {}
    if typ in SCALARS:
        return scalar(typ, key)
    if typ.endswith("[]"):
        return [sample(typ[:-2], key, depth)]
    fields = fields_of(typ.split("<")[0]) if depth < MAX_DEPTH else None
    if fields is None:
        return f"<{typ}>"
    return {f["server_name"]: sample(f["type"], f["server_name"], depth + 1) for f in fields}


def envelope(data, paginated=False):
    """Response envelope using the server names (see NAMING.md)."""
    out = {"data": data, "success": True, "sendStatus": 200, "sendmessage": "OK"}
    if paginated:
        out["pagination"] = sample("Pagination", "pagination")
    return out


if __name__ == "__main__":
    import json
    print(json.dumps(sample("LoginRequest"), indent=1)[:500])
