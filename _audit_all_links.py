"""Full site link audit: check all internal .md links across the entire content tree."""
import os, re, pathlib, collections

ROOT = pathlib.Path(r"o:\FILES\PDF-Files")
CONTENT = ROOT / "content"

# Match markdown links like [label](./path.md) or [label](path.md) or [label](../path.md)
link_re = re.compile(r'\[([^\]]*)\]\((\./[^)]+\.md|\.\.\/[^)]+\.md)\)')

total_links = 0
missing_links = 0
missing_files_set = set()
missing_by_prefix = collections.Counter()

for md_file in CONTENT.rglob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="replace")
    for match in link_re.finditer(text):
        rel_path = match.group(2).replace("%20", " ")
        # Resolve relative to the file's directory or repo root
        if rel_path.startswith("./"):
            # Relative to repo root
            target = ROOT / rel_path[2:]
        else:
            # Relative to current file
            target = md_file.parent / rel_path
        target = target.resolve()
        total_links += 1
        if not target.exists():
            missing_links += 1
            # Get relative path for categorization
            try:
                rel = target.relative_to(ROOT)
            except ValueError:
                rel = target
            parts = str(rel).replace("\\", "/").split("/")
            if len(parts) >= 3:
                key = "/".join(parts[:3])
            else:
                key = str(rel)
            missing_by_prefix[key] += 1
            missing_files_set.add(str(rel))

lines_out = []
lines_out.append(f"Total internal .md links scanned: {total_links}")
lines_out.append(f"Missing targets: {missing_links} ({missing_links*100//max(total_links,1)}%)")
lines_out.append(f"Working: {total_links - missing_links} ({(total_links-missing_links)*100//max(total_links,1)}%)")
lines_out.append(f"Unique missing files: {len(missing_files_set)}")
lines_out.append(f"\nMissing by path prefix (top 20):")
for k, v in missing_by_prefix.most_common(20):
    lines_out.append(f"  {k}: {v}")
report = "\n".join(lines_out)
print(report)
with open("_audit_report.txt", "w") as f:
    f.write(report)
