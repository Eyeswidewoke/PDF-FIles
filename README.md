# The PDF Files

Public, source-linked research archive built from a large document release and packaged as a static site.

## Quick links

- Live site: `https://eyeswidewoke.github.io/PDF-FIles/`
- Main index: `index.html`
- Search: `search.html`
- Release guide: `release-guide.html`

## Project goals

- Make a very large document release searchable and navigable
- Keep source traceability intact (`claim -> document`)
- Separate high-signal material from blank/wrapper noise
- Keep the stack static and easy to mirror

## What is in this repo

- Static site pages (`*.html`, `*.js`, `styles.css`)
- Structured content under `content/`
- Data/index inputs under `data/`
- Sanitized Pages deploy workflow at `.github/workflows/pages.yml`

Approximate working set: **~103,000 files / ~811 MB** after exclusion rules.

## Known limitations

- Many heavy scan-image binaries are intentionally excluded from git for size control.
- Some viewer links may show "not included in this public bundle" if a source artifact is not shipped.
- OCR quality depends on original scan quality.
- Name presence in source documents is not, by itself, a legal conclusion.

## Processing summary

1. Ingest release packages and map dataset structure.
2. Normalize inconsistent source formats into stable records.
3. Extract embedded text and run OCR where needed.
4. Identify blanks, wrappers, and duplicates.
5. Build topic/entity pages and cross-links.
6. Export static indexes used by the site UI.
7. Apply privacy hardening before publication.

## Local preview

From repo root:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy on GitHub Pages

This repository deploys via GitHub Actions:

1. Push to `main`
2. In GitHub, set `Settings -> Pages -> Source` to `GitHub Actions`
3. Let `.github/workflows/pages.yml` build and deploy

The workflow publishes a sanitized artifact and excludes internal repo metadata files from the public Pages output.

## Updating source links

- Dataset/mirror link definitions are in `data/public-data.json`.
- Update that file and redeploy to refresh links across pages.

## License

Released under **The Unlicense** (`LICENSE`).
