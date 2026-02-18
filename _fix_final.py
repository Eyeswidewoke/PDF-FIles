"""Fix ALL remaining broken links in existing content files."""
import os, re, pathlib

ROOT = pathlib.Path(r"o:\FILES\PDF-Files")
CONTENT = ROOT / "content"
PAGES_DIR = ROOT / "content/cast/pages"

link_re = re.compile(r'\[([^\]]*)\]\((\./[^)]+\.md|\.\.\/[^)]+\.md)\)')

total_fixes = 0
files_fixed = 0

for md_file in CONTENT.rglob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="replace")
    new_text = text
    changed = False
    
    for match in link_re.finditer(text):
        rel = match.group(2).replace("%20", " ")
        
        # Resolve path
        if rel.startswith("./"):
            target = md_file.parent / rel[2:]  # relative to file, not root
            target_from_root = ROOT / rel[2:]
        else:
            target = (md_file.parent / rel).resolve()
            target_from_root = None
        
        # Check if it resolves from the file's location
        if target.resolve().exists():
            continue
        # Also check from root
        if target_from_root and target_from_root.exists():
            continue
            
        old_link = match.group(0)
        label = match.group(1)
        fname_only = pathlib.Path(rel).name
        
        # --- FIX: content/topics/cast/X -> content/topics/X ---
        m1 = re.search(r'content/topics/cast/(.+)', rel)
        if m1:
            actual = ROOT / "content/topics" / m1.group(1)
            if actual.exists():
                new_rel = os.path.relpath(actual, md_file.parent).replace("\\", "/")
                new_link = f"[{label}]({new_rel})"
                new_text = new_text.replace(old_link, new_link, 1)
                changed = True
                total_fixes += 1
                continue
        
        # --- FIX: content/cast/topics/X -> content/topics/X ---
        m2 = re.search(r'content/cast/topics/(.+)', rel)
        if m2:
            actual = ROOT / "content/topics" / m2.group(1)
            if actual.exists():
                new_rel = os.path.relpath(actual, md_file.parent).replace("\\", "/")
                new_link = f"[{label}]({new_rel})"
                new_text = new_text.replace(old_link, new_link, 1)
                changed = True
                total_fixes += 1
                continue
        
        # --- FIX: content/cast/cast/X -> content/cast/X ---
        m3 = re.search(r'content/cast/cast/(.+)', rel)
        if m3:
            actual = ROOT / "content/cast" / m3.group(1)
            if actual.exists():
                new_rel = os.path.relpath(actual, md_file.parent).replace("\\", "/")
                new_link = f"[{label}]({new_rel})"
                new_text = new_text.replace(old_link, new_link, 1)
                changed = True
                total_fixes += 1
                continue
            # Maybe it's content/cast/pages/X?
            actual2 = ROOT / "content/cast/pages" / m3.group(1)
            if actual2.exists():
                new_rel = os.path.relpath(actual2, md_file.parent).replace("\\", "/")
                new_link = f"[{label}]({new_rel})"
                new_text = new_text.replace(old_link, new_link, 1)
                changed = True
                total_fixes += 1
                continue
        
        # --- FIX: bare cast page names like ./01-family-fred-trump.md ---
        # from within cast/pages/ directory these are fine, but from elsewhere...
        if re.match(r'\d{2}-[a-z]', fname_only):
            cast_page = PAGES_DIR / fname_only
            if cast_page.exists():
                new_rel = os.path.relpath(cast_page, md_file.parent).replace("\\", "/")
                new_link = f"[{label}]({new_rel})"
                new_text = new_text.replace(old_link, new_link, 1)
                changed = True
                total_fixes += 1
                continue
        
        # --- FIX: 08-epstein-network-*.md from wrong directory ---
        if fname_only.startswith("08-epstein-network-"):
            cast_page = PAGES_DIR / fname_only
            if cast_page.exists():
                new_rel = os.path.relpath(cast_page, md_file.parent).replace("\\", "/")
                new_link = f"[{label}]({new_rel})"
                new_text = new_text.replace(old_link, new_link, 1)
                changed = True
                total_fixes += 1
                continue
        
        # --- FIX: KEY-FINDINGS.md ---
        if fname_only == "KEY-FINDINGS.md":
            kf = ROOT / "KEY-FINDINGS.md"
            if kf.exists():
                new_rel = os.path.relpath(kf, md_file.parent).replace("\\", "/")
                new_link = f"[{label}]({new_rel})"
                new_text = new_text.replace(old_link, new_link, 1)
                changed = True
                total_fixes += 1
                continue
        
        # --- FIX: CAST-HUB.md ---
        if fname_only == "CAST-HUB.md":
            ch = PAGES_DIR / "CAST-HUB.md"
            if ch.exists():
                new_rel = os.path.relpath(ch, md_file.parent).replace("\\", "/")
                new_link = f"[{label}]({new_rel})"
                new_text = new_text.replace(old_link, new_link, 1)
                changed = True
                total_fixes += 1
                continue
    
    if changed and new_text != text:
        md_file.write_text(new_text, encoding="utf-8")
        files_fixed += 1

print(f"Fixed {total_fixes} broken links across {files_fixed} files")
