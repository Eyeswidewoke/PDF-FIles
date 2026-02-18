# Investigation E: Data Integrity and Rabbit Holes

- Updated: 2026-02-16
- Scope: extraction coverage, `_DOCUMENTS` md-first triage/import, anomaly surfacing, and site indexing integrity.

## Executive Summary

1. Extraction coverage is high and internally consistent.
- `extracted` rows: **2,096,983**
- `extracted.status='done'`: **2,059,705**
- `triage` rows: **2,059,705**
- Gap (`done - triage`): **0**

2. `_DOCUMENTS` md-first pass completed and is now published.
- Ledger rows: **802,988**
- Decisions:
  - `include`: **30,741**
  - `review`: **696,031**
  - `exclude`: **76,216**
- Published under:
  - [Document Scans Index](../document-scans/_INDEX.md)
  - [Document Scans JSON](../document-scans/index.json)

3. Site index integrity is currently clean.
- `public-data.json` broken local paths: **0**
- New `document-scans` collection added: **30,743** artifacts (index files + included md files)

## What Was Added To The Site

1. `content/docs/document-scans/` import bundle from `_DOCUMENTS` includes.
2. `content/docs/document-scans/_INDEX.md`
3. `content/docs/document-scans/index.json`
4. Search-visible collection in `data/public-data.json`: `document-scans`

## Major Anomalies

### 1) Large Pairing Gaps Inside `_DOCUMENTS`

Totals:
- `.md`: **802,988**
- `.png`: **403,695**
- exact md/png pairs: **398,592**
- md without png pair: **404,396**
- png without md pair: **5,103**

Top md-missing-png categories:
- `email-screenshot`: **170,458**
- `deposition-transcript`: **138,023**
- `contact-list`: **24,135**
- `typed-page`: **18,735**
- `invoice`: **15,457**

### 2) Duplicate `EFTA+page` Keys Across Categories

- Multi-category duplicate keys: **7,584**
- Max category overlap for one key: **3**
- Dominant duplicate pattern:
  - `_email-screenshot-partial | email-screenshot`: **7,185 keys**
  - `_email-screenshot-partial | email-screenshot | email-screenshot_OLD`: **399 keys**

This is a strong dedup/normalization lead for the email screenshot family.

### 3) High-Word Outliers In Noisy Categories

- High-word files in noisy categories (`business-card`, `passport`, `phone-screen`, `computer-screen`, etc.): **81**

Examples:
- `phone-screen` with **8,867** words (`EFTA01305104`)
- `computer-screen` with **8,389** words (`EFTA01305106`)
- `passport` with **1,031** words (`EFTA00008527`)

These likely represent materially substantive pages that were category-mislabeled by image-first tagging.

### 4) `_NEEDS_OCR` Backlog Still Exists

- `_NEEDS_OCR` png: **403,020**
- `_NEEDS_OCR` md sidecars: **401,913**
- png currently lacking md sidecar: **1,107**

## Cast-Linked Leads

Entity mention hits found in noisy-category high-word outliers:
- **Ghislaine Maxwell**: 14 hits across 4 files
  - examples: `EFTA01263148` (passport pages), `EFTA01306402`
- **Glenn/Eva Dubin**: 5 hits in 1 file
  - example: `EFTA01733932` (business-card category)

Related cast pages:
- [Ghislaine Maxwell Cast Page](../../cast/pages/08-epstein-network-ghislaine-maxwell.md)
- [Glenn & Eva Dubin Cast Page](../../cast/pages/08-epstein-network-glenn-eva-dubin.md)

## Rabbit Holes To Pursue Next

1. Email screenshot dedup merge:
- Collapse `_email-screenshot-partial`, `email-screenshot`, `email-screenshot_OLD` by `EFTA+page`.
- Keep best OCR body per key using confidence + word count + alpha ratio.

2. Misclassified high-text UI/ID categories:
- Prioritize review queue for `phone-screen`, `computer-screen`, `passport`, `business-card` with `words >= 200`.
- Promote substantive pages to legal/financial/document buckets.

3. `_NEEDS_OCR` completion:
- Close the remaining 1,107 png-without-md gap first.
- Re-run triage and only then refresh include/review/exclude ledger deltas.

4. Pairing integrity cleanup:
- Investigate why 404,396 md sidecars lack png pairs in `_DOCUMENTS`.
- This is the largest blocker to claiming full corpus publishability from this bucket.

## Current Confidence Statement

The site now includes a substantial md-first filtered document-scans corpus and has no known indexed-path breakage.  
However, **full-accountability is not yet complete** because `_DOCUMENTS` still has major pairing gaps and `_NEEDS_OCR` backlog remains non-zero.  
The highest value next work is dedup normalization + OCR completion + targeted reclassification of high-word noisy categories.

