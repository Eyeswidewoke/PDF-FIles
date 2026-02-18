# Investigation G: Fresh Eyes Whole-Case Lead Map

- Updated: 2026-02-16
- Scope: whole-case coverage check, site presentation gaps, new lead surfacing, and next-step game plan.

## Executive Snapshot

Current published state (site index):
- Collections: **16**
- Included artifacts: **58,999**
- Investigation reports: **9**
- Investigation findings pages: **16**
- Document-scans items: **30,743**

Current extraction state (OCR/text pipeline):
- `extracted` total: **2,096,983**
- `extracted.status='done'`: **2,059,705**
- Not done: **37,278**
- Words extracted (done): **343,294,733**

This confirms substantial extraction and publication progress, but not full closure.

## What Is Strong Already

1. Long-form investigation coverage exists across network, trafficking mechanics, money/planes, depositions, data integrity, and now custody-death clustering.
2. A large md-first document corpus is publicly indexed (`document-scans`), with path integrity checks passing.
3. Cast pages and timeline material exist and are navigable.

## New Anomalies And Leads

### Lead 1: Non-PDF media is not linked to published document IDs

Crosswalk result:
- Media files scanned: **2,709**
- Media files with EFTA-style IDs: **2,704**
- Unique EFTA IDs in published document-scans: **16,593**
- **Unique-ID overlap: 0**

Dataset distribution in media:
- `DS9`: 2,281
- `DS8`: 423
- `DS11`: 4
- `DS2`: 1

Custody/death-relevant media folder signals:
- `MEDIA/DS9-nonpdf/by-extension/mp4/Epstein Jail Clips` (290 files)
- `MEDIA/DS9-nonpdf/by-extension/Epstein Location Videos` (2 files)

Interpretation:
- The media corpus appears to use a separate ID namespace or ingest lineage and is currently disconnected from on-site document evidence pages.

### Lead 2: Death-in-custody signal concentration is real and clusterable

Keyword signal counts in published document-scans:
- `mcc`: 545 hits across 235 files
- `suicide`: 351 hits across 149 files
- `cellmate`: 212 hits across 41 files
- `suicide watch`: 101 hits across 34 files
- `autopsy/hyoid/neck fracture`: 33 hits across 22 files
- `tartaglione`: 20 hits across 6 files

Cross-term lead anchors:
- `EFTA01656708`: appears across **5** custody terms (`mcc`, `suicide`, `cellmate`, `watch`, `autopsy`)
- `EFTA02727007`: appears across **3** custody terms
- `EFTA02729994` and `EFTA02729997`: appear across **3** custody terms
- `EFTA01687456`: concentrated Tartaglione thread

Related report:
- [Investigation F: Epstein Death In Custody (MCC) Evidence Map](./INVESTIGATION-F-EPSTEIN-DEATH-IN-CUSTODY.md)

### Lead 3: Remaining extraction backlog is concentrated and actionable

Not-done extraction rows by dataset:
- `DS9`: 23,942 (all `empty`)
- `DS10`: 5,854 (`empty`: 4,227, `no_text`: 1,627)
- `DS11`: 4,015 (`no_text`: 3,987, `empty`: 28)
- `DS8`: 1,658 (`empty`)
- remaining datasets: low-volume residuals

Interpretation:
- A focused completion pass on DS9/DS10/DS11 residuals gives the highest closure gain.

### Lead 4: Review queue remains the largest unmined evidence pool

From md-first ledger:
- Rows: **802,988**
- `include`: **30,741**
- `review`: **696,031**
- `exclude`: **76,216**

Largest `review` reasons:
- `missing-png`: 404,396
- `short-but-possibly-relevant`: 235,693
- `needs-human-review`: 55,942

Interpretation:
- "Good data on site" is strong for included items, but the largest unrealized lead pool remains in `review`.

## Fresh-Eyes Game Plan

### Phase 1 (high ROI, immediate)

1. Build media reconciliation index:
- map media IDs to source PDF lineage and timeline dates.
- publish a site-facing `media-reconciliation` queue page.

2. Expand custody section from evidence map to chronology:
- create a source-first event sequence page for custody/death records.
- attach unresolved questions to specific document IDs.
- status: completed in [Investigation H: Death In Custody Timeline (Evidence-First)](./INVESTIGATION-H-DEATH-IN-CUSTODY-TIMELINE.md)

3. Prioritize review backlog triage by signal:
- start with `review` rows in `deposition-transcript`, `email-screenshot`, and `invoice` categories that mention custody terms.

### Phase 2 (deeper investigation)

1. Resolve ID namespace mismatch (`MEDIA` vs `document-scans`) and document transformation rules.
2. Complete residual extraction backlog in DS9/DS10/DS11, then rerun custody and cast-linked scans.
3. Promote high-confidence review findings into:
- new cast page inserts,
- timeline entries,
- investigation finding pages.

## New Rabbit Holes Worth Pursuing

1. Why custody media IDs (`EFTA00064598+` cluster and other jail clips) have zero overlap with document-scans IDs.
2. Whether DS11 `no_text` residuals are image quality/OCR model failures or parser mismatch.
3. Whether `missing-png` review rows represent stale pathing versus true missing assets.
4. Whether multi-term custody anchor `EFTA01656708` can be decomposed into a deterministic event sequence.

## Evidence Artifacts Generated

- [AUDIT-DEATH-CUSTODY-SIGNALS-2026-02-16.json](./artifacts/AUDIT-DEATH-CUSTODY-SIGNALS-2026-02-16.json)
- [AUDIT-MEDIA-CROSSWALK-2026-02-16.json](./artifacts/AUDIT-MEDIA-CROSSWALK-2026-02-16.json)
- [AUDIT-SUMMARY-2026-02-16.json](./artifacts/AUDIT-SUMMARY-2026-02-16.json)
- `PROJECT/SCRIPTS/DOCUMENTS-MD-TRIAGE-LEDGER.csv`

## Related Follow-On

- [Investigation H: Death In Custody Timeline (Evidence-First)](./INVESTIGATION-H-DEATH-IN-CUSTODY-TIMELINE.md)

## Confidence Statement

The site now has a strong base of extracted and published material, including a dedicated custody-death map.  
However, full accountability still requires media crosswalk reconciliation and systematic reduction of the review/not-done backlogs before claiming full corpus closure.
