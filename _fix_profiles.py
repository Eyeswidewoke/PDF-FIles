"""Fix profile file links: relative paths from profiles to cast pages and topics."""
import os, re, pathlib, json

ROOT = pathlib.Path(r"o:\FILES\PDF-Files")
PROFILES_DIR = ROOT / "content/cast/profiles"
PAGES_DIR = ROOT / "content/cast/pages"
TOPICS_DIR = ROOT / "content/topics"

# Load network for topic_mentions data
with open(ROOT / "content/cast/cast-network.json", "r", encoding="utf-8") as f:
    network = json.load(f)

categories = network.get("categories", {})
members = network.get("members", [])

# Regenerate ALL profile files with correct relative paths
created = 0
for m in members:
    file_rel = m.get("file", "")
    if not file_rel:
        continue

    file_rel_posix = file_rel.replace("\\", "/")
    dest = PROFILES_DIR / file_rel_posix
    
    name = m.get("name", "Unknown")
    cat_key = m.get("category", "")
    cat_info = categories.get(cat_key, {})
    cat_label = cat_info.get("label", cat_key)
    cat_icon = cat_info.get("icon", "")
    slug = m.get("slug", "")
    summary = m.get("summary", "").strip()
    connections = m.get("connections", {})
    connection_count = m.get("connection_count", 0)
    topic_mentions = m.get("topic_mentions", [])

    lines = []
    lines.append(f"# {name}")
    lines.append("")
    lines.append(f"**Category:** {cat_icon} {cat_label}")
    lines.append("")

    # Summary / quote
    if summary:
        clean = summary.lstrip("\ufeff").strip()
        if clean and clean != f"# {name.upper()}" and not clean.startswith("# "):
            lines.append(clean)
            lines.append("")

    # Connections - use correct relative path from profiles/XX_Category/ to pages/
    if connections:
        lines.append("## Connections")
        lines.append("")
        for conn_type, conn_list in connections.items():
            if not conn_list:
                continue
            label = conn_type.replace("_", " ").title()
            lines.append(f"### {label}")
            lines.append("")
            for c in conn_list:
                c_name = c.get("name", "?")
                c_slug = c.get("slug", "")
                c_mentions = c.get("mentions", 0)
                if c_slug == slug:
                    lines.append(f"- **{c_name}** — {c_mentions} mention(s)")
                else:
                    # Correct relative path: from profiles/XX_Cat/ go ../../pages/
                    # But better: just check if the 08-epstein page exists
                    epstein_page = PAGES_DIR / f"08-epstein-network-{c_slug}.md"
                    cat_page_slug = None
                    # Find their category for a cat-page link
                    for mm in members:
                        if mm.get("slug") == c_slug:
                            mc = mm.get("category", "")
                            mc_parts = mc.split("_", 1)
                            mc_num = mc_parts[0].lower()
                            mc_label = mc_parts[1].lower().replace("_", "-") if len(mc_parts) > 1 else ""
                            cat_page_slug = f"{mc_num}-{mc_label}-{c_slug}.md"
                            break
                    
                    if epstein_page.exists():
                        lines.append(f"- [{c_name}](../../cast/pages/08-epstein-network-{c_slug}.md) — {c_mentions} mention(s)")
                    elif cat_page_slug and (PAGES_DIR / cat_page_slug).exists():
                        lines.append(f"- [{c_name}](../../cast/pages/{cat_page_slug}) — {c_mentions} mention(s)")
                    else:
                        lines.append(f"- {c_name} — {c_mentions} mention(s)")
            lines.append("")

        lines.append(f"**Total connection count:** {connection_count}")
        lines.append("")

    # Topic mentions - use correct paths
    if topic_mentions:
        lines.append("## Topic Mentions")
        lines.append("")
        for t in topic_mentions:
            t_file = t.get("file", "").replace("\\", "/")
            t_label = t.get("label", t_file)
            # topic files are like topics/05-trump-mentions/extract-trump-raw.md
            # from profiles/XX_Cat/ we need ../../topics/...
            # but the actual content path is content/topics/...
            topic_path = ROOT / "content" / t_file
            if topic_path.exists():
                lines.append(f"- [{t_label}](../../{t_file})")
            else:
                # Try just the label without link
                lines.append(f"- {t_label}")
        lines.append("")

    # Deep dive link
    cast_page = PAGES_DIR / f"08-epstein-network-{slug}.md"
    if cast_page.exists():
        lines.append("## Deep Dive")
        lines.append("")
        lines.append(f"- [Full investigation page](../../cast/pages/08-epstein-network-{slug}.md)")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append(f"*Profile generated from the Epstein Files cast network dataset.*")
    lines.append("")

    md_content = "\n".join(lines)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(md_content, encoding="utf-8")
    created += 1

print(f"Regenerated {created} profile files with corrected links")

# Also fix the pages we generated - they use ./08-epstein-network-slug.md 
# which should work since they're in the same directory, but let's verify
# The issue is links from pages to CAST-HUB.md etc.
pages_fixed = 0
for page_file in PAGES_DIR.glob("*.md"):
    text = page_file.read_text(encoding="utf-8", errors="replace")
    new_text = text
    
    # Fix KEY-FINDINGS.md reference
    new_text = new_text.replace("](./KEY-FINDINGS.md)", "](../../../KEY-FINDINGS.md)")
    new_text = new_text.replace("](../KEY-FINDINGS.md)", "](../../../KEY-FINDINGS.md)")
    
    if new_text != text:
        page_file.write_text(new_text, encoding="utf-8")
        pages_fixed += 1

print(f"Fixed KEY-FINDINGS refs in {pages_fixed} page files")
