#!/usr/bin/env python3
"""Rename blog folders to yyyy-mm_<slug> and add slug to frontmatter."""

import os
import re
import sys
from pathlib import Path

BLOG_DIR = Path(__file__).parent / "src/content/blog"


def parse_frontmatter(content: str):
    """Return (frontmatter_dict_raw, frontmatter_str, body_str, delim) or None."""
    if not content.startswith("---"):
        return None
    end = content.index("---", 3)
    fm_str = content[3:end]
    body = content[end + 3:]
    return fm_str, body


def get_pub_date(fm_str: str) -> str | None:
    m = re.search(r"^pubDate:\s*['\"]?(\d{4}-\d{2})", fm_str, re.MULTILINE)
    return m.group(1) if m else None  # returns "yyyy-mm"


def has_slug(fm_str: str) -> bool:
    return bool(re.search(r"^slug:", fm_str, re.MULTILINE))


def insert_slug(fm_str: str, slug: str) -> str:
    """Insert slug after the title line, or at the start."""
    lines = fm_str.splitlines(keepends=True)
    for i, line in enumerate(lines):
        if line.startswith("title:"):
            lines.insert(i + 1, f"slug: {slug}\n")
            return "".join(lines)
    return f"slug: {slug}\n" + fm_str


def process(dry_run=False):
    folders = sorted(p for p in BLOG_DIR.iterdir() if p.is_dir())
    renames = []

    for folder in folders:
        index = folder / "index.md"
        if not index.exists():
            print(f"  SKIP {folder.name}: no index.md")
            continue

        content = index.read_text(encoding="utf-8")
        parsed = parse_frontmatter(content)
        if not parsed:
            print(f"  SKIP {folder.name}: no frontmatter")
            continue

        fm_str, body = parsed
        pub_date = get_pub_date(fm_str)
        if not pub_date:
            print(f"  SKIP {folder.name}: no pubDate found")
            continue

        slug = folder.name
        new_name = f"{pub_date}_{slug}"
        new_folder = folder.parent / new_name

        if folder.name == new_name:
            print(f"  OK   {folder.name} (already renamed)")
            # still add slug if missing
            if not has_slug(fm_str):
                new_fm = insert_slug(fm_str, slug)
                new_content = f"---{new_fm}---{body}"
                if not dry_run:
                    index.write_text(new_content, encoding="utf-8")
                print(f"       -> added slug to frontmatter")
            continue

        print(f"  {folder.name}")
        print(f"    -> {new_name}")

        new_fm = fm_str
        if not has_slug(fm_str):
            new_fm = insert_slug(fm_str, slug)
            print(f"    -> adding slug: {slug}")

        new_content = f"---{new_fm}---{body}"
        renames.append((folder, new_folder, index, new_content))

    if dry_run:
        print(f"\nDry run: {len(renames)} folders would be renamed.")
        return

    for folder, new_folder, index, new_content in renames:
        index.write_text(new_content, encoding="utf-8")
        folder.rename(new_folder)

    print(f"\nDone: {len(renames)} folders renamed.")


if __name__ == "__main__":
    dry = "--dry-run" in sys.argv or "-n" in sys.argv
    if dry:
        print("=== DRY RUN ===\n")
    process(dry_run=dry)
