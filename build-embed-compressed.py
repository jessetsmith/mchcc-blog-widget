#!/usr/bin/env python3
"""Rebuild compressed Craft embeds from blog-data.json (EN + ES)."""
import argparse
import base64
import gzip
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent

LOCALES = {
    "en": {
        "file": "embed.html",
        "html_lang": "en",
        "title": "MCHCC Blog Archive",
        "lead": "Updates from across the CAPS &amp; Maple City Organization.",
        "heading": "Current News and Stories",
        "search_label": "Search posts",
        "search_placeholder": "Search posts…",
        "loading": "Loading posts…",
        "empty": "No posts match your search.",
        "back": "Back to posts",
        "read_more": "Read More",
        "min_read": "min read",
        "original_post": "Original post:",
        "no_content": "No content available for this post.",
        "decompress_error": "Could not decompress blog data.",
        "post_one": "1 post",
        "post_many": "{n} posts",
        "date_locale": "en-US",
        "comment": "VIDEO BLOCK EMBED (English, compressed inline data)",
    },
    "es": {
        "file": "embed.es.html",
        "html_lang": "es",
        "title": "Archivo del blog de MCHCC",
        "lead": "Estas publicaciones son de toda la organización CAPS &amp; Maple City.",
        "heading": "Noticias e historias actuales",
        "search_label": "Buscar publicaciones",
        "search_placeholder": "Buscar publicaciones…",
        "loading": "Cargando publicaciones…",
        "empty": "Ninguna publicación coincide con tu búsqueda.",
        "back": "Volver a las publicaciones",
        "read_more": "Leer más",
        "min_read": "min de lectura",
        "original_post": "Publicación original:",
        "no_content": "No hay contenido disponible para esta publicación.",
        "decompress_error": "No se pudieron descomprimir los datos del blog.",
        "post_one": "1 publicación",
        "post_many": "{n} publicaciones",
        "date_locale": "es-US",
        "comment": "VIDEO BLOCK EMBED (Español, datos comprimidos en línea)",
    },
}


def load_posts(lang="en"):
    source = "blog-data.es.json" if lang == "es" else "blog-data.json"
    path = root / source
    if not path.exists():
        raise SystemExit(f"Missing {path.name}. Create Spanish translations first.")
    posts = json.loads(path.read_text())
    for post in posts:
        if isinstance(post, dict):
            post["image"] = ""
    return posts


def extract_chrome():
    widget = (root / "widget.js").read_text()
    css = json.loads(re.search(r'style\.textContent = ("(?:\\.|[^"\\])*");', widget).group(1))
    markup = json.loads(re.search(r'mount\.innerHTML = ("(?:\\.|[^"\\])*");', widget).group(1))
    app = re.search(r"function startApp\(\) \{\n(.*)\n  \}\n\n  function boot", widget, re.S).group(1)
    return css, markup, app


def localize_markup(markup: str, loc: dict) -> str:
    replacements = [
        (
            "Updates from across the CAPS &amp; Maple City Organization.",
            loc["lead"],
        ),
        ("Current News and Stories", loc["heading"]),
        (">Search posts<", f">{loc['search_label']}<"),
        ('placeholder="Search posts…"', f'placeholder="{loc["search_placeholder"]}"'),
        ("Loading posts…", loc["loading"]),
        ("No posts match your search.", loc["empty"]),
        ("Back to posts", loc["back"]),
    ]
    for old, new in replacements:
        markup = markup.replace(old, new)
    return markup


def localize_app(app: str, loc: dict) -> str:
    app = app.replace(">Read More<", f">{loc['read_more']}<")
    app = app.replace("Read More\n", f"{loc['read_more']}\n")
    app = app.replace("${post.timeToRead} min read", f"${{post.timeToRead}} {loc['min_read']}")
    app = app.replace("Original post:", loc["original_post"])
    app = app.replace(
        "No content available for this post.",
        loc["no_content"],
    )
    app = app.replace('"en-US"', f'"{loc["date_locale"]}"')
    # Keep a real JS template literal: `${posts.length} …`
    count_many = loc["post_many"].replace("{n}", "${posts.length}")
    app = app.replace(
        'posts.length === 1 ? "1 post" : `${posts.length} posts`',
        'posts.length === 1 ? "' + loc["post_one"] + '" : `' + count_many + '`',
    )
    return app


def build_locale(lang: str, posts, css, markup, app):
    loc = LOCALES[lang]
    markup = localize_markup(markup, loc)
    app = localize_app(app, loc)

    raw_json = json.dumps(posts, ensure_ascii=True, separators=(",", ":")).encode("utf-8")
    payload_b64 = base64.b64encode(gzip.compress(raw_json, compresslevel=9)).decode("ascii")

    boot_js = f"""
(function () {{
  var COMPRESSED_BLOG_DATA = "{payload_b64}";

  function b64ToBytes(b64) {{
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }}

  async function decompressGzipBase64(b64) {{
    var bytes = b64ToBytes(b64);
    if (typeof DecompressionStream === "undefined") {{
      throw new Error("This browser cannot decompress inline blog data (needs DecompressionStream).");
    }}
    var stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    var text = await new Response(stream).text();
    return JSON.parse(text);
  }}

  async function boot() {{
    try {{
      window.MCHCC_BLOG_POSTS = await decompressGzipBase64(COMPRESSED_BLOG_DATA);
    }} catch (err) {{
      var el = document.getElementById("blog-error");
      var text = document.getElementById("blog-error-text");
      var loading = document.getElementById("blog-loading");
      if (loading) loading.hidden = true;
      if (el && text) {{
        el.hidden = false;
        text.textContent = (err && err.message) ? err.message : "{loc["decompress_error"]}";
      }}
      console.error(err);
      return;
    }}

{app}
  }}

  if (document.readyState === "loading") {{
    document.addEventListener("DOMContentLoaded", function () {{ boot(); }});
  }} else {{
    boot();
  }}
}})();
"""

    html = f"""<!--
  {loc["comment"]}

  Paste the FULL file into the Craft Video Block field.
  Regenerate after editing blog-data.json:
    python3 build-embed-compressed.py
-->
<!DOCTYPE html>
<html lang="{loc["html_lang"]}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{loc["title"]}</title>
<style>
{css}
html, body {{
  margin: 0;
  padding: 0;
  background: #f5f5f5;
}}
</style>
</head>
<body>
{markup}
<script>
{boot_js}
</script>
</body>
</html>
"""
    out = root / loc["file"]
    out.write_text(html)
    print(f"Wrote {out.name} ({out.stat().st_size} bytes)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--lang",
        choices=["en", "es", "all"],
        default="all",
        help="Which embed locale(s) to build",
    )
    args = parser.parse_args()

    css, markup, app = extract_chrome()
    langs = ["en", "es"] if args.lang == "all" else [args.lang]
    for lang in langs:
        posts = load_posts(lang)
        build_locale(lang, posts, css, markup, app)


if __name__ == "__main__":
    main()
