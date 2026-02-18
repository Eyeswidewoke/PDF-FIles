# The PDF Files

Static research site built from a large public document release, rebuilt into a format people can actually use.

## What this repository contains

- A ready-to-host static website (GitHub Pages compatible)
- Structured content and indexes under `content/` and `data/`
- Curated investigation pages and findings with source traceability
- `MANIFEST.json` for file-level inventory of the release bundle

Current bundle size is approximately **103,000 files / 811 MB** (after `.gitignore` exclusions).

> **Note on document-scan images:** The `content/docs/document-scans/` directory contains ~61,000 PNG page images (~5.7 GB). These are excluded from the default repo by `.gitignore` to stay within GitHub's size limits. The site's file viewer will show "Image not reachable" for these pages unless the scan images are served separately (e.g., via CDN or Git LFS). All other site functionality — search, navigation, cast pages, investigations, timelines — works without them.

## Why this exists

The raw release looked massive, but a significant share was hard to use in practice:

- blank or near-blank pages
- repeated pages and wrapper documents
- scan images with no embedded text
- inconsistent structure with no usable master index

This project focuses on separating signal from noise, then organizing the useful content into a searchable, browsable site.

## Plain-language process used

1. Collected the full release packages and mapped dataset structure.
2. Broke large, inconsistent dumps into consistent page-level/source-level records.
3. Extracted embedded text where available.
4. Ran OCR on image-only pages so text could be searched.
5. Isolated blanks, duplicates, and obvious junk.
6. Categorized remaining documents (legal, depositions, emails, financial, travel, etc.).
7. Split long findings into focused per-finding pages.
8. Built indexes/JSON maps so the site can search and filter quickly.
9. Ran privacy sweeps to remove local-machine path leakage from published content.
10. Packaged as a static site for anonymous public handoff.

## Source links

- Release overview in-site: `release-guide.html`
- Dataset links (DOJ + mirrors) are listed in `data/public-data.json` (DataSet1-DataSet12 entries).

## Dataset ZIP + torrent sources

The site now exposes these directly on `release-guide.html` and each `ds*.html` page.

- `DS1-DS7`: DOJ ZIP + Archive ZIP + Archive torrent (shared mirror item: `data-set-1`)
- `DS8`: DOJ ZIP + Archive ZIP + Archive torrent (`data-set-8_202601`)
- `DS9`: DOJ ZIP (no vetted mirror/torrent link included in this build)
- `DS10`: DOJ ZIP + Archive ZIP + Archive torrent (`data-set-10`)
- `DS11`: DOJ ZIP (no vetted mirror/torrent link included in this build)
- `DS12`: DOJ ZIP + Archive ZIP + Archive torrent (`data-set-12_202601`)

If links change over time, update `data/public-data.json` and the site will reflect it automatically.

## Local preview

From this folder:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Push this folder as the repo root.
3. In GitHub: `Settings -> Pages`.
4. Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
5. Keep `.nojekyll` in root (already included).

## Self-contained release notes

- This folder is intended to be pushed as the repo root directly.
- All in-site source paths referenced by `data/public-data.json` resolve within this folder.
- `MANIFEST.json` is included as the snapshot inventory for this release.

## Maintenance status

This repository is being prepared as a public handoff. Long-term maintenance is expected to be community-led after release.

## License

Public domain dedication via `LICENSE` (The Unlicense).
