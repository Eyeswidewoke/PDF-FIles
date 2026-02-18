"""
MEGA FIX: Create all missing content files so every internal link resolves.
"""
import json, os, pathlib, re, collections

ROOT = pathlib.Path(r"o:\FILES\PDF-Files")

# ================================================================
# Load cast-network.json for member data
# ================================================================
with open(ROOT / "content/cast/cast-network.json", "r", encoding="utf-8") as f:
    network = json.load(f)

categories = network.get("categories", {})
members = network.get("members", [])
member_by_slug = {}
for m in members:
    member_by_slug[m["slug"]] = m

# ================================================================
# 1. CREATE MISSING CAST-FLAGGED EMAIL STUBS
# ================================================================
print("=== Phase 1: Missing cast-flagged email stubs ===")

cast_flagged_dir = ROOT / "content/emails/cast-flagged"
# Find all referenced cast-flagged IDs from people-bucket files
link_re = re.compile(r'\[([^\]]*)\]\(\./content/emails/cast-flagged/([^)]+\.md)\)')
referenced = set()
for md_file in (ROOT / "content/emails/people-buckets").rglob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="replace")
    for match in link_re.finditer(text):
        fname = match.group(2).replace("%20", " ")
        referenced.add(fname)

existing = set(f.name for f in cast_flagged_dir.glob("*.md"))
missing_flagged = referenced - existing
print(f"  Referenced: {len(referenced)}, Existing: {len(existing)}, Missing: {len(missing_flagged)}")

created_flagged = 0
for fname in sorted(missing_flagged):
    doc_id = fname.replace(".md", "")
    stub = f"""# {doc_id}

**Status:** Referenced in cast email index but source artifact not available in this public bundle.

This document ID was flagged during automated email scanning as potentially relevant to one or more cast members. The full text was not included in the released datasets or could not be matched to a source file.

---
*Auto-generated stub — original document not available.*
"""
    (cast_flagged_dir / fname).write_text(stub, encoding="utf-8")
    created_flagged += 1

print(f"  Created {created_flagged} email stubs")

# ================================================================
# 2. CREATE MISSING CAST PAGES (01-family-barron-trump.md style)
# ================================================================
print("\n=== Phase 2: Missing cast pages ===")

cast_pages_dir = ROOT / "content/cast/pages"
existing_pages = set(f.name for f in cast_pages_dir.glob("*.md"))

# The missing pages follow pattern: {cat_num}-{cat_name}-{slug}.md
# Build the expected page names from members
created_pages = 0
for m in members:
    slug = m.get("slug", "")
    cat = m.get("category", "")
    name = m.get("name", "")
    if not slug or not cat:
        continue
    
    # Build expected filename: e.g. "01-family-barron-trump.md"
    cat_parts = cat.split("_", 1)
    cat_num = cat_parts[0].lower()
    cat_label = cat_parts[1].lower().replace("_", "-") if len(cat_parts) > 1 else ""
    page_name = f"{cat_num}-{cat_label}-{slug}.md"
    
    if page_name in existing_pages:
        continue
    
    # Also check 08-epstein-network-{slug}.md
    epstein_page = f"08-epstein-network-{slug}.md"
    
    cat_info = categories.get(cat, {})
    cat_label_nice = cat_info.get("label", cat)
    cat_icon = cat_info.get("icon", "")
    summary = m.get("summary", "").lstrip("\ufeff").strip()
    connections = m.get("connections", {})
    conn_count = m.get("connection_count", 0)
    topic_mentions = m.get("topic_mentions", [])
    
    lines = []
    lines.append(f"# {name}")
    lines.append("")
    lines.append(f"**Category:** {cat_icon} {cat_label_nice}")
    lines.append("")
    
    if summary and not summary.startswith(f"# {name.upper()}"):
        lines.append(summary)
        lines.append("")
    
    # Connection summary
    if connections:
        lines.append("## Connections in the Epstein Files")
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
                    lines.append(f"- [{c_name}](./08-epstein-network-{c_slug}.md) — {c_mentions} mention(s)")
            lines.append("")
        lines.append(f"**Total connections:** {conn_count}")
        lines.append("")
    
    # Topic mentions
    if topic_mentions:
        lines.append("## Topic Appearances")
        lines.append("")
        for t in topic_mentions:
            t_label = t.get("label", "")
            t_file = t.get("file", "").replace("\\", "/")
            lines.append(f"- [{t_label}](../../{t_file})")
        lines.append("")
    
    # Cross-links
    lines.append("## Related")
    lines.append("")
    profile_file = m.get("file", "").replace("\\", "/")
    if profile_file:
        lines.append(f"- [Cast Profile](../profiles/{profile_file})")
    lines.append(f"- [Back to Cast Hub](./CAST-HUB.md)")
    lines.append("")
    lines.append("---")
    lines.append(f"*Generated from the Epstein Files cast network dataset.*")
    lines.append("")
    
    (cast_pages_dir / page_name).write_text("\n".join(lines), encoding="utf-8")
    created_pages += 1

# Also create the trump-family-tree page
tree_page = cast_pages_dir / "01-family-trump-family-tree.md"
if not tree_page.exists():
    family_members = [m for m in members if m.get("category") == "01_Family"]
    lines = ["# Trump Family Tree", "", "Members tracked in the Epstein Files cast network:", ""]
    for fm in family_members:
        lines.append(f"- [{fm['name']}](./01-family-{fm['slug']}.md)")
    lines.append("")
    lines.append("---")
    lines.append("*Generated from cast network data.*")
    tree_page.write_text("\n".join(lines), encoding="utf-8")
    created_pages += 1

# master donald trump page
master_page = cast_pages_dir / "00-master-donald-trump.md"
if not master_page.exists():
    dt = member_by_slug.get("donald-trump", None)
    if not dt:
        # Find any trump entry
        for m in members:
            if "donald trump" in m.get("name", "").lower() and "jr" not in m.get("name", "").lower():
                dt = m
                break
    lines = ["# Donald Trump — Master Profile", ""]
    lines.append("Central figure in the Epstein Files cast network analysis.")
    lines.append("")
    lines.append("## See Also")
    lines.append("- [Deep investigation page](./08-epstein-network-donald-trump.md)")
    lines.append("- [Cast Hub](./CAST-HUB.md)")
    lines.append("")
    master_page.write_text("\n".join(lines), encoding="utf-8")
    created_pages += 1

print(f"  Created {created_pages} cast pages")

# ================================================================
# 3. CREATE MISSING PROFILE STUBS
# ================================================================
print("\n=== Phase 3: Missing profile stubs ===")

profiles_dir = ROOT / "content/cast/profiles"
missing_profiles = [
    ("00_Master/Donald Trump.md", "Donald Trump", "Master profile"),
    ("01_Family/_TRUMP-FAMILY-TREE.md", "Trump Family Tree", "Family tree overview"),
    ("11_Historical_References/Adolf Hitler.md", "Adolf Hitler", "Historical reference"),
    ("Elon Musk.md", "Elon Musk", "Business & Finance"),
]

created_profiles = 0
for rel, name, desc in missing_profiles:
    dest = profiles_dir / rel
    if dest.exists():
        continue
    dest.parent.mkdir(parents=True, exist_ok=True)
    stub = f"# {name}\n\n**{desc}**\n\nSee the [Cast Hub](../pages/CAST-HUB.md) for full network context.\n\n---\n*Auto-generated stub.*\n"
    dest.write_text(stub, encoding="utf-8")
    created_profiles += 1

print(f"  Created {created_profiles} profile stubs")

# ================================================================
# 4. CREATE MISSING FINDINGS STUBS
# ================================================================
print("\n=== Phase 4: Missing findings pages ===")

findings_dir = ROOT / "findings"
findings_dir.mkdir(exist_ok=True)

# Read the findings referenced
findings_refs = set()
all_link_re = re.compile(r'\[([^\]]*)\]\(\./findings/([^)]+\.md)\)')
for md_file in CONTENT.rglob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="replace")
    for match in all_link_re.finditer(text):
        findings_refs.add(match.group(2).replace("%20", " "))

# Also check root-level references
root_link_re = re.compile(r'\[([^\]]*)\]\(\./?(findings/[^)]+\.md)\)')
for md_file in ROOT.glob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="replace")
    for match in root_link_re.finditer(text):
        findings_refs.add(match.group(2).replace("findings/", "").replace("%20", " "))

# Check if KEY-FINDINGS.md has the actual finding content
key_findings = ROOT / "KEY-FINDINGS.md"
key_findings_text = ""
if key_findings.exists():
    key_findings_text = key_findings.read_text(encoding="utf-8", errors="replace")

# Finding name to title mapping
finding_titles = {
    "F-001-fbi-internal-email-brunel-mc2-sex-trafficking-front.md": "FBI Internal Email: Brunel / MC2 Sex Trafficking Front",
    "F-002-geoffrey-berman-sdny-private-and-confidential.md": "Geoffrey Berman SDNY — Private and Confidential",
    "F-003-ghislaine-maxwell-draft-pr-statements.md": "Ghislaine Maxwell Draft PR Statements",
    "F-004-epsteinsitrick-crisis-pr-coordination.md": "Epstein / Sitrick Crisis PR Coordination",
    "F-005-epstein-as-team-leader-legal-strategy-email.md": "Epstein as 'Team Leader' — Legal Strategy Email",
    "F-006-epstein-michael-wolff-nfw.md": "Epstein / Michael Wolff — NFW",
    "F-007-boris-nikolic-gates-science-advisor-texts.md": "Boris Nikolic / Gates Science Advisor Texts",
    "F-008-trump-s-going-to-win-in-november.md": "\"Trump's Going to Win in November\"",
    "F-009-jane-doe-v-trump-told-you.md": "Jane Doe v. Trump — \"Told You\"",
    "F-010-daily-mail-ghislaine-has-females-for-mr-se.md": "Daily Mail: \"Ghislaine Has Females for Mr. SE\"",
    "F-011-key-email-addresses-discovered.md": "Key Email Addresses Discovered",
    "F-012-air-ghislaine-helicopter.md": "Air Ghislaine — Helicopter",
    "F-013-epsteinbrunel-text-exchange.md": "Epstein / Brunel Text Exchange",
    "F-014-shanson900-30-min-for-the-girls.md": "shanson900 — \"30 Min for the Girls\"",
    "F-015-contact-network-highlights.md": "Contact Network Highlights",
}

created_findings = 0
for fname in sorted(findings_refs):
    dest = findings_dir / fname
    if dest.exists():
        continue
    fid = fname.split("-")[0] + "-" + fname.split("-")[1] if "-" in fname else fname
    title = finding_titles.get(fname, fname.replace(".md", "").replace("-", " ").title())
    
    # Try to extract matching section from KEY-FINDINGS.md
    excerpt = ""
    search_id = fname.replace(".md", "").upper()
    # Try finding by F-XXX pattern
    f_code = fname.split("-")[0] + "-" + fname.split("-")[1] if len(fname.split("-")) >= 2 else ""
    if f_code and key_findings_text:
        pattern = re.compile(re.escape(f_code) + r".*?\n(.*?)(?=\n## |\n# |\Z)", re.DOTALL | re.IGNORECASE)
        match = pattern.search(key_findings_text)
        if match:
            excerpt = match.group(0).strip()
    
    content = f"# {title}\n\n"
    if excerpt:
        content += excerpt + "\n\n"
    else:
        content += f"This finding was identified during analysis of the Epstein Files document release.\n\n"
        content += f"For the full findings summary, see [KEY-FINDINGS.md](../KEY-FINDINGS.md).\n\n"
    content += "---\n*Source: Epstein Files analysis.*\n"
    
    dest.write_text(content, encoding="utf-8")
    created_findings += 1

print(f"  Created {created_findings} finding pages")

# ================================================================
# 5. CREATE MISSING PEOPLE-BUCKET STUBS  
# ================================================================
print("\n=== Phase 5: Missing people-bucket stubs ===")

pb_dir = ROOT / "content/emails/people-buckets"
hitler_stub = pb_dir / "historical-references" / "adolf-hitler.md"
if not hitler_stub.exists():
    hitler_stub.parent.mkdir(parents=True, exist_ok=True)
    hitler_stub.write_text("# Adolf Hitler\n\n**Category:** Historical Reference\n\nReferenced in source documents as a historical parallel.\n\n---\n*Auto-generated stub.*\n", encoding="utf-8")
    print("  Created adolf-hitler people-bucket stub")

# ================================================================
# 6. CREATE MISSING INVESTIGATION PAGES
# ================================================================
print("\n=== Phase 6: Missing investigation stubs ===")

investigation_stubs = {
    "INVESTIGATION-E-DATA-INTEGRITY-RABBIT-HOLES.md": "Investigation E: Data Integrity & Rabbit Holes",
    "INVESTIGATION-F-EPSTEIN-DEATH-IN-CUSTODY.md": "Investigation F: Epstein Death in Custody",
    "INVESTIGATION-G-FRESH-EYES-WHOLE-CASE-LEAD-MAP.md": "Investigation G: Fresh Eyes — Whole Case Lead Map",
    "INVESTIGATION-H-DEATH-IN-CUSTODY-TIMELINE.md": "Investigation H: Death in Custody Timeline",
}

created_inv = 0
for fname, title in investigation_stubs.items():
    dest = ROOT / fname
    if dest.exists():
        continue
    content = f"# {title}\n\n*This investigation page is under development.*\n\nFor completed investigations, see:\n\n"
    for inv_file in sorted(ROOT.glob("INVESTIGATION-*.md")):
        if inv_file.name != fname:
            content += f"- [{inv_file.stem}](./{inv_file.name})\n"
    content += f"\n---\n"
    dest.write_text(content, encoding="utf-8")
    created_inv += 1

print(f"  Created {created_inv} investigation stubs")

# ================================================================
# 7. CREATE claim-ledger.md STUB
# ================================================================
claim_ledger = ROOT / "claim-ledger.md"
if not claim_ledger.exists():
    claim_ledger.write_text("# Claim Ledger\n\nThis page tracks specific claims made across the investigation pages, linked back to their source documents.\n\n*Under development.*\n\n---\n", encoding="utf-8")
    print("\n  Created claim-ledger.md")

print("\n=== DONE ===")
