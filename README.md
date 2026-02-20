# THE PDF FILES

### 900,000+ official DOJ documents containing over 3 million pages of Epstein case files — searchable, cross-referenced, and fully indexed. Every name. Every flight. Every dollar. Every deposition.

[![Live Site](https://img.shields.io/badge/🔴_LIVE-eyeswidewoke.github.io%2FPDF--FIles-c62828?style=for-the-badge)](https://eyeswidewoke.github.io/PDF-FIles/)
[![Documents](https://img.shields.io/badge/documents-900%2C000%2B-b5280f?style=flat-square)](https://eyeswidewoke.github.io/PDF-FIles/)
[![Words Indexed](https://img.shields.io/badge/words-343_million-b5280f?style=flat-square)](https://eyeswidewoke.github.io/PDF-FIles/)
[![Key Figures](https://img.shields.io/badge/key_figures-148-b5280f?style=flat-square)](https://eyeswidewoke.github.io/PDF-FIles/)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue?style=flat-square)](./LICENSE)

---

## Project positioning

**THE PDF FILES** is published as a reusable base layer: one searchable, source-linked index of the released files and associated research artifacts.

The goal is not to run a permanent centralized collaboration program in this repository. The goal is to get a solid foundation public, make it easy to reuse, and let others incorporate/merge this work into broader independent efforts.

### 🔗 **[Explore the live site →](https://eyeswidewoke.github.io/PDF-FIles/)**

---

## Handoff intent

This repo is intended to be:

- A stable starting point for downstream research projects
- A source-linked archive/index that can be mirrored and extended
- A handoff package that other teams can integrate into their own stacks

This repo is **not** intended to be the only long-term home for all work on this topic.

---

## Using this in your own project

- Fork or mirror it and run your own version
- Reuse the dataset file indexes, cast pages, and timeline structures
- Merge selected data into other research databases or newsroom pipelines
- Keep claim-to-document traceability intact (DocID/page/path)

---

## The Epstein Files. All of Them. Exposed.

On January 9, 2025, the U.S. Department of Justice unsealed over **900,000 official documents** — containing more than **3 million pages** — from the Jeffrey Epstein investigation. Flight logs, financial records, depositions, FBI reports, victim statements, and communications involving some of the most powerful people on Earth.

Most people will never read them. They were released as raw, unsearchable PDFs — thousands of files buried across 12 separate datasets. That's by design.

**THE PDF FILES** is an independent, open-source project that has extracted, indexed, and cross-referenced every document in the official DOJ release. **343 million words** have been parsed. **148 key figures** are tracked across every mention. Every page is searchable. Nothing has been altered. Nothing has been hidden.

> *"Sunlight is the best disinfectant."* — U.S. Supreme Court Justice Louis Brandeis

---

## By the numbers

| Metric | Count |
|--------|-------|
| 📄 Official DOJ documents | **900,000+** |
| 📄 Total pages across all documents | **3,000,000+** |
| 📝 Words indexed | **343 million** |
| 📁 Searchable artifacts | **59,140** |
| 📦 DOJ datasets processed | **12** |
| 👤 Key figures tracked | **148** |
| 🖼️ Gallery images classified | **682** |
| ⏱️ Timeline events mapped | **51** |
| 📋 Cast profiles built | **152** |

---

## What we found

- ✈️ **Flight log connections mapped** — every Lolita Express passenger cross-referenced across all 12 datasets with date, route, and co-passenger data
- 💰 **Financial transactions traced** — wire transfers, trust structures, shell companies, and payment flows indexed from DOJ financial exhibits
- 📑 **400,000+ previously unsearchable pages surfaced** — deep sweep OCR recovered text from blank-flagged and image-only PDFs that standard extraction missed
- 🕸️ **Inner circle network reconstructed** — 148 key figures mapped by role, document frequency, and connection strength across the full corpus

---

## What this project is

- A fully searchable, static website indexing every document in the official DOJ Epstein release
- A cross-referenced research tool: search by name, by topic, by dataset, or across the entire corpus
- A base layer designed to be forked, mirrored, and merged into other research workflows
- Built with structured content (`content/`, `data/`), 40+ Python extraction scripts, and CLIP-based image classification
- Public domain — clone it, mirror it, host it yourself

## What this project is NOT

- ❌ Not a prosecutorial finding or legal adjudication
- ❌ Not a claim that any mention in source text implies guilt or wrongdoing
- ❌ Not a complete binary mirror of every source artifact
- ❌ Not affiliated with the DOJ, any government agency, or any media outlet
- ❌ Not intended to remain the sole long-term coordination hub

---

## Dataset file indexes

We publish the **complete filename inventory** for every file in all 12 DOJ datasets. Use these to verify your own downloads, identify gaps, or cross-reference with other researchers.

📂 **[`data/dataset-file-index/`](./data/dataset-file-index/)** — TXT, CSV, and JSON indexes for DS1–12

| Dataset | Files | EFTA Range |
|---------|------:|------------|
| DS 1 | 3,158 | `EFTA00000001` → `EFTA00003158` |
| DS 2 | 574 | `EFTA00003159` → `EFTA00003857` |
| DS 3 | 67 | `EFTA00003858` → `EFTA00005586` |
| DS 4 | 152 | `EFTA00005705` → `EFTA00008320` |
| DS 5 | 120 | `EFTA00008409` → `EFTA00008528` |
| DS 6 | 13 | `EFTA00008529` → `EFTA00008998` |
| DS 7 | 17 | `EFTA00009016` → `EFTA00009664` |
| DS 8 | 10,595 | `EFTA00009676` → `EFTA00039023` |
| DS 9 | 252,169 | `EFTA00039025` → `EFTA01262781` |
| DS 10 | 302,284 | `EFTA01262782` → `EFTA01926086` |
| DS 11 | 331,655 | `EFTA02212883` → `EFTA02730262` |
| DS 12 | 152 | `EFTA02730265` → `EFTA02731783` |
| **Total** | **900,956** | |

> ⚠️ **These counts reflect our downloads from Feb 11-12, 2026.** The DOJ has been updating datasets since. If your counts differ, [please let us know](https://github.com/Eyeswidewoke/PDF-FIles/issues/new?title=Dataset+file+count+mismatch) so we can track what's changed.

🔴 **[Browse the file index interactively →](https://eyeswidewoke.github.io/PDF-FIles/dataset-file-index.html)**

---

## Repository layout

```
index.html                      Main entry point
search.html                     Cross-site search UI
dataset-file-index.html         Interactive dataset filename browser
release-guide.html              Release/package orientation
cast.html                       148 key-figure profile pages
content/                        Source-linked markdown artifacts
data/dataset-file-index/        📂 Complete filename indexes for DS1-DS12 (TXT, CSV, JSON)
data/public-data.json           Dataset and mirror link definitions
findings/                       Investigation markdown reports
.github/workflows/              Sanitized Pages deploy workflow
```

## Supporting documentation

| Document | Purpose |
|----------|---------|
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Legacy GitHub contribution workflow (optional) |
| [`METHODS.md`](./METHODS.md) | Counting rules, OCR pipeline, deduplication, assumptions |
| [`DATA_SOURCES.md`](./DATA_SOURCES.md) | Source package map and integrity workflow |
| [`CITATION.md`](./CITATION.md) | How to cite findings and document IDs |
| [`LEGAL.md`](./LEGAL.md) | Legal scope and interpretation boundaries |
| [`ETHICS.md`](./ETHICS.md) | Privacy and handling standards |
| [`MIRROR.md`](./MIRROR.md) | Quick mirror/fork instructions |
| [`SECURITY.md`](./SECURITY.md) | Vulnerability reporting process |
| [`CHANGELOG.md`](./CHANGELOG.md) | Version history and release notes |

---

## Quick start

### View the live site

**[https://eyeswidewoke.github.io/PDF-FIles/](https://eyeswidewoke.github.io/PDF-FIles/)**

### Run locally

```powershell
git clone https://github.com/Eyeswidewoke/PDF-FIles.git
cd PDF-FIles
python -m http.server 8000
# Open http://localhost:8000
```

### Fork & deploy your own mirror

1. Fork this repository
2. In your fork, go to `Settings → Pages → Source` and select `GitHub Actions`
3. Push to `main` — the included workflow (`.github/workflows/pages.yml`) handles the rest

### Download the full archive

[Download ZIP snapshot (main branch)](https://github.com/Eyeswidewoke/PDF-FIles/archive/refs/heads/main.zip)

---

## Corrections and reuse notes

This repository is published primarily for reuse and handoff. If you use it in your own project, please preserve source traceability and document IDs.

If you spot a factual error or broken reference, you can still file a correction issue:
- Broken links / missing artifacts
- Doc-ID mapping corrections
- OCR / text extraction errors
- Source attribution mismatches

Open a correction here: [GitHub Issues](https://github.com/Eyeswidewoke/PDF-FIles/issues/new)

## Security

Do not post exploit details in public issues. See [`SECURITY.md`](./SECURITY.md).

---

## License

Released into the **public domain** under [The Unlicense](./LICENSE).

Fork it. Mirror it. Share it. **The documents belong to the public.**
