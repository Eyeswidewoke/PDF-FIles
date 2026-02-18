# EPSTEIN FILES — MASTER INDEX
## DOJ Release (December 19, 2025) — Complete Inventory & Search Guide

> **Source:** U.S. Department of Justice — [justice.gov/epstein](https://www.justice.gov/epstein)
> **Archive:** [archive.org/details/combined-all-epstein-files](https://archive.org/details/combined-all-epstein-files)
> **Release Date:** December 19, 2025 (Epstein Files Transparency Act)
> **Local Copy:** `[local-path]

---

## WHAT WE HAVE

### Source Collection
The DOJ released **4,055+ documents** across 5 DataSets with sequential numbering (`EFTA00000001` through `EFTA00008528`). An independent researcher compiled them into searchable PDFs and uploaded to Internet Archive.

### File Inventory on [local-path]

```
[local-path]
├── combined-all-epstein-files\          ← Main collection
│   ├── COMBINED_ALL_EPSTEIN_FILES.pdf   ← 6.0 GB — ALL documents merged
│   ├── COMBINED_ALL_EPSTEIN_FILES_djvu.txt  ← 40 MB — ★ PRIMARY SEARCH FILE ★
│   ├── COMBINED_ALL_EPSTEIN_FILES_hocr.html ← 1.0 GB — OCR with coordinates
│   ├── COMBINED_ALL_EPSTEIN_FILES_djvu.xml  ← 541 MB — Structured OCR
│   ├── DataSet_1_COMPLETE.pdf           ← 1.2 GB (EFTA00000001-00003158, 3,142 files)
│   ├── DataSet_1_COMPLETE_djvu.txt      ← 143 KB — Searchable text
│   ├── DataSet_2_COMPLETE.pdf           ← 614 MB (EFTA00003159-00003857, 574 files)
│   ├── DataSet_3_COMPLETE.pdf           ← 598 MB (EFTA00003858-00005586, 67 files)
│   ├── DataSet_4_COMPLETE.pdf           ← 328 MB (EFTA00005705-00008320, 152 files)
│   ├── DataSet_4_COMPLETE_djvu.txt      ← 2.0 MB — Searchable text
│   ├── DataSet_5_COMPLETE.pdf           ← 58 MB  (EFTA00008409-00008528, 120 files)
│   ├── DataSet_6_COMPLETE.pdf           ← 53 MB  (supplemental)
│   ├── DataSet_7_COMPLETE.pdf           ← 90 MB  (supplemental)
│   ├── DataSet_8_COMPLETE.pdf           ← 1.7 GB (supplemental)
│   ├── 1332-16.pdf / _djvu.txt         ← 683 KB — Case exhibit (Sarah Ransome declaration)
│   ├── DataSet 8\VOL00008\             ← Concordance/Relativity legal load files
│   │   ├── DATA\VOL00008.DAT / .OPT   ← Binary legal production format
│   │   └── IMAGES\0001\EFTA00009676.epub
│   ├── combined-all-epstein-files_meta.xml  ← Internet Archive metadata
│   └── combined-all-epstein-files_meta.sqlite ← Metadata DB
│
└── epstein-files-structured-full-20250204.tar.zst ← Compressed structured version (not extracted)
```

---

## SEARCHABLE TEXT FILES

Only **4 files** contain plain text we can search with `findstr`:

| File | Size | Lines | Content |
|------|------|-------|---------|
| **COMBINED_ALL_EPSTEIN_FILES_djvu.txt** | 40 MB | 1,769,894 | ★ MASTER — All DataSets OCR'd into one file |
| DataSet_1_COMPLETE_djvu.txt | 143 KB | 25,059 | DataSet 1 only (subset of master) |
| DataSet_4_COMPLETE_djvu.txt | 2.0 MB | 121,782 | DataSet 4 only (subset of master) |
| 1332-16_djvu.txt | 25 KB | 658 | Single court exhibit (Ransome declaration) |

**⚠️ The COMBINED file is the one to search.** The individual DataSet .txt files are subsets already included in it.

### DataSets WITHOUT searchable text (PDF-only, need manual review):
- DataSet 2 — No djvu.txt
- DataSet 3 — No djvu.txt
- DataSet 5 — No djvu.txt
- DataSet 6 — No djvu.txt (has hocr compressed)
- DataSet 7 — No djvu.txt
- DataSet 8 — Has djvu.xml but no plain text

---

## DOCUMENT TYPE LANDSCAPE

Based on keyword scanning of the 1.77 million lines:

### By Document Type (estimated from keyword counts)
| Document Type | Keyword | Hits | Notes |
|---------------|---------|------|-------|
| **FBI Records** | "FBI" | 6,209 | Investigation files, interview reports |
| **Witness Statements** | "witness" | 4,356 | Testimony, declarations |
| **Victim Statements** | "victim" | 11,631 | Highest count — victim-centric collection |
| **Subpoenas** | "subpoena" | 3,047 | Legal process documents |
| **Indictments** | "indictment" | 2,558 | Charging documents |
| **Search Warrants** | "search warrant" | 1,851 | Evidence collection |
| **Grand Jury** | "Grand Jury" | 1,716 | Secret testimony references |
| **Depositions** | "deposition" | 998 | Sworn testimony |
| **Flight Records** | "flight" | 1,952 | Logs, manifests, travel |
| **Plea Agreements** | "plea agreement" | 243 | Deal documents |
| **Address Book** | "address book" | 18 | Contact references |

### By Person (mentions in combined file)
| Person | Hits | Significance |
|--------|------|--------------|
| **Maxwell** (Ghislaine) | 15,306 | Central figure — most mentioned after Epstein |
| **Trump** | 743 | President — flight logs, depositions, social |
| **Clinton** | 513 | President — flight logs, witness statements |
| **Acosta** | 503 | Prosecutor who gave sweetheart deal |
| **Prince Andrew** | 228 | Royal — victim testimony |
| **Dershowitz** | 146 | Attorney — accused/defender |
| **Nadia** (Marcinkova) | 86 | Alleged co-conspirator |
| **Brunel** (Jean-Luc) | 71 | Modeling agent — died in custody |
| **Giuffre** (Virginia) | 64 | Primary accuser |
| **Roberts** (Virginia née) | 68 | Same person as Giuffre (maiden name) |
| **Wexner** (Leslie) | 63 | Financial patron |

### By Location
| Location | Hits | Significance |
|----------|------|--------------|
| **Palm Beach** | 2,287 | Primary investigation site |
| **St. James / Island** | 206,352* | Private island (*includes OCR noise) |
| **71st Street** (NYC mansion) | 123 | Manhattan townhouse |
| **Mar-a-Lago** | 22 | Trump's club |
| **Lolita** (Express) | 4 | Plane nickname |

---

## KNOWN DOCUMENTS IDENTIFIED

### 1332-16 — Sarah Ransome Declaration
- **Case:** 1:15-cv-07433-LAP
- **Filed:** January 8, 2024
- **Content:** Detailed witness statement about Epstein operation
- **Key mentions:** Trump (sexual conduct allegation), Clinton, Prince Andrew, Branson, Dershowitz, Sergey Brin
- **Status:** ✅ Fully readable in `1332-16_djvu.txt`

---

## SEARCH COMMANDS REFERENCE

All searches use the combined master file. Run from any terminal:

```cmd
REM Count mentions of a term
findstr /C:"SEARCH TERM" /I "[local-path] | find /C /V ""

REM Extract all matching lines to a file
findstr /C:"SEARCH TERM" /I "[local-path] > output.txt

REM Search with context (findstr doesn't support context, so use line numbers + more)
findstr /N /C:"SEARCH TERM" /I "[local-path]

REM Search for multiple terms at once
findstr /I "term1 term2 term3" "[local-path]
```

---

## EXTRACTION STATUS

See subfolders in this directory for extracted content:

| Folder | Content | Status |
|--------|---------|--------|
| `01-NAMES/` | Person-specific extractions | ✅ 5 done (Wexner, Clinton, Acosta, Andrew, Dershowitz) |
| `02-FLIGHT-LOGS/` | Flight records & manifests | ✅ Raw extraction done (168 KB) |
| `03-FBI-RECORDS/` | FBI investigation materials | ⬜ Not started |
| `04-DEPOSITIONS/` | Sworn testimony extracts | ⬜ Not started |
| `05-TRUMP-MENTIONS/` | All Trump-related content | ✅ Raw extraction done (743 lines + 22 Mar-a-Lago) |
| `06-LOCATIONS/` | Location-specific content | ⬜ Not started |
| `07-FINANCIAL/` | Money, transfers, accounts | ⬜ Not started |
| `08-VICTIM-STATEMENTS/` | Victim testimony | ⬜ Not started |
| `09-LEGAL-PROCESS/` | Subpoenas, warrants, pleas | ⬜ Not started |
| `10-REDACTED-NAMES/` | Content related to the 6 redacted names | ✅ Wexner extracted; 4 names N/A in OCR |

---

## LIMITATIONS & WARNINGS

1. **OCR Quality:** These are scanned documents run through Tesseract OCR. Errors are common — names may be misspelled, numbers garbled
2. **Redactions:** Many documents have physical redaction bars. OCR sees nothing there. The 6 redacted names we know about were identified by Congress reviewing *originals*, not from these scans
3. **DataSets 2, 3, 5, 6, 7 have NO searchable text** — only PDFs. These can only be searched by opening the PDFs. This means we're missing content from those datasets in our `findstr` scans
4. **Line context:** `findstr` returns matching lines only, not surrounding context. For context, note line numbers and manually check
5. **Binary DataSet 8:** Contains Concordance/Relativity legal production files (VOL00008.DAT/.OPT) — professional legal review software needed
6. **Compressed archive:** `epstein-files-structured-full-20250204.tar.zst` has not been extracted — may contain additional organized versions

---

*Created: February 10, 2026*
*Part of THE TRUMP FILES — Evidence system*
