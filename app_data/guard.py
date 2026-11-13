"""Legal wall check: nothing from the APK may enter the clean-room app or the clean Figma set.

Usage: uv run guard.py

Checks the clean side (field_sales_app source, figma_tools/out/clean.json) for:
1. APK-derived terms (names, wire fields, endpoint paths),
2. binary assets identical to any file in the APK resources or the study set,
3. binaries not listed in field_sales_app/assets_manifest.md.
Exit code 1 on any failure.
"""
import hashlib
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
RECON = HERE.parent
APP = HERE / "field_sales_app"
CLEAN_FILES = [HERE / "figma_tools" / "out" / "clean.json"]
SKIP_DIRS = {"node_modules", ".expo", ".git", "dist", "android", "ios", ".gradle"}
SKIP_NAMES = {"package-lock.json"}
TEXT_EXT = {".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".html", ".css", ".yml", ".yaml"}
BINARY_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".ttf", ".otf", ".woff", ".woff2", ".svg", ".ico"}
DENY = [r"vitalwires", r"beatroute", r"InterfaceC\d+", r"suppress_response_codes", r"sendmessage",
        r"beatplan_?id", r"\bis_(msl|fsl|csl)\b", r"\bv1/[a-z-]+", r"com\.gz\b"]
DENY_RE = re.compile("|".join(DENY), re.IGNORECASE)
APK_ASSET_DIRS = [HERE / "reference_viewer" / "assets", RECON / "apktool" / "res", RECON / "apktool" / "assets"]


def app_files():
    for f in APP.rglob("*"):
        if f.is_file() and not (set(f.relative_to(APP).parts) & SKIP_DIRS) and f.name not in SKIP_NAMES:
            yield f


def term_hits():
    hits = []
    for f in [*(f for f in app_files() if f.suffix in TEXT_EXT), *CLEAN_FILES]:
        if not f.exists():
            continue
        for i, line in enumerate(f.read_text(errors="ignore").splitlines(), 1):
            if m := DENY_RE.search(line):
                hits.append(f"{f.relative_to(HERE)}:{i}: term '{m.group(0)}'")
    return hits


def sha(f):
    return hashlib.sha256(f.read_bytes()).hexdigest()


def binary_hits():
    mine = [f for f in app_files() if f.suffix.lower() in BINARY_EXT]
    sizes = {f.stat().st_size: f for f in mine}
    hits = []
    for d in APK_ASSET_DIRS:
        for g in d.rglob("*") if d.exists() else []:
            if g.is_file() and g.stat().st_size in sizes and sha(g) == sha(sizes[g.stat().st_size]):
                hits.append(f"{sizes[g.stat().st_size].relative_to(HERE)} is identical to APK file {g}")
    manifest = (APP / "assets_manifest.md").read_text() if (APP / "assets_manifest.md").exists() else ""
    hits += [f"{f.relative_to(HERE)} is not listed in assets_manifest.md" for f in mine if f.name not in manifest]
    return hits


def main():
    if not APP.exists():
        sys.exit(f"missing {APP}")
    problems = term_hits() + binary_hits()
    print("\n".join(problems) or "guard: clean")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
