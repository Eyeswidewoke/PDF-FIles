"""Fix the last 362 broken links: bare cast page refs need full path prefix."""
import os, re, pathlib

ROOT = pathlib.Path(r"o:\FILES\PDF-Files")
PAGES_DIR = ROOT / "content/cast/pages"

link_re = re.compile(r'\[([^\]]*)\]\(\./([^/)]+\.md)\)')

total_fixes = 0
files_fixed = 0

# These bare links are in the generated cast pages and profiles
for md_file in ROOT.rglob("*.md"):
    if md_file.name.startswith("_"):
        continue
    text = md_file.read_text(encoding="utf-8", errors="replace")
    new_text = text
    changed = False
    
    for match in link_re.finditer(text):
        bare_name = match.group(2).replace("%20", " ")
        # Check if ./bare_name resolves from root
        if (ROOT / bare_name).exists():
            continue  # Already works
        
        # Check if it's a cast page
        if (PAGES_DIR / bare_name).exists():
            old_link = match.group(0)
            new_link = f"[{match.group(1)}](./content/cast/pages/{match.group(2)})"
            new_text = new_text.replace(old_link, new_link, 1)
            changed = True
            total_fixes += 1
            continue
        
        # Check KEY-FINDINGS.md at root
        if bare_name == "KEY-FINDINGS.md" and (ROOT / "KEY-FINDINGS.md").exists():
            old_link = match.group(0)
            new_link = f"[{match.group(1)}](./KEY-FINDINGS.md)"
            # Already correct format, skip
            continue
    
    if changed and new_text != text:
        md_file.write_text(new_text, encoding="utf-8")
        files_fixed += 1

print(f"Fixed {total_fixes} bare cast page links across {files_fixed} files")
