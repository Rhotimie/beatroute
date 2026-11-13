"""Dump rendered screens to JSON frames for the Figma plugin.

Usage: uv run dump.py study|clean [--only Id1,Id2]

study: reference_viewer/phone.html, every non-SDK screen, colours reduced to greys, images to placeholders.
clean: beatroute_prototype/index.html, every screen in a populated state, colours kept.
"""
import argparse
import csv
import json
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
VIEWER = HERE.parent / "reference_viewer"
CLEAN = HERE.parent / "beatroute_prototype"
OUT = HERE / "out"
W, H = 360, 740


def weak_picks():
    """Activities whose layout was a heuristic guess (no source evidence)."""
    with open(VIEWER / "pick_audit.csv") as fh:
        return {r["activity"] for r in csv.DictReader(fh) if r["status"] == "no-evidence"}


def dump_study(page, only):
    page.goto((VIEWER / "phone.html").as_uri())
    page.add_script_tag(path=str(HERE / "dump_walker.js"))
    manifest = page.evaluate("MANIFEST")
    print("Roboto available:", page.evaluate("document.fonts.check('14px Roboto')"))
    weak = weak_picks()
    frames = []
    for m in manifest:
        if m["area"] == "Third-party SDK" or (only and m["name"] not in only):
            continue
        nodes, bg = page.evaluate(
            """async n => { await show(n);
                 return [__walk($('scr'), $('stage'), {neutral: true}), $('scr').style.background]; }""", m["name"])
        frames.append({"name": m["name"], "title": m["title"], "area": m["area"], "layout": m["layout"], "w": W, "h": H,
                       "bg": bg, "pick": "guess" if m["name"] in weak else "evidence", "nodes": nodes})
    return {"schema": 1, "set": "study", "frames": frames}


PRESET = "D.state = {dayIn: true, dayInTime: '09:02', checkedIn: 1, cart: {1: 2, 3: 1}, draftCount: 2}"


def dump_clean(page, only):
    """Every prototype screen rendered at param 1 in a populated state, colours kept."""
    page.goto((CLEAN / "index.html").as_uri())
    page.add_script_tag(path=str(HERE / "dump_walker.js"))
    page.evaluate(PRESET)
    frames = []
    for sid in page.evaluate("Object.keys(S)"):
        if only and sid not in only:
            continue
        f = page.evaluate(
            """id => { jump(id, '1'); const ph = $('phone'), r = ph.getBoundingClientRect(), s = S[id];
                 return {name: id, title: s.title, area: s.area, w: r.width, h: r.height,
                         bg: getComputedStyle(ph).backgroundColor, nodes: __walk(ph, ph, {neutral: false})}; }""", sid)
        frames.append({**f, "pick": "n/a"})
    return {"schema": 1, "set": "clean", "frames": frames}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("set", choices=["study", "clean"])
    ap.add_argument("--only", default="")
    args = ap.parse_args()
    only = {s for s in args.only.split(",") if s}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        size = {"width": W, "height": H + 44} if args.set == "study" else {"width": 1200, "height": 900}
        page = browser.new_page(viewport=size)
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        data = (dump_study if args.set == "study" else dump_clean)(page, only)
        browser.close()
    OUT.mkdir(exist_ok=True)
    (OUT / f"{args.set}.json").write_text(json.dumps(data))
    kinds = {}
    for f in data["frames"]:
        for n in f["nodes"]:
            kinds[n["t"]] = kinds.get(n["t"], 0) + 1
    print(len(data["frames"]), "frames", kinds, "page errors:", errors[:3])


if __name__ == "__main__":
    main()
