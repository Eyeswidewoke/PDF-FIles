# The PDF Files

Static, source-linked research archive built from publicly released materials.

License: **Unlicense** (public-domain dedication). Fork, mirror, and reuse freely.

## Start here

- Mission: make a large, noisy document release searchable, traceable, and reviewable.
- Live site: `https://eyeswidewoke.github.io/PDF-FIles/`
- Repository: `https://github.com/Eyeswidewoke/PDF-FIles`
- ZIP snapshot (main): `https://github.com/Eyeswidewoke/PDF-FIles/archive/refs/heads/main.zip`

## Table of contents

- [What this project is](#what-this-project-is)
- [What this project is not](#what-this-project-is-not)
- [Repository layout](#repository-layout)
- [Methods and reproducibility](#methods-and-reproducibility)
- [Mirroring and sharing](#mirroring-and-sharing)
- [Contributing](#contributing)
- [Security](#security)
- [Legal and ethics](#legal-and-ethics)
- [Local preview](#local-preview)
- [GitHub Pages deployment](#github-pages-deployment)
- [Maintenance and releases](#maintenance-and-releases)

## What this project is

- A static site (`*.html`, `*.js`, `styles.css`) with searchable and linked research pages.
- A structured content tree under `content/` and `data/`.
- A fork-friendly publishing setup with sanitized GitHub Pages deployment.

Approximate working set: **~103,000 files / ~811 MB** after exclusion rules.

## What this project is not

- Not a prosecutorial finding or legal adjudication.
- Not a complete binary mirror of every source artifact.
- Not a claim that any mention in source text implies guilt or wrongdoing.

## Repository layout

- `index.html` main entry point
- `search.html` cross-site search UI
- `release-guide.html` release/package orientation
- `content/` source-linked markdown artifacts and structured pages
- `data/public-data.json` dataset and mirror link definitions
- `.github/workflows/pages.yml` sanitized Pages deploy workflow

## Methods and reproducibility

Method definitions and reproducibility notes are here:

- `METHODS.md` counting rules, OCR, dedupe, and assumptions
- `DATA_SOURCES.md` source package map and integrity workflow
- `CITATION.md` how to cite findings and doc IDs

## Mirroring and sharing

- Quick mirror instructions: `MIRROR.md`
- Use GitHub Releases/tags for immutable snapshots
- Keep references pinned to tag URLs when publishing externally

## Contributing

- Contribution workflow: `CONTRIBUTING.md`
- Issue templates included:
- broken links/missing artifacts
- doc-ID mapping corrections
- OCR/text extraction errors

## Security

- Vulnerability reporting process: `SECURITY.md`
- Do not post exploit details in public issues

## Legal and ethics

- Legal scope and interpretation boundaries: `LEGAL.md`
- Privacy and handling standards: `ETHICS.md`

## Local preview

From repo root:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages deployment

This repository deploys via GitHub Actions:

1. Push to `main`.
2. In GitHub, set `Settings -> Pages -> Source` to `GitHub Actions`.
3. Let `.github/workflows/pages.yml` build and deploy.

The workflow publishes a sanitized artifact and excludes internal repo metadata files from public Pages output.

## Maintenance and releases

- Changelog: `CHANGELOG.md`
- Release notes should include scope changes, count deltas, known gaps, and integrity/checksum notes.

## License

Released under **The Unlicense** (`LICENSE`).
