"""WCAG 2.1 AA report on the ORIGINAL app's layouts (report only, nothing is changed).

Checks per screen: images without contentDescription, fixed-size touch targets under 48dp,
text under 12sp, and text/background contrast under 4.5:1 (3:1 for large text).
Usage: uv run a11y_report.py  ->  a11y_report.md
"""
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent


def load(js):
    return json.loads(js[js.index("]=") + 2 : js.rindex(";")])


def rgb(c):
    if not c or not re.fullmatch(r"#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?", c) or (len(c) == 9 and c[7:] != "ff"):
        return None
    return tuple(int(c[i : i + 2], 16) / 255 for i in (1, 3, 5))


def lum(c):
    f = lambda v: v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = map(f, c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def dp(v):
    m = re.match(r"-?[\d.]+", str(v or ""))
    return float(m.group()) if m else None


def audit(screen):
    out = {"noDescription": 0, "smallTarget": 0, "smallText": 0, "lowContrast": 0}
    window = rgb((screen["window"] or {}).get("bg")) or (1, 1, 1)

    def walk(n, bg, hidden):
        a, hidden = n["a"], hidden or n["a"].get("visibility") == "gone"
        own = (n["d"].get("background") or {}).get("bg")
        bg = rgb(own) or bg
        if not hidden:
            clickable = a.get("clickable") == "true" or n["tag"] in ("Button", "ImageButton", "AppCompatButton", "CheckBox", "RadioButton")
            if n["k"] == "image" and clickable and not a.get("contentDescription"):
                out["noDescription"] += 1
            if clickable and any((v := dp(a.get(k))) is not None and 0 <= v < 48 for k in ("layout_width", "layout_height")):
                out["smallTarget"] += 1
            if n["k"] == "text":
                size = dp(a.get("textSize")) or 14
                if size < 12:
                    out["smallText"] += 1
                fg = rgb(a.get("textColor") or "#000000")
                if fg and (a.get("text") or a.get("hint")):
                    need = 3 if size >= 18 or (size >= 14 and "bold" in a.get("textStyle", "")) else 4.5
                    if ratio(fg, bg) < need:
                        out["lowContrast"] += 1
        for c in n["c"]:
            walk(c, bg, hidden)

    walk(screen["root"], window, False)
    return out


def main():
    manifest = json.loads((HERE / "screens" / "manifest.js").read_text()[len("window.MANIFEST=") : -2])
    rows, totals = [], {}
    for m in manifest:
        if m["area"] == "Third-party SDK":
            continue
        r = audit(load((HERE / "screens" / f"{m['name']}.js").read_text()))
        for k, v in r.items():
            totals[k] = totals.get(k, 0) + v
        rows.append((sum(r.values()), m["title"], r))
    rows.sort(key=lambda x: -x[0])
    lines = ["# Accessibility report: original app layouts", "",
             "Report only. Standard: WCAG 2.1 AA. Static checks on layout XML, not a screen reader test.", "",
             f"Screens audited: {len(rows)}", "",
             "| Finding | WCAG | Count |", "|---|---|---|",
             f"| Clickable images with no contentDescription | 1.1.1, 4.1.2 | {totals['noDescription']} |",
             f"| Clickable views with a fixed size under 48dp | 2.5.5 | {totals['smallTarget']} |",
             f"| Text under 12sp | 1.4.4 | {totals['smallText']} |",
             f"| Text/background contrast below AA | 1.4.3 | {totals['lowContrast']} |", "",
             "## Screens with the most findings", "", "| Screen | No description | Small target | Small text | Low contrast |", "|---|---|---|---|---|"]
    lines += [f"| {t} | {r['noDescription']} | {r['smallTarget']} | {r['smallText']} | {r['lowContrast']} |" for _, t, r in rows[:15]]
    lines += ["", "Limits: wrap_content sizes are not measured here, contrast ignores images and gradients behind text,",
              "and text set at runtime may use other colours."]
    (HERE / "a11y_report.md").write_text("\n".join(lines) + "\n")
    print(totals)


main()
