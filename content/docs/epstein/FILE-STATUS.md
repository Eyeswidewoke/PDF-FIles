# EPSTEIN FILES — MASTER FILE STATUS
## Complete Collection Tracker

> **Updated:** February 10, 2026
> **Location:** `[local-path]
> **Source:** DOJ + Internet Archive + GitHub Epstein-Files repo

---

## COLLECTION STATUS

| DS | Size | Format | Status | Location | Notes |
|----|------|--------|--------|----------|-------|
| **1** | 1.27 GB | ZIP → 3,158 PDFs | ✅ HAVE | `[local-path] | Re-downloaded + extracted |
| **2** | 614 MB | Combined PDF | ✅ HAVE | `combined/DataSet_2_COMPLETE.pdf` | Valid PDF + djvu.txt; IA has ZIP |
| **3** | 598 MB | Combined PDF | ✅ HAVE | `combined/DataSet_3_COMPLETE.pdf` | Valid PDF + djvu.txt; IA has ZIP |
| **4** | 359 MB | ZIP → 152 PDFs | ✅ HAVE | `[local-path] | Re-downloaded + extracted |
| **5** | 61.6 MB | ZIP → 120 PDFs | ✅ HAVE | `[local-path] | Re-downloaded + extracted |
| **6** | 53 MB | ZIP → 13 PDFs | ✅ HAVE | `[local-path] | Re-downloaded + extracted |
| **7** | 98.3 MB | ZIP → 17 PDFs | ✅ HAVE | `[local-path] | Re-downloaded + extracted |
| **8** | 1.65 GB | Combined PDF | ✅ HAVE | `combined/DataSet_8_COMPLETE.pdf` | Valid PDF; IA has 10GB ZIP w/ individual PDFs |
| **9** | ~143 GB | Torrent only | ❌ MISSING | — | DOJ 404. ~99.9% reconstructed via community |
| **10** | 78.6 GB | IA mirror | ❌ MISSING | — | DOJ 404. Available at `archive.org/download/data-set-10/` |
| **11** | 25.6 GB | IA mirror | ❌ MISSING | — | DOJ 404. Available at `archive.org/download/Epstein-Data-Sets-So-Far/` |
| **12** | 119.9 MB | ZIP → 152 PDFs | ✅ HAVE | `[local-path] | Downloaded + extracted |

**Score: 9/12 DataSets collected** — Only DS 9, 10, 11 remaining (all large, all need IA/torrent)

---

## WHAT WE HAVE (individual PDFs extracted)

| DS | PDFs | DAT | OPT | Total Files | Total Size |
|----|------|-----|-----|-------------|------------|
| 1 | 3,158 | 3 | 2 | 3,163 | 1,268 MB |
| 4 | 152 | 1 | 1 | 154 | 359 MB |
| 5 | 120 | 1 | 1 | 122 | 61.6 MB |
| 6 | 13 | 1 | 1 | 15 | 53 MB |
| 7 | 17 | 1 | 1 | 19 | 98.3 MB |
| 12 | 152 | 1 | 1 | 154 | 119.9 MB |
| **TOTAL** | **3,612** | **8** | **7** | **3,627** | **1,960 MB** |

---

## COMBINED PDFs (monolithic — from Internet Archive bulk download)

| DS | Size | Header | Status |
|----|------|--------|--------|
| 1 | 1.16 GB | `00000000` | ❌ CORRUPTED (null bytes) |
| 2 | 614 MB | `%PDF` | ✅ VALID |
| 3 | 598 MB | `%PDF` | ✅ VALID |
| 4 | 328 MB | `00000000` | ❌ CORRUPTED (null bytes) |
| 5 | 58 MB | `00000000` | ❌ CORRUPTED (replaced by ZIP) |
| 6 | 52.6 MB | `00000000` | ❌ CORRUPTED (replaced by ZIP) |
| 7 | 90 MB | `00000000` | ❌ CORRUPTED (replaced by ZIP) |
| 8 | 1.65 GB | `%PDF` | ✅ VALID |

**Also have:** `COMBINED_ALL_EPSTEIN_FILES_djvu.txt` (40 MB searchable text — covers DS 1-4)

---

## SEARCHABLE TEXT RESOURCES

| Source | Size | Coverage |
|--------|------|----------|
| `COMBINED_ALL_EPSTEIN_FILES_djvu.txt` | 40 MB | DS 1-4 (primary search resource) |
| `DataSet_1_COMPLETE_djvu.txt` | 146 KB | DS1 only |
| `DataSet_4_COMPLETE_djvu.txt` | 2 MB | DS4 only |
| PyMuPDF extraction: DS2 | 31 KB | DS2 (mostly scanned images) |
| PyMuPDF extraction: DS3 | 125 KB | DS3 |
| PyMuPDF extraction: DS5 | 67 KB | DS5 |
| PyMuPDF extraction: DS6 | 524 KB | DS6 |
| PyMuPDF extraction: DS7 | 762 KB | DS7 |
| PyMuPDF extraction: DS8 | 1.19 MB | DS8 |
| PyMuPDF extraction: DS12 | 1.73 MB | DS12 |

---

## STILL NEEDED — DOWNLOAD PLAN

### Immediate (can start now)

| What | Size | Source |
|------|------|--------|
| DS2 ZIP | 631 MB | `archive.org/download/Epstein-Data-Sets-So-Far/DataSet 2.zip` |
| DS3 ZIP | 596 MB | `archive.org/download/Epstein-Data-Sets-So-Far/DataSet 3.zip` |
| DS8 ZIP | 10 GB | `archive.org/download/Epstein-Data-Sets-So-Far/DataSet 8.zip` |

### Large Downloads (hours/days)

| What | Size | Source | Notes |
|------|------|--------|-------|
| DS11 | 25.6 GB | IA: `Epstein-Data-Sets-So-Far/DataSet 11.zip` | On IA! |
| DS10 | 78.6 GB | IA: `data-set-10/DataSet 10.zip` | On IA! |
| DS9 | ~143 GB | Torrent only | May not fit on disk (226 GB free) |

### Disk Budget

```
Free on D:\  →  ~224 GB (after DS1 extracted)
DS2 ZIP      →   -0.6 GB  
DS3 ZIP      →   -0.6 GB
DS8 ZIP      →  -10 GB
DS11 ZIP     →  -25.6 GB
DS10 ZIP     →  -78.6 GB
                 --------
Remaining    →  ~108 GB (not enough for DS9 at 143 GB)
```

---

## NEXT STEPS

1. ✅ DS1 downloaded + extracted (3,158 PDFs)
2. ⬜ Download DS2 + DS3 ZIPs (for individual PDFs — we have combined PDFs but not individual)
3. ⬜ Download DS8 ZIP (10 GB — individual PDFs)  
4. ⬜ Download DS11 (25.6 GB from IA)
5. ⬜ Download DS10 (78.6 GB from IA)
6. ⬜ Assess DS9 feasibility (needs 143 GB, only ~109 GB would remain)
7. ⬜ Full indexing + keyword extraction once all files collected

---

## IA DOWNLOAD LINKS (all confirmed working Feb 10, 2026)

```
https://archive.org/download/Epstein-Data-Sets-So-Far/DataSet 1.zip     (1.2 GB)
https://archive.org/download/Epstein-Data-Sets-So-Far/DataSet 2.zip     (631 MB)
https://archive.org/download/Epstein-Data-Sets-So-Far/DataSet 3.zip     (596 MB)
https://archive.org/download/Epstein-Data-Sets-So-Far/DataSet 4.zip     (352 MB)  ✅ Done
https://archive.org/download/Epstein-Data-Sets-So-Far/DataSet 5.zip     (61.5 MB) ✅ Done
https://archive.org/download/Epstein-Data-Sets-So-Far/DataSet 6.zip     (51.3 MB) ✅ Done
https://archive.org/download/Epstein-Data-Sets-So-Far/DataSet 7.zip     (97 MB)   ✅ Done
https://archive.org/download/Epstein-Data-Sets-So-Far/DataSet 8.zip     (10 GB)
https://archive.org/download/Epstein-Data-Sets-So-Far/DataSet 11.zip    (25.6 GB)
https://archive.org/download/Epstein-Data-Sets-So-Far/DataSet 12.zip    (114 MB)  ✅ Done
https://archive.org/download/data-set-10/DataSet 10.zip                 (78.6 GB)
```

DS9 — torrent only (DOJ 404, not on any IA mirror)
