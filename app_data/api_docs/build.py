"""Build everything: parse the Retrofit interfaces, write the catalogue and the view docs.

Usage: uv run build.py
"""
import json

from openapi_spec_validator import OpenAPIV31SpecValidator as OpenAPIValidator

import consts
import openapi
import render
import retrofit


def main():
    table = consts.load()
    recs = [r for c in retrofit.CLIENTS for r in retrofit.parse_interface(c, table)]
    for c in retrofit.CLIENTS:
        n = sum(r["client"] == c for r in recs)
        assert n == retrofit.verb_count(c), f"{c}: parsed {n}, annotated {retrofit.verb_count(c)}"
    by_id = {r["id"]: r for r in recs}
    (render.HERE / "build").mkdir(exist_ok=True)
    (render.HERE / "build" / "catalogue.json").write_text(json.dumps(recs, indent=1))
    groups = render.catalogue_md(recs)
    (render.DOCS / "views").mkdir(parents=True, exist_ok=True)
    views = json.loads((render.HERE / "views.json").read_text())
    for v in views:
        (render.DOCS / "views" / f"{v['id']}.md").write_text(render.view_md(v, by_id))
    spec = openapi.write(recs, render.DOCS)
    OpenAPIValidator(spec).validate()
    (render.DOCS / "API.md").write_text(render.api_md(recs, views))
    (render.DOCS / "swagger.html").write_text(render.swagger_html(spec))
    print(len(recs), "endpoints,", groups, "groups,", len(views), "view docs;",
          sum(len(v) for v in spec["paths"].values()), "operations,", len(spec["components"]["schemas"]), "schemas, openapi valid")


if __name__ == "__main__":
    main()
