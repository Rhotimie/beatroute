"""Render dumped frames back to PNG, to eyeball them before importing into Figma.

Usage: uv run preview.py out/study.json FrameName [out.png]
"""
import json
import sys
from html import escape
from pathlib import Path

from playwright.sync_api import sync_playwright


def node_html(n):
    box = f"left:{n['x']}px;top:{n['y']}px;width:{n['w']}px;height:{n['h']}px;opacity:{n.get('op', 1)}"
    if n["t"] == "rect":
        st = n.get("stroke")
        css = box + (f";background:{n['fill']}" if n.get("fill") else "") + ";border-radius:" + " ".join(f"{r}px" for r in n["r"])
        if st:
            css += f";box-shadow:inset 0 0 0 {st['w']}px {st['c']}"
        return f'<div style="position:absolute;{css}"></div>'
    if n["t"] == "img":
        return f'<div style="position:absolute;{box};background:#d9d9d9;font:8px sans-serif;color:#888">{n["label"]}</div>'
    st = f"font:{'italic ' if n['italic'] else ''}{n['weight']} {n['size']}px Inter,sans-serif;color:{n['color']};white-space:{'normal' if n['lines'] > 1 else 'nowrap'}"
    return f'<div style="position:absolute;{box};{st}">{escape(n["text"])}</div>'


def main():
    data = json.load(open(sys.argv[1]))
    frame = next(f for f in data["frames"] if f["name"] == sys.argv[2])
    body = "".join(node_html(n) for n in frame["nodes"])
    html = f'<body style="margin:0"><div style="position:relative;width:{frame["w"]}px;height:{frame["h"]}px;background:{frame["bg"]};overflow:hidden">{body}</div>'
    out = sys.argv[3] if len(sys.argv) > 3 else f"out/{frame['name']}_preview.png"
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": frame["w"], "height": frame["h"]})
        pg.set_content(html)
        pg.screenshot(path=out)
        b.close()
    print("wrote", Path(out))


if __name__ == "__main__":
    main()
