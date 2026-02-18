# Investigation F: Epstein Death In Custody (MCC) Evidence Map

- Updated: 2026-02-16
- Method: keyword-based signal mapping across published md-first document scans plus corpus-level cross-checks.

## Why This Should Be A Dedicated Section

The corpus already contains a dense cluster of documents around:
- `suicide`
- `suicide watch`
- `cellmate`
- `MCC New York` / `Metropolitan Correctional Center`
- references to `Tartaglione`

Current signal density from published `document-scans`:
- `suicide`: **351 hits** across **149 files**
- `cellmate`: **212 hits** across **41 files**
- `MCC`: **545 hits** across **235 files**
- `autopsy/hyoid/neck fracture`: **33 hits** across **22 files**
- `suicide watch`: **101 hits** across **34 files**
- `Tartaglione`: **20 hits** across **6 files**

This is enough to justify a dedicated, structured topic section instead of scattered references.

## Key Document Clusters

### Cluster A: High-density legal/deposition thread (`EFTA01656708`)

Representative files:
- [p018](../document-scans/legal-filing/legal-filing+scanned-document+affidavit+typed-page__EFTA01656708_20260130_p018_i001.md)
- [p053](../document-scans/deposition-transcript/deposition-transcript+legal-filing+typed-page__EFTA01656708_20260130_p053_i001.md)
- [p118](../document-scans/legal-filing/legal-filing+email-screenshot__EFTA01656708_20260130_p118_i001.md)
- [p086](../document-scans/legal-filing/legal-filing+court-document+affidavit__EFTA01656708_20260130_p086_i001.md)

Observed themes in this cluster:
- suicide-watch process references
- cellmate references
- MCC procedural context

### Cluster B: Suicide-risk assessment style material (`EFTA02727007`)

Representative files:
- [p121](../document-scans/scanned-document/scanned-document+court-document+deposition-transcript__EFTA02727007_20260210_p121_i001.md)
- [p102](../document-scans/deposition-transcript/deposition-transcript+court-document+scanned-document__EFTA02727007_20260210_p102_i001.md)
- [p090](../document-scans/deposition-transcript/deposition-transcript+legal-filing+scanned-document+court-document__EFTA02727007_20260210_p090_i001.md)

Observed themes in this cluster:
- suicide risk framing language
- risk factor / protective factor style wording

### Cluster C: Tartaglione / cellmate-adjacent thread (`EFTA01687456`)

Representative files:
- [p036](../document-scans/letter/letter+scanned-document+legal-filing__EFTA01687456_20260130_p036_i001.md)
- [p052](../document-scans/legal-filing/legal-filing+scanned-document+deposition-transcript+typed-page__EFTA01687456_20260130_p052_i001.md)
- [p068](../document-scans/scanned-document/scanned-document+legal-filing+deposition-transcript+typed-page__EFTA01687456_20260130_p068_i001.md)

Related references:
- [EFTA01687868 p004](../document-scans/email-screenshot/email-screenshot+letter+deposition-transcript__EFTA01687868_20260130_p004_i001.md)
- [EFTA01655511 p012](../document-scans/deposition-transcript/deposition-transcript+email-screenshot+timeline+legal-filing__EFTA01655511_20260130_p012_i001.md)

## Existing Corpus Anchors

Already-published corpus docs include explicit references that belong in this section:
- [CONTEXT-EXTRACTS.md](../epstein/CONTEXT-EXTRACTS.md)
  - includes subject text: `Request for Jeffrey Epstein Suicide Reconstruction Report`
  - includes MCC custody references
- [INVESTIGATION-A-POWER-NETWORK.md](./INVESTIGATION-A-POWER-NETWORK.md)
  - includes references to suicide-watch context and Barr-position statements

## Video / Media Track Status

The non-PDF media corpus exists, but is not yet crosswalked to this MCC/death cluster:
- media files discovered under `MEDIA/`: **2,709**
- media files with EFTA-style IDs: **2,704**
- by dataset:
  - `DS9`: 2,281
  - `DS8`: 423
  - `DS11`: 4
  - `DS2`: 1

When matching EFTA IDs from this death-custody document set:
- unique EFTA IDs in death-custody signal set: **190**
- overlap with media EFTA IDs: **0**

Global crosswalk status (all media IDs vs published document-scans IDs):
- document-scans unique EFTA IDs: **16,593**
- overlap with media EFTA IDs: **0**

Implication:
- media exists, but current linkage is weak/noisy and needs a separate reconciliation pass.

## Recommended Site Section Structure

1. `Death In Custody Timeline`
- event chronology, source links, unresolved questions list
- now published: [Investigation H: Death In Custody Timeline (Evidence-First)](./INVESTIGATION-H-DEATH-IN-CUSTODY-TIMELINE.md)

2. `Official Process Records`
- suicide watch logs, MCC staffing/procedure records, BOP/DOJ references

3. `Medical / Risk Assessment Material`
- autopsy-related references, risk-evaluation forms, psychiatric-screening language

4. `Cellmate / Correspondence Track`
- Tartaglione and related legal correspondence bundle

5. `Media Reconciliation Queue`
- candidate non-PDF files from `MEDIA` requiring crosswalk to document IDs

## Limits / Cautions

- This section should remain evidence-first and avoid asserting conclusions beyond the text.
- OCR noise exists in portions of the corpus; high-signal files should be prioritized.
- Media linkage currently needs additional ETL (ID mapping, metadata extraction, timeline alignment).

## Build Artifacts

- Signal audit JSON: [AUDIT-DEATH-CUSTODY-SIGNALS-2026-02-16.json](./artifacts/AUDIT-DEATH-CUSTODY-SIGNALS-2026-02-16.json)
- Media crosswalk JSON: [AUDIT-MEDIA-CROSSWALK-2026-02-16.json](./artifacts/AUDIT-MEDIA-CROSSWALK-2026-02-16.json)
- Document-scans index: [index.json](../document-scans/index.json)
