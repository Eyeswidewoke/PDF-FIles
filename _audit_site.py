"""Site-accurate audit: resolve all ./path links from repo ROOT (as the web viewer does)."""
import os, re, pathlib, collections

ROOT = pathlib.Path(r"o:\FILES\PDF-Files")

link_re = re.compile(r'\[([^\]]*)\]\(\./([^)]+\.md)\)')

total = 0
missing = 0
missing_by_prefix = collections.Counter()

# Check ALL md files
for md_file in ROOT.rglob("*.md"):
    # Skip temp/audit files
    if md_file.name.startswith("_"):
        continue
    text = md_file.read_text(encoding="utf-8", errors="replace")
    for match in link_re.finditer(text):
        rel = match.group(2).replace("%20", " ")
        target = ROOT / rel
        total += 1
        if not target.exists():
            missing += 1
            parts = rel.replace("\\", "/").split("/")
            key = "/".join(parts[:3]) if len(parts) >= 3 else rel
            missing_by_prefix[key] += 1

pct = (total - missing) * 100 // max(total, 1)
report = f"""SITE-ACCURATE LINK AUDIT (paths resolved from repo root)
========================================================
Total ./path links: {total}
Working: {total - missing} ({pct}%)
Broken: {missing} ({missing * 100 // max(total, 1)}%)

Broken by path prefix (all):
"""
for k, v in missing_by_prefix.most_common(30):
    report += f"  {k}: {v}\n"

print(report)
with open("_site_audit.txt", "w") as f:
    f.write(report)
