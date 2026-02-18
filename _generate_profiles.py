"""Generate cast profile markdown files from cast-network.json.

This script keeps links deterministic and rooted to repository paths so they
resolve in the site viewer regardless of profile subfolder depth.
"""

from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parent
NETWORK = ROOT / "content" / "cast" / "cast-network.json"
PROFILES_DIR = ROOT / "content" / "cast" / "profiles"
PAGES_DIR = ROOT / "content" / "cast" / "pages"


def encode_repo_path(path: str) -> str:
    """URL-encode each segment but preserve forward slashes."""
    clean = path.replace("\\", "/").strip().lstrip("./")
    return "/".join(quote(seg) for seg in clean.split("/"))


def build_page_map(members: list[dict]) -> dict[str, str]:
    page_names = [p.name for p in PAGES_DIR.glob("*.md") if p.name.lower() != "cast-hub.md"]
    page_map: dict[str, str] = {}

    for m in members:
        slug = str(m.get("slug") or "").strip()
        if not slug:
            continue

        slug_l = slug.lower()
        candidates = [n for n in page_names if n.lower().endswith(f"-{slug_l}.md")]
        if not candidates:
            page_map[slug] = ""
            continue

        # Prefer the non-Epstein-network cast page when multiple pages share a slug.
        non_network = sorted([c for c in candidates if not c.startswith("08-epstein-network-")])
        pick = non_network[0] if non_network else sorted(candidates)[0]
        page_map[slug] = f"content/cast/pages/{pick}"

    return page_map


def main() -> None:
    data = json.loads(NETWORK.read_text(encoding="utf-8"))
    categories = data.get("categories", {})
    members = data.get("members", [])
    page_map = build_page_map(members)

    created = 0

    for m in members:
        file_rel = str(m.get("file") or "").strip()
        if not file_rel:
            continue

        file_rel_posix = file_rel.replace("\\", "/")
        dest = PROFILES_DIR / file_rel_posix

        name = m.get("name", "Unknown")
        cat_key = m.get("category", "")
        cat_info = categories.get(cat_key, {})
        cat_label = cat_info.get("label", cat_key)
        cat_icon = cat_info.get("icon", "")
        slug = str(m.get("slug") or "").strip()
        summary = str(m.get("summary") or "").strip().lstrip("\ufeff")
        connections = m.get("connections", {}) or {}
        connection_count = int(m.get("connection_count") or 0)
        topic_mentions = m.get("topic_mentions", []) or []

        lines: list[str] = []
        lines.append(f"# {name}")
        lines.append("")
        lines.append(f"**Category:** {cat_icon} {cat_label}")
        lines.append("")

        if summary and summary != f"# {str(name).upper()}":
            lines.append(summary)
            lines.append("")

        if connections:
            lines.append("## Connections")
            lines.append("")
            for conn_type, conn_list in connections.items():
                if not conn_list:
                    continue
                label = str(conn_type).replace("_", " ").title()
                lines.append(f"### {label}")
                lines.append("")
                for c in conn_list:
                    c_name = c.get("name", "?")
                    c_slug = str(c.get("slug") or "")
                    c_mentions = int(c.get("mentions") or 0)

                    if c_slug == slug:
                        lines.append(f"- **{c_name}** - {c_mentions} mention(s)")
                        continue

                    c_page = page_map.get(c_slug, "")
                    if c_page:
                        lines.append(
                            f"- [{c_name}]({encode_repo_path(c_page)}) - {c_mentions} mention(s)"
                        )
                    else:
                        lines.append(f"- **{c_name}** - {c_mentions} mention(s)")
                lines.append("")

            lines.append(f"**Total connection count:** {connection_count}")
            lines.append("")

        if topic_mentions:
            lines.append("## Topic Mentions")
            lines.append("")
            for t in topic_mentions:
                raw_topic = str(t.get("file") or "").replace("\\", "/").strip()
                topic_label = t.get("label") or raw_topic or "topic"
                if not raw_topic:
                    lines.append(f"- {topic_label}")
                    continue
                topic_rel = raw_topic if raw_topic.startswith("content/") else f"content/{raw_topic}"
                lines.append(f"- [{topic_label}]({encode_repo_path(topic_rel)})")
            lines.append("")

        if slug:
            this_page = page_map.get(slug, "")
            if this_page:
                lines.append("## Deep Dive")
                lines.append("")
                lines.append(f"- [Cast page]({encode_repo_path(this_page)})")
                lines.append("")

        lines.append("---")
        lines.append("")
        lines.append("*Profile auto-generated from cast-network.json.*")
        lines.append("")

        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text("\n".join(lines), encoding="utf-8")
        created += 1

    print(f"Created {created} profile files in {PROFILES_DIR}")


if __name__ == "__main__":
    main()
