"""Fix remaining broken links: relative path issues in profile files and topic references."""
import os, re, pathlib

ROOT = pathlib.Path(r"o:\FILES\PDF-Files")
CONTENT = ROOT / "content"

link_re = re.compile(r'\[([^\]]*)\]\((\./[^)]+\.md|\.\.\/[^)]+\.md)\)')

fixed_files = 0
total_fixes = 0

# Fix 1: content/topics/cast and content/cast/topics refs
# These are malformed paths. Let's find what they actually look like
topics_cast_re = re.compile(r'\]\(\./content/topics/cast/([^)]+)\)')
cast_topics_re = re.compile(r'\]\(\./content/cast/topics/([^)]+)\)')
cast_cast_re = re.compile(r'\]\(\./content/cast/cast/([^)]+)\)')

# Fix 2: Profile files have relative links like ./08-epstein-network-slug.md 
# but they're in content/cast/profiles/XX_Category/ so the path doesn't resolve
# These should be ../../pages/08-epstein-network-slug.md or similar

# Fix 3: CAST-HUB.md relative references from newly created pages

# Scan all files and fix relative paths
for md_file in CONTENT.rglob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="replace")
    new_text = text
    file_fixes = 0
    
    # Fix broken relative links in cast pages that point to other cast pages
    # e.g. from content/cast/pages/01-family-barron-trump.md linking to ./08-epstein-network-melania-trump.md
    # These are fine because they're in the same directory
    
    # Fix links from profiles to cast pages
    # Profile files are in content/cast/profiles/XX_Category/Name.md
    # They link to ../../cast/pages/08-epstein-network-slug.md
    # But should link to ../pages/08-epstein-network-slug.md (going up from XX_Category/ into profiles/ then into pages/)
    # Actually ../../cast/pages/ from profiles/XX_Category/ goes up to content/ then cast/pages/ — that's correct
    # Let me check what actually doesn't resolve
    
    for match in link_re.finditer(text):
        rel = match.group(2).replace("%20", " ")
        if rel.startswith("./"):
            target = ROOT / rel[2:]
        else:
            target = md_file.parent / rel
        target = target.resolve()
        if target.exists():
            continue
        
        # Try to find the correct path
        fname_only = pathlib.Path(rel).name
        
        # Is it a cast page reference?
        if fname_only.startswith("08-epstein-network-"):
            correct_path = ROOT / "content/cast/pages" / fname_only
            if correct_path.exists():
                # Calculate correct relative path from this file
                try:
                    new_rel = os.path.relpath(correct_path, md_file.parent).replace("\\", "/")
                    old_link = match.group(0)
                    new_link = old_link.replace(match.group(2), "./" + new_rel if not new_rel.startswith("..") else new_rel)
                    new_text = new_text.replace(old_link, new_link, 1)
                    file_fixes += 1
                except ValueError:
                    pass
            continue
        
        # Is it a category cast page (01-family-*, etc)?
        if re.match(r'\d{2}-[a-z]', fname_only):
            correct_path = ROOT / "content/cast/pages" / fname_only
            if correct_path.exists():
                try:
                    new_rel = os.path.relpath(correct_path, md_file.parent).replace("\\", "/")
                    old_link = match.group(0)
                    new_link = old_link.replace(match.group(2), "./" + new_rel if not new_rel.startswith("..") else new_rel)
                    new_text = new_text.replace(old_link, new_link, 1)
                    file_fixes += 1
                except ValueError:
                    pass
            continue
        
        # Is it CAST-HUB.md?
        if fname_only == "CAST-HUB.md":
            correct_path = ROOT / "content/cast/pages/CAST-HUB.md"
            if correct_path.exists():
                try:
                    new_rel = os.path.relpath(correct_path, md_file.parent).replace("\\", "/")
                    old_link = match.group(0)
                    new_link = old_link.replace(match.group(2), new_rel)
                    new_text = new_text.replace(old_link, new_link, 1)
                    file_fixes += 1
                except ValueError:
                    pass
            continue

        # Is it KEY-FINDINGS.md?
        if fname_only == "KEY-FINDINGS.md":
            correct_path = ROOT / "KEY-FINDINGS.md"
            if correct_path.exists():
                try:
                    new_rel = os.path.relpath(correct_path, md_file.parent).replace("\\", "/")
                    old_link = match.group(0)
                    new_link = old_link.replace(match.group(2), new_rel)
                    new_text = new_text.replace(old_link, new_link, 1)
                    file_fixes += 1
                except ValueError:
                    pass
            continue
    
    if file_fixes > 0 and new_text != text:
        md_file.write_text(new_text, encoding="utf-8")
        fixed_files += 1
        total_fixes += file_fixes

print(f"Fixed {total_fixes} links across {fixed_files} files")

# ================================================================
# Now handle the topic path issues
# content/topics/cast/* and content/cast/topics/* don't exist
# These are probably meant to be content/topics/* paths
# ================================================================
print("\nFixing topic path references...")

topic_fixes = 0
topic_files_fixed = 0

for md_file in CONTENT.rglob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="replace")
    new_text = text
    changed = False
    
    # Fix ./content/topics/cast/X -> check if ./content/topics/X exists
    for match in re.finditer(r'\[([^\]]*)\]\(\./content/topics/cast/([^)]+)\)', text):
        topic_file = match.group(2).replace("%20", " ")
        # Try content/topics/{topic_file}
        for try_path in [
            ROOT / "content/topics" / topic_file,
            ROOT / "content/cast/pages" / topic_file,
        ]:
            if try_path.exists():
                old = match.group(0)
                new_rel = os.path.relpath(try_path, ROOT).replace("\\", "/")
                new = f"[{match.group(1)}](./{new_rel})"
                new_text = new_text.replace(old, new, 1)
                changed = True
                topic_fixes += 1
                break
    
    # Fix ./content/cast/topics/X -> same
    for match in re.finditer(r'\[([^\]]*)\]\(\./content/cast/topics/([^)]+)\)', text):
        topic_file = match.group(2).replace("%20", " ")
        for try_path in [
            ROOT / "content/topics" / topic_file,
            ROOT / "content/cast/pages" / topic_file,
        ]:
            if try_path.exists():
                old = match.group(0)
                new_rel = os.path.relpath(try_path, ROOT).replace("\\", "/")
                new = f"[{match.group(1)}](./{new_rel})"
                new_text = new_text.replace(old, new, 1)
                changed = True
                topic_fixes += 1
                break

    # Fix ./content/cast/cast/X -> content/cast/X
    for match in re.finditer(r'\[([^\]]*)\]\(\./content/cast/cast/([^)]+)\)', text):
        ref_file = match.group(2).replace("%20", " ")
        for try_path in [
            ROOT / "content/cast" / ref_file,
            ROOT / "content/cast/pages" / ref_file,
        ]:
            if try_path.exists():
                old = match.group(0)
                new_rel = os.path.relpath(try_path, ROOT).replace("\\", "/")
                new = f"[{match.group(1)}](./{new_rel})"
                new_text = new_text.replace(old, new, 1)
                changed = True
                topic_fixes += 1
                break
    
    if changed and new_text != text:
        md_file.write_text(new_text, encoding="utf-8")
        topic_files_fixed += 1

print(f"Fixed {topic_fixes} topic/path links across {topic_files_fixed} files")
