"""Resolve `Class.NAME` string constants used inside decompiled annotations and URL calls."""
import re
from pathlib import Path

SOURCES = Path(__file__).resolve().parents[2] / "jadx" / "sources"
CONST_FILES = {
    "ApiConstants": "com/gz/vitalwires/shared/utils/ApiConstants.java",
    "ApiEndpoints": "com/gz/vitalwires/shared/data/remote/api/ApiEndpoints.java",
    "MySQLiteHelper": "com/gz/vitalwires/sqlite/MySQLiteHelper.java",
}
DECL = re.compile(r"static final String (\w+) = ([^;]+);")
LITERAL = re.compile(r'"((?:[^"\\]|\\.)*)"')


_EXTERNAL = {}


def _external(ref):
    """Look `Class.NAME` up in any decompiled class (SDK constants such as TransferTable.COLUMN_FILE)."""
    if ref not in _EXTERNAL:
        cls, _, name = ref.rpartition(".")
        _EXTERNAL[ref] = None
        for f in SOURCES.rglob(cls.split(".")[-1] + ".java") if cls else []:
            m = re.search(rf'static final String {name} = "((?:[^"\\]|\\.)*)";', f.read_text(errors="ignore"))
            if m:
                _EXTERNAL[ref] = m.group(1)
                break
    return _EXTERNAL[ref]


def _eval(expr, table, owner):
    """Evaluate a `"a" + OTHER + "b"` expression; None if any part is unknown."""
    out = ""
    for part in (p.strip() for p in expr.split("+")):
        if m := LITERAL.fullmatch(part):
            out += m.group(1)
        elif (ref := table.get(part if "." in part else f"{owner}.{part}")) is not None:
            out += ref
        elif "." in part and (ext := _external(part)) is not None:
            out += ext
        else:
            return None
    return out


def load():
    """Return {"Class.NAME": value} for every resolvable string constant in the constant classes."""
    raw = {}
    for cls, rel in CONST_FILES.items():
        text = (SOURCES / rel).read_text(errors="ignore")
        raw.update({f"{cls}.{n}": (cls, e) for n, e in DECL.findall(text)})
    table = {}
    for _ in range(3):
        for key, (cls, expr) in raw.items():
            if key not in table and (v := _eval(expr, table, cls)) is not None:
                table[key] = v
    return table


def resolve(expr, table):
    """Resolve an annotation argument: a literal, a `Class.NAME` constant, or a `+` chain of both."""
    return _eval(expr.strip(), table, "")


if __name__ == "__main__":
    t = load()
    print(len(t), "constants; ApiConstants.ENDPOINT_CANCEL_LEAVE =", t.get("ApiConstants.ENDPOINT_CANCEL_LEAVE"))
