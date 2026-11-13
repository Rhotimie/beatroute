# Reference board

Reference only: Figma-style board of the decompiled app's screens (`../apktool/res/layout`), to study how views are
positioned. It lives in the recon folder on purpose. Do not copy its output, strings or drawables into the new app.

Approximate, not pixel exact, and never compared against real device screenshots. Runtime text is sample text (dotted
underline). Row layouts and fragments are traced from the Java; the inspector marks guesses.

    open board.html                  # canvas of all screens (file://, no server)
    open phone.html#CustomerListActivity   # one screen filling a phone window; use Chrome device mode (400x875)
    uv run convert_all.py            # rebuild screens/ and assets/ from ../apktool and ../jadx
    uv run a11y_report.py            # a11y_report.md: the original app's own WCAG problems (report only)

Checker: open phone.html and run `await LINT.run()` in the console. It reports nearly-empty screens, text overflow,
overlapping text, zero-size text, off-screen views and unresolved list/fragment placeholders.

Known gaps: ConstraintLayout chains and cyclic constraints, runtime-only state (which views show), fonts, default
widget styles, lists and fragments the app wires through obfuscated lambdas.

Files: `convert.py` XML to JSON, `map_screens.py` activity to layout/adapters/fragments, `engine.js` Android
measure/layout, `board.js` canvas, `lint.js` checker, `links.json` hand-wired lists for one screen.
