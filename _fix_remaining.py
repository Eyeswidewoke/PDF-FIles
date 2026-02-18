"""Fix phases 4-7: findings, investigations, claim-ledger, people-bucket stubs."""
import os, re, pathlib

ROOT = pathlib.Path(r"o:\FILES\PDF-Files")
CONTENT = ROOT / "content"

# ================================================================
# 4. CREATE MISSING FINDINGS PAGES
# ================================================================
print("=== Phase 4: Missing findings pages ===")

findings_dir = ROOT / "findings"
findings_dir.mkdir(exist_ok=True)

# Collect all referenced findings filenames
findings_refs = set()
link_re = re.compile(r'findings/([A-Za-z0-9_\-]+\.md)')
for md_file in CONTENT.rglob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="replace")
    for match in link_re.finditer(text):
        findings_refs.add(match.group(1).replace("%20", " "))
for md_file in ROOT.glob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="replace")
    for match in link_re.finditer(text):
        findings_refs.add(match.group(1).replace("%20", " "))

# Read KEY-FINDINGS.md for content extraction
key_findings = ROOT / "KEY-FINDINGS.md"
kf_text = key_findings.read_text(encoding="utf-8", errors="replace") if key_findings.exists() else ""

finding_titles = {
    "F-001-fbi-internal-email-brunel-mc2-sex-trafficking-front.md": "FBI Internal Email: Brunel / MC2 Sex Trafficking Front",
    "F-002-geoffrey-berman-sdny-private-and-confidential.md": "Geoffrey Berman SDNY — Private and Confidential",
    "F-003-ghislaine-maxwell-draft-pr-statements.md": "Ghislaine Maxwell Draft PR Statements",
    "F-004-epsteinsitrick-crisis-pr-coordination.md": "Epstein / Sitrick Crisis PR Coordination",
    "F-005-epstein-as-team-leader-legal-strategy-email.md": "Epstein as 'Team Leader' — Legal Strategy Email",
    "F-006-epstein-michael-wolff-nfw.md": "Epstein / Michael Wolff — NFW",
    "F-007-boris-nikolic-gates-science-advisor-texts.md": "Boris Nikolic / Gates Science Advisor Texts",
    "F-008-trump-s-going-to-win-in-november.md": '"Trump\'s Going to Win in November"',
    "F-009-jane-doe-v-trump-told-you.md": 'Jane Doe v. Trump — "Told You"',
    "F-010-daily-mail-ghislaine-has-females-for-mr-se.md": 'Daily Mail: "Ghislaine Has Females for Mr. SE"',
    "F-011-key-email-addresses-discovered.md": "Key Email Addresses Discovered",
    "F-012-air-ghislaine-helicopter.md": "Air Ghislaine — Helicopter",
    "F-013-epsteinbrunel-text-exchange.md": "Epstein / Brunel Text Exchange",
    "F-014-shanson900-30-min-for-the-girls.md": 'shanson900 — "30 Min for the Girls"',
    "F-015-contact-network-highlights.md": "Contact Network Highlights",
}

created_findings = 0
for fname in sorted(findings_refs):
    dest = findings_dir / fname
    if dest.exists():
        continue
    title = finding_titles.get(fname, fname.replace(".md", "").replace("-", " ").title())
    
    # Try extracting from KEY-FINDINGS.md
    f_code = ""
    parts = fname.replace(".md", "").split("-")
    if len(parts) >= 2:
        f_code = parts[0] + "-" + parts[1]
    
    excerpt = ""
    if f_code and kf_text:
        # Look for section with this finding code
        idx = kf_text.lower().find(f_code.lower())
        if idx >= 0:
            # Grab surrounding context (up to 500 chars)
            start = max(0, kf_text.rfind("\n##", 0, idx))
            end = kf_text.find("\n## ", idx + 10)
            if end < 0:
                end = min(len(kf_text), idx + 800)
            excerpt = kf_text[start:end].strip()
    
    content_lines = [f"# {title}", ""]
    if excerpt:
        content_lines.append(excerpt)
    else:
        content_lines.append(f"This finding was identified during analysis of the Epstein Files document release.")
        content_lines.append("")
        content_lines.append(f"For the full findings summary, see [KEY-FINDINGS.md](../KEY-FINDINGS.md).")
    content_lines.extend(["", "---", "*Source: Epstein Files analysis.*", ""])
    
    dest.write_text("\n".join(content_lines), encoding="utf-8")
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
else:
    print("  adolf-hitler stub already exists")

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
    existing_invs = sorted(ROOT.glob("INVESTIGATION-*.md"))
    content_lines = [f"# {title}", "", "*This investigation page is under development.*", "", "For completed investigations, see:", ""]
    for inv_file in existing_invs:
        if inv_file.name != fname:
            content_lines.append(f"- [{inv_file.stem}](./{inv_file.name})")
    content_lines.extend(["", "---", ""])
    dest.write_text("\n".join(content_lines), encoding="utf-8")
    created_inv += 1

print(f"  Created {created_inv} investigation stubs")

# ================================================================
# 7. CREATE claim-ledger.md
# ================================================================
print("\n=== Phase 7: claim-ledger ===")
claim_ledger = ROOT / "claim-ledger.md"
if not claim_ledger.exists():
    claim_ledger.write_text("# Claim Ledger\n\nThis page tracks specific claims made across the investigation pages, linked back to their source documents.\n\n*Under development.*\n\n---\n", encoding="utf-8")
    print("  Created claim-ledger.md")
else:
    print("  Already exists")

print("\n=== ALL PHASES COMPLETE ===")
