# Mirror Guide

Fastest way to mirror this archive for review or preservation.

## Option A: Download ZIP (no git)

1. Download: `https://github.com/Eyeswidewoke/PDF-FIles/archive/refs/heads/main.zip`
2. Extract locally.
3. Open `index.html` directly, or serve locally (recommended).

## Option B: Git clone

```powershell
git clone https://github.com/Eyeswidewoke/PDF-FIles.git
cd PDF-FIles
```

## Local host (recommended)

```powershell
python -m http.server 8000
```

Open `http://localhost:8000`.

## Publish your own mirror

- GitHub Pages
- Cloudflare Pages
- Netlify
- Any static host

## Mirror checklist

- Verify main pages load (`index.html`, `search.html`, `release-guide.html`).
- Verify search and navigation function.
- Note that some excluded source artifacts may intentionally be unavailable.

## Integrity notes

- Prefer mirroring tagged releases when available.
- If checksums are published in release notes, verify before redistribution.
