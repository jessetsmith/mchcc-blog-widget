#!/usr/bin/env python3
"""Regenerate blog-data.js from blog-data.json."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent
posts = json.loads((root / "blog-data.json").read_text())
payload = json.dumps(posts, ensure_ascii=True, separators=(",", ":"))
(root / "blog-data.js").write_text(
    "/* Auto-generated from blog-data.json — do not edit by hand.\n"
    "   Regenerate: python3 build-blog-data.py\n"
    "*/\n"
    f"window.MCHCC_BLOG_POSTS = {payload};\n"
)
print(f"Wrote blog-data.js ({len(posts)} posts)")
