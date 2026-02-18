# Investigation H: Death In Custody Timeline (Evidence-First)

- Updated: 2026-02-16
- Scope: source-linked chronology for Epstein custody/death records using top EFTA anchor clusters.

## Dating Rules Used

1. If a source explicitly states an event date, that date is used as the timeline date.
2. If no event date is explicit, the entry is marked as `Undated in source`.
3. Dates embedded in filenames (for example `20260130`, `20260210`) are treated as **document batch/index dates**, not event dates.

## Chronology

### 2019 (explicit event references in source text)

#### 1. Custody placement at MCC Manhattan

- Evidence anchor:
  - [CONTEXT-EXTRACTS.md](../epstein/CONTEXT-EXTRACTS.md)
- Source text (as extracted):
  - "to the custody of the Bureau of Prisons and held at the Metropolitan Correctional Center in Manhattan."

Assessment:
- This is a direct placement reference connecting the custody phase to MCC New York.

#### 2. August 10, 2019: death event reference

- Evidence anchor:
  - [CONTEXT-EXTRACTS.md](../epstein/CONTEXT-EXTRACTS.md)
- Source text (as extracted):
  - "On August 10, 2019, Epstein was found hanging in his cell and was later pronounced dead."

Assessment:
- This is the primary explicit event-date line currently surfaced in published corpus extracts.

#### 3. Post-incident investigatory process references (BOP/MCC)

- Evidence anchor:
  - [CONTEXT-EXTRACTS.md](../epstein/CONTEXT-EXTRACTS.md)
- Source text (as extracted):
  - "The MCC New York Updates would disclose how BOP investigates and tracks certain incidents..."
  - "...letter to the MCC warden regarding a visit by an after action team..."

Assessment:
- Source references an after-action/investigatory track tied to MCC operations.

### 2026-01-30 document batch (top EFTA cluster release date in filenames)

#### 4. Suicide-prevention framework and watch process

- Anchor: `EFTA01656708`
- Evidence pages:
  - [p018](../document-scans/legal-filing/legal-filing+scanned-document+affidavit+typed-page__EFTA01656708_20260130_p018_i001.md)
  - [p053](../document-scans/deposition-transcript/deposition-transcript+legal-filing+typed-page__EFTA01656708_20260130_p053_i001.md)
- Source text (as extracted):
  - "Suicide Prevention ... BOP's suicide prevention program..."
  - "taken off suicide watch and placed on psychological observation..."

Assessment:
- This anchor documents procedural flow from suicide-watch status to subsequent monitoring.

#### 5. Cellmate references tied to watch period

- Anchor: `EFTA01656708`
- Evidence page:
  - [p086](../document-scans/legal-filing/legal-filing+court-document+affidavit__EFTA01656708_20260130_p086_i001.md)
- Source text (as extracted):
  - "...following suicide watch... asked Epstein not to kill himself while ... was his cellmate..."

Assessment:
- This is a direct cellmate-period reference inside the same high-density custody cluster.

#### 6. Tartaglione-adjacent correspondence/legal track

- Anchors: `EFTA01687456`, `EFTA01687868`, `EFTA01655511`
- Evidence pages:
  - [EFTA01687456 p036](../document-scans/letter/letter+scanned-document+legal-filing__EFTA01687456_20260130_p036_i001.md)
  - [EFTA01687456 p052](../document-scans/legal-filing/legal-filing+scanned-document+deposition-transcript+typed-page__EFTA01687456_20260130_p052_i001.md)
  - [EFTA01687868 p004](../document-scans/email-screenshot/email-screenshot+letter+deposition-transcript__EFTA01687868_20260130_p004_i001.md)
  - [EFTA01655511 p012](../document-scans/deposition-transcript/deposition-transcript+email-screenshot+timeline+legal-filing__EFTA01655511_20260130_p012_i001.md)
- Source text (as extracted):
  - "Subject: Re: Tartaglione Sunday's attempt"
  - "...where he shared a cell with ex-cop Nicholas Tartaglione..."

Assessment:
- This cluster is the clearest published correspondence bridge between custody discussions and the Tartaglione thread.

### 2026-02-10 document batch (additional risk/operations materials)

#### 7. Suicide risk assessment materials

- Anchor: `EFTA02727007`
- Evidence pages:
  - [p121](../document-scans/scanned-document/scanned-document+court-document+deposition-transcript__EFTA02727007_20260210_p121_i001.md)
  - [p102](../document-scans/deposition-transcript/deposition-transcript+court-document+scanned-document__EFTA02727007_20260210_p102_i001.md)
  - [p090](../document-scans/deposition-transcript/deposition-transcript+legal-filing+scanned-document+court-document__EFTA02727007_20260210_p090_i001.md)
- Source text (as extracted):
  - "Suicide Risk Assessment"
  - "The following STATIC risk factors were assessed..."

Assessment:
- This appears to be a structured risk-evaluation packet and is central to timeline reconstruction.

#### 8. MCC operations testimony references (post-August 2019 procedural context)

- Anchors: `EFTA02729994`, `EFTA02729997`
- Evidence pages:
  - [EFTA02729994 p001](../document-scans/deposition-transcript/deposition-transcript+court-document__EFTA02729994_20260210_p001_i001.md)
  - [EFTA02729997 p001](../document-scans/deposition-transcript/deposition-transcript+court-document__EFTA02729997_20260210_p001_i001.md)
- Source text (as extracted):
  - "On August 12, 2019, LIEUTENANT ..."
  - "...has worked at MCC for 17 years..."

Assessment:
- These pages add staffing/operations structure around the immediate post-event interval.

## Anchor Priority List

1. `EFTA01656708` (cross-term anchor: `mcc`, `suicide`, `watch`, `cellmate`, `autopsy`)
2. `EFTA02727007` (risk-assessment packet)
3. `EFTA02729994` and `EFTA02729997` (MCC operational testimony)
4. `EFTA01687456` + related correspondence (`EFTA01687868`, `EFTA01655511`) for Tartaglione thread

## Open Questions To Pursue Next

1. Can each `EFTA01656708` sub-page be mapped into a deterministic step-by-step custody timeline?
2. Which entries in `EFTA02727007` are contemporaneous records versus retrospective summaries?
3. Can the Tartaglione correspondence thread be chronologically aligned with MCC watch-status transitions?
4. Can custody timeline entries be cross-linked to non-PDF jail clips once media ID reconciliation is complete?

## Related Reports

- [Investigation F: Epstein Death In Custody (MCC) Evidence Map](./INVESTIGATION-F-EPSTEIN-DEATH-IN-CUSTODY.md)
- [Investigation G: Fresh Eyes Whole-Case Lead Map](./INVESTIGATION-G-FRESH-EYES-WHOLE-CASE-LEAD-MAP.md)
