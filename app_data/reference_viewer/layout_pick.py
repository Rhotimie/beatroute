"""Pick the layout an activity really shows, from evidence in its decompiled source.

Rule 1: a bare `setContentView(R.layout.X)` (not `dialog.setContentView`).
Rule 2: a bare `setContentView(...)` preceded by `Cls.b(getLayoutInflater())`; X is the layout inside binding class Cls.
Anything else is a guess and the caller falls back to its heuristic.

Usage: uv run layout_pick.py   (writes pick_audit.csv comparing screens/manifest.js with the evidence)
"""
import csv
import json
import re
from pathlib import Path

from map_screens import LAYOUTS, ROOT, binding_layout, source_of

HERE = Path(__file__).resolve().parent
BARE_CONTENT = re.compile(r"(?<![\w.])setContentView\(([^;]*)\);")
INFLATE = re.compile(r"\b(\w+)\.(?:b|c|d|inflate)\(getLayoutInflater\(\)")
LAYOUT_ARG = re.compile(r"R\.layout\.(\w+)")
WINDOW = 15


def evidence_layout(cls):
    """Return (layout or None, evidence string) for an activity class."""
    f = source_of(cls)
    if not f:
        return None, "no-source"
    lines = f.read_text(errors="ignore").splitlines()
    for i, line in enumerate(lines):
        if not (m := BARE_CONTENT.search(line)):
            continue
        if (r := LAYOUT_ARG.search(m.group(1))) and r.group(1) in LAYOUTS:
            return r.group(1), f"line {i + 1}: {line.strip()}"
        for back in range(i, max(i - WINDOW, -1), -1):
            if b := INFLATE.search(lines[back]):
                found = [x for x in binding_layout(b.group(1)) if x in LAYOUTS]
                if found:
                    return found[0], f"line {back + 1}: {lines[back].strip()} -> {b.group(1)}"
    return None, "none"


def manifest_picks():
    text = (HERE / "screens" / "manifest.js").read_text()
    return {m["activity"]: m["layout"] for m in json.loads(text[len("window.MANIFEST=") : -2])}


def write_audit():
    old = manifest_picks()
    rows = []
    for act, was in old.items():
        new, ev = evidence_layout(act)
        status = "agree" if new == was else "changed" if new else "no-evidence"
        rows.append([act.split(".")[-1], was, new or "", status, ev])
    with open(HERE / "pick_audit.csv", "w", newline="") as fh:
        csv.writer(fh).writerows([["activity", "old", "evidence_layout", "status", "evidence"]] + rows)
    counts = {s: sum(r[3] == s for r in rows) for s in ("agree", "changed", "no-evidence")}
    print(len(rows), "activities", counts)


if __name__ == "__main__":
    write_audit()
