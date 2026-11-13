"""Convert every manifest activity to a screen and write screens/manifest.js for the board viewer.

Usage: uv run convert_all.py
"""
import json
import re
import traceback
from pathlib import Path

import convert
from layout_pick import evidence_layout
from map_screens import ROOT, adapter_pools, fragment_layouts, ids_in, layouts_for, source_of

AREAS = [("Sign-in", r"login|username|password|otp|activation|splash|signin|forgot|register"),
         ("Attendance", r"attendance|leave|dayin|dayout|holiday"),
         ("Beat plan", r"schedule|plan|route|map|beat"),
         ("Customers", r"customer|retailer|onboard|geotag|outlet|associat"),
         ("Distributors", r"distributor|supplier"),
         ("Stock", r"stock|inventory"),
         ("Payment", r"payment|outstanding|invoice|collect"),
         ("Orders", r"order|product|cart|draft|sku|scheme|promo|dispatch|return"),
         ("Visit", r"checkin|visit|feedback|saleslog|logsales|note"),
         ("Campaigns", r"campaign|survey|audit|task|cue"),
         ("Approvals", r"approv|pending|unapprov"),
         ("Team", r"team|user|profile"),
         ("Expenses and assets", r"expense|asset|claim"),
         ("Learning", r"learn|topic|gamif|points|reward|loyal|demo")]


def area_of(short):
    low = short.lower()
    return next((a for a, pat in AREAS if re.search(pat, low)), "Other")


def tokens(s):
    return set(re.findall(r"[a-z]+", re.sub(r"(?<=[a-z0-9])(?=[A-Z])|_", " ", s).lower())) - {"activity", "kotlin", "kt", "view", "new"}


def pick_main(layouts, short=""):
    """Main layout: prefer activity_*, then not a dialog/row/helper, then best name overlap with the activity."""
    skip = r"dialog|row|item|popup|header|footer|filter|spinner|sync|alert"
    want = tokens(short)
    key = lambda l: (l.startswith("activity_"), not re.search(skip, l), len(want & tokens(l)))
    return max(layouts, key=key)


def title_of(short):
    t = re.sub(r"(Activity|Kotlin|View)$", "", short)
    return re.sub(r"(?<=[a-z0-9])(?=[A-Z])|_", " ", t).strip() or short


def targets(cls, shorts):
    f = source_of(cls)
    found = re.findall(r"([A-Za-z0-9_]+)\.class", f.read_text(errors="ignore")) if f else []
    return sorted({t for t in found if t in shorts and t != cls.split(".")[-1]})


def main():
    acts = [a.strip() for a in (ROOT / "activities.txt").read_text().splitlines() if a.strip()]
    mapped = {a: layouts_for(a)[0] for a in acts}
    shorts = {a.split(".")[-1] for a, l in mapped.items() if l}
    manifest, errors = [], []
    for a, layouts in mapped.items():
        short = a.split(".")[-1]
        if not layouts:
            continue
        proven = evidence_layout(a)[0]
        main_layout = proven or pick_main(layouts, short)
        layouts = layouts if main_layout in layouts else [main_layout, *layouts]
        try:
            p = convert.convert(main_layout, short, title_of(short), layouts, adapter_pools(a), fragment_layouts(a), ids_in(a))
        except Exception:
            errors.append(f"{a} ({main_layout})\n{traceback.format_exc(limit=2)}")
            continue
        manifest.append({"name": short, "title": p["title"], "area": area_of(short) if a.startswith("com.gz.vitalwires") else "Third-party SDK", "layout": main_layout,
                         "activity": a, "opens": targets(a, shorts)})
    (convert.SCREENS / "manifest.js").write_text("window.MANIFEST=" + json.dumps(manifest) + ";\n")
    (convert.HERE / "convert_errors.txt").write_text("\n".join(errors))
    print(len(manifest), "screens,", len(errors), "errors")
    print("unresolved resources:", len(convert.R.missing), sorted(convert.R.missing)[:15])


if __name__ == "__main__":
    main()
