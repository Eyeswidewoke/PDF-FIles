"""Fix all broken internal links across the content tree."""
import os, re, pathlib, json, collections

ROOT = pathlib.Path(r"o:\FILES\PDF-Files")
CONTENT = ROOT / "content"

# ============================================================
# PHASE 1: Catalog all missing cast-flagged emails
# ============================================================
# These are referenced but don't exist. We need to see if they
# exist anywhere else locally, or create stubs.

cast_flagged_dir = ROOT / "content" / "emails" / "cast-flagged"
all_cast_flagged = set(f.name for f in cast_flagged_dir.glob("*.md"))

# Find all referenced cast-flagged files
link_re = re.compile(r'\[([^\]]*)\]\(\./([^)]+)\)')
missing_cast_flagged = set()
missing_cast_pages = set()
missing_topics = set()
missing_other = []

for md_file in CONTENT.rglob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="replace")
    for match in link_re.finditer(text):
        rel_path = match.group(2).replace("%20", " ")
        if not rel_path.endswith(".md"):
            continue
        target = ROOT / rel_path
        if not target.exists():
            if "cast-flagged/" in rel_path:
                fname = rel_path.split("cast-flagged/")[-1]
                missing_cast_flagged.add(fname)
            elif "content/cast/pages/" in rel_path:
                missing_cast_pages.add(rel_path)
            elif "content/topics/" in rel_path or "content/cast/topics" in rel_path:
                missing_topics.add(rel_path)
            else:
                missing_other.append(rel_path)

print(f"Missing cast-flagged emails: {len(missing_cast_flagged)}")
print(f"Missing cast pages: {len(missing_cast_pages)}")
print(f"Missing topic files: {len(missing_topics)}")
print(f"Missing other: {len(missing_other)}")

# Sample of missing cast pages
print("\n--- Sample missing cast pages ---")
for p in sorted(missing_cast_pages)[:20]:
    print(f"  {p}")

# Sample of missing topics
print("\n--- Sample missing topic files ---")
for p in sorted(missing_topics)[:20]:
    print(f"  {p}")

# All missing other
print("\n--- All missing other ---")
for p in sorted(set(missing_other))[:30]:
    print(f"  {p}")

# Write full lists for reference
with open("_missing_cast_flagged.txt", "w") as f:
    for x in sorted(missing_cast_flagged):
        f.write(x + "\n")
with open("_missing_cast_pages.txt", "w") as f:
    for x in sorted(missing_cast_pages):
        f.write(x + "\n")
with open("_missing_topics.txt", "w") as f:
    for x in sorted(missing_topics):
        f.write(x + "\n")
