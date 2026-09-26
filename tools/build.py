#!/usr/bin/env python3
"""Bundle Claude Power-Up into single, shareable HTML files.

Reads index.html, inlines the local stylesheet and scripts, and writes:
  dist/claude-power-up.html  - one self-contained file (email it, host it anywhere)
  dist/artifact.html         - the same page without <html>/<head>/<body> tags,
                               for publishing as a Claude artifact

Usage: python3 tools/build.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"


def inline_assets(html: str) -> str:
    def css(match):
        path = ROOT / match.group(1)
        return "<style>\n" + path.read_text(encoding="utf-8") + "\n</style>"

    def js(match):
        path = ROOT / match.group(1)
        code = path.read_text(encoding="utf-8").replace("</script", "<\\/script")
        return "<script>\n" + code + "\n</script>"

    html = re.sub(r'<link rel="stylesheet" href="(assets/[^"]+\.css)">', css, html)
    html = re.sub(r'<script src="(assets/[^"]+\.js)"></script>', js, html)
    return html


def region(html: str, name: str) -> str:
    start = f"<!-- build:{name}-start -->"
    end = f"<!-- build:{name}-end -->"
    a = html.index(start) + len(start)
    b = html.index(end)
    return html[a:b].strip()


def main() -> None:
    source = (ROOT / "index.html").read_text(encoding="utf-8")
    bundled = inline_assets(source)

    DIST.mkdir(exist_ok=True)
    standalone = re.sub(r"\s*<!-- build:[a-z-]+ -->", "", bundled)
    (DIST / "claude-power-up.html").write_text(standalone, encoding="utf-8")

    # Artifact pages get their own <!doctype>/<head>/<body> skeleton when
    # published, so only the title, styles, markup and scripts go in.
    artifact = region(bundled, "head") + "\n" + region(bundled, "body") + "\n"
    (DIST / "artifact.html").write_text(artifact, encoding="utf-8")

    for f in ("claude-power-up.html", "artifact.html"):
        size = (DIST / f).stat().st_size
        print(f"dist/{f}: {size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
