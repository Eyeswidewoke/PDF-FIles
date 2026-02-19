# Cast Portraits

This folder is used by `cast-app.js` for cast card portraits.

Source data:
- `manifest.csv` (name, filename, direct URL, license basis, Commons source page)
- `../cast-portraits.json` (runtime map used by the site)

Runtime behavior:
- Cast cards try local image paths first (`content/cast/portraits/<filename>`).
- If a local file is missing, the app falls back to the Wikimedia URL from `cast-portraits.json`.

To fully localize all portraits:
1. Run the downloader pack in `NEW/epstein_pd_images_downloader`.
2. Copy all files from its `images/` folder into this directory.
3. Keep `manifest.csv` for license/source traceability.
