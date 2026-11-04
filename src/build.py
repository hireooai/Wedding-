"""Assemble index.html from src/index.template.html (run: python3 src/build.py)."""
import re, pathlib
here = pathlib.Path(__file__).resolve().parent
site = here.parent
tpl = (here / "index.template.html").read_text()
g = (site / "assets/ganesha.svg").read_text()
vb = re.search(r'viewBox="([^"]+)"', g).group(1)
paths = "".join(f'<path pathLength="1" d="{d}"/>' for d in re.findall(r'<path d="([^"]+)"', g))
ganesha = f'<svg viewBox="{vb}" focusable="false">{paths}</svg>'
corner_svg = ('<svg viewBox="0 0 46 46" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">'
              '<path d="M2 40V14C2 7 7 2 14 2H40"/><path d="M8 40V18C8 12 12 8 18 8H40"/>'
              '<path d="M14 21c0-4 2.5-7 6.5-7 3 0 5 2 5 4.6 0 2.4-1.8 4-4 4"/>'
              '<circle cx="2" cy="44" r="1.4" fill="currentColor"/><circle cx="44" cy="2" r="1.4" fill="currentColor"/></svg>')
corners = "".join(f'<span class="corner corner--{c}" aria-hidden="true">{corner_svg}</span>' for c in ("tl", "tr", "bl", "br"))
html = tpl.replace("{{GANESHA}}", ganesha).replace("{{CORNERS}}", corners)
(site / "index.html").write_text(html)

# Artifact copy: the artifact host supplies <!doctype>/<html>/<head>/<body> itself.
art = html
for pat in [r"<!doctype html>\s*", r"<html[^>]*>\s*", r"</?head>\s*", r"<body>\s*", r"</body>\s*", r"</html>\s*",
            r'<meta charset="utf-8">\s*', r'<meta name="viewport"[^>]*>\s*']:
    art = re.sub(pat, "", art, flags=re.I)
(here / "artifact.html").write_text(art)
print("built index.html", len(html), "bytes; artifact.html", len(art), "bytes")
