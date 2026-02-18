"""Accurate audit: properly resolve relative paths from each file's directory."""
import os, re, pathlib, collections

ROOT = pathlib.Path(r"o:\FILES\PDF-Files")
CONTENT = ROOT / "content"

link_re = re.compile(r'\[([^\]]*)\]\((\.\.?/[^)]+\.md)\)')

total = 0
missing = 0
missing_by_prefix = collections.Counter()

for md_file in CONTENT.rglob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="replace")
    for match in link_re.finditer(text):
        rel = match.group(2).replace("%20", " ")
        # Always resolve relative to the file's parent directory
        target = (md_file.parent / rel).resolve()
        total += 1
        if not target.exists():
            missing += 1
            try:
                rel_to_root = target.relative_to(ROOT.resolve())
                parts = str(rel_to_root).replace("\\", "/").split("/")
                key = "/".join(parts[:3]) if len(parts) >= 3 else str(rel_to_root)
            except ValueError:
                key = str(target)
            missing_by_prefix[key] += 1

# Also check root-level MDs
for md_file in ROOT.glob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="replace")
    for match in link_re.finditer(text):
        rel = match.group(2).replace("%20", " ")
        target = (md_file.parent / rel).resolve()
        total += 1
        if not target.exists():
            missing += 1
            try:
                rel_to_root = target.relative_to(ROOT.resolve())
                key = str(rel_to_root).replace("\\", "/").split("/")[0]
            except ValueError:
                key = str(target)
            missing_by_prefix[key] += 1

pct_working = (total - missing) * 100 // max(total, 1)
pct_broken = missing * 100 // max(total, 1)
report = f"""FINAL LINK AUDIT
================
Total internal .md links: {total}
Working: {total - missing} ({pct_working}%)
Broken: {missing} ({pct_broken}%)

Broken by prefix (top 15):
"""
for k, v in missing_by_prefix.most_common(15):
    report += f"  {k}: {v}\n"

print(report)
with open("_audit_final_accurate.txt", "w") as f:
    f.write(report)
