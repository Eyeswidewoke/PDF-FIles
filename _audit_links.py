"""Audit: find all MD links from people-buckets that point to missing files."""
import os, re, pathlib

ROOT = pathlib.Path(r"o:\FILES\PDF-Files")
BUCKETS = ROOT / "content" / "emails" / "people-buckets"

link_re = re.compile(r'\[([^\]]*)\]\(\./([^)]+\.md)\)')

total_links = 0
missing_links = 0
missing_by_type = {}

for md_file in BUCKETS.rglob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="replace")
    for match in link_re.finditer(text):
        label = match.group(1)
        rel_path = match.group(2).replace("%20", " ")
        # These paths are relative to repo root (./content/...)
        full = ROOT / rel_path
        total_links += 1
        if not full.exists():
            missing_links += 1
            # Categorize
            parts = rel_path.split("/")
            if len(parts) >= 3:
                key = "/".join(parts[:3])
            else:
                key = rel_path
            missing_by_type[key] = missing_by_type.get(key, 0) + 1

print(f"Total links in people-buckets: {total_links}")
print(f"Missing targets: {missing_links}")
print(f"Working: {total_links - missing_links}")
print(f"\nMissing by path prefix:")
for k, v in sorted(missing_by_type.items(), key=lambda x: -x[1]):
    print(f"  {k}: {v}")
