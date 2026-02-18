# Data Sources

Overview of where dataset links and source-package references are maintained.

## In-repo source map

- `data/public-data.json` is the primary source for dataset and mirror links used by the site.
- Release/package overview pages read from this data layer.

## What is included vs excluded

- Included: markdown/text/index artifacts needed for public navigation and search.
- Excluded: selected large binaries and heavy intermediates (see `.gitignore`).

## Updating data sources safely

1. Edit `data/public-data.json`.
2. Verify affected pages render correctly (`release-guide.html`, dataset pages, search references).
3. Validate no private/local paths were introduced.
4. Redeploy and smoke test public URLs.

## Integrity and provenance

- Prefer immutable tag-based references for major public releases.
- Record checksum and source metadata in release notes when practical.
- Keep method deltas documented in `CHANGELOG.md` and `METHODS.md`.
