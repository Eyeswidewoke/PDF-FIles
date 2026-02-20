# Dataset File Index

Complete filename inventories and per-file metadata for all 12 official DOJ Epstein File datasets.
**900,956 files** \u00b7 **140 GB** \u00b7 **2,083,211 pages** \u00b7 **343 million words** \u2014 downloaded directly from [justice.gov/epstein](https://www.justice.gov/epstein).

> \U0001F534 **[Browse interactively \u2192](https://eyeswidewoke.github.io/PDF-FIles/dataset-file-index.html)**

---

## What's here

### Filename indexes
Every filename from each DOJ dataset, in both plain-text and CSV format.

| File | Description |
|------|-------------|
| `dataset-index.json` | Machine-readable metadata: file counts, sizes, page counts, word counts, download dates |
| `DataSet{1-12}-files.txt` | One filename per line \u2014 raw file lists |
| `DataSet{1-12}-files.csv` | Same data in CSV format |
| `dataset-counts.csv` | Summary: dataset name, file count |

### Per-file metadata
Every file with its size in bytes, page count, and word count.

| File | Description |
|------|-------------|
| `file-metadata.csv` | All 900,956 files: `efta, dataset, file_size_bytes, pages, words` |
| `DataSet{1-12}-metadata.csv` | Same data split per dataset: `efta, file_size_bytes, pages, words` |

> **SHA256 checksums** are being computed and will be added as `file-metadata-sha256.csv` when complete.

---

## Dataset overview

| Dataset | Files | Size | Pages | Words | EFTA Range | Downloaded |
|---------|------:|-----:|------:|------:|------------|------------|
| DS 1 | 3,158 | 1.2 GB | 3 | 700 | `EFTA00000001` \u2192 `EFTA00003158` | Feb 12, 2026 |
| DS 2 | 574 | 0.6 GB | 52 | 598 | `EFTA00003159` \u2192 `EFTA00003857` | Feb 12, 2026 |
| DS 3 | 67 | 0.6 GB | 1,088 | 29,464 | `EFTA00003858` \u2192 `EFTA00005586` | Feb 12, 2026 |
| DS 4 | 152 | 0.3 GB | 1,420 | 351,970 | `EFTA00005705` \u2192 `EFTA00008320` | Feb 12, 2026 |
| DS 5 | 120 | 0.1 GB | 105 | 11,377 | `EFTA00008409` \u2192 `EFTA00008528` | Feb 12, 2026 |
| DS 6 | 13 | 0.1 GB | 689 | 133,652 | `EFTA00008529` \u2192 `EFTA00008998` | Feb 12, 2026 |
| DS 7 | 17 | 0.1 GB | 798 | 162,760 | `EFTA00009016` \u2192 `EFTA00009664` | Feb 12, 2026 |
| DS 8 | 10,595 | 1.8 GB | 28,828 | 5,846,460 | `EFTA00009676` \u2192 `EFTA00039023` | Feb 12, 2026 |
| DS 9 | 252,169 | 53.9 GB | 703,551 | 151,077,233 | `EFTA00039025` \u2192 `EFTA01262781` | Feb 11, 2026 |
| DS 10 | 302,284 | 54.4 GB | 631,302 | 101,393,478 | `EFTA01262782` \u2192 `EFTA01926086` | Feb 12, 2026 |
| DS 11 | 331,655 | 26.8 GB | 714,435 | 83,838,400 | `EFTA02212883` \u2192 `EFTA02730262` | Feb 12, 2026 |
| DS 12 | 152 | 0.1 GB | 940 | 179,739 | `EFTA02730265` \u2192 `EFTA02731783` | Feb 12, 2026 |
| **Total** | **900,956** | **140.0 GB** | **2,083,211** | **343,025,831** | | |

### Known EFTA numbering gaps

| Between | Gap (EFTA IDs) | Notes |
|---------|---------------:|-------|
| DS 3 \u2192 DS 4 | 119 | |
| DS 4 \u2192 DS 5 | 89 | |
| DS 7 \u2192 DS 8 | 12 | |
| DS 8 \u2192 DS 9 | 2 | |
| DS 9 \u2192 DS 10 | 1 | |
| **DS 10 \u2192 DS 11** | **286,796** | Largest gap \u2014 ~287K unreleased EFTA IDs |
| DS 11 \u2192 DS 12 | 3 | |

---

## How to use

### Compare your files to ours

```bash
# Download our DS10 file list
curl -O https://raw.githubusercontent.com/Eyeswidewoke/PDF-FIles/main/data/dataset-file-index/DataSet10-files.txt

# Generate your local file list
ls /path/to/your/DataSet10/ | sort > my-ds10.txt

# Diff
comm -23 DataSet10-files.txt my-ds10.txt   # files we have that you don't
comm -13 DataSet10-files.txt my-ds10.txt   # files you have that we don't
```

### Verify file integrity with metadata

```bash
# Download per-file metadata
curl -O https://raw.githubusercontent.com/Eyeswidewoke/PDF-FIles/main/data/dataset-file-index/DataSet10-metadata.csv

# Check: do your file sizes match ours?
python3 -c "
import csv, os
with open('DataSet10-metadata.csv') as f:
    for row in csv.DictReader(f):
        local = f'/path/to/DataSet10/{row[\"efta\"]}.pdf'
        if os.path.exists(local):
            actual = os.path.getsize(local)
            expected = int(row['file_size_bytes'])
            if actual != expected:
                print(f'SIZE MISMATCH: {row[\"efta\"]} expected={expected} actual={actual}')
"
```

### Load the metadata programmatically

```python
import json, urllib.request
url = "https://raw.githubusercontent.com/Eyeswidewoke/PDF-FIles/main/data/dataset-file-index/dataset-index.json"
meta = json.loads(urllib.request.urlopen(url).read())
for ds in meta["datasets"]:
    print(f"{ds['id']:>4}: {ds['file_count']:>7,} files  {ds['total_size_bytes']/1024**3:.1f} GB  {ds['total_pages']:,} pages")
```

---

## Help us verify completeness

> \u26A0\uFE0F **These counts reflect our downloads from Feb 11-12, 2026.** The DOJ has been updating datasets since. If your counts differ, please let us know so we can track what's changed.

**[Open a comparison issue \u2192](https://github.com/Eyeswidewoke/PDF-FIles/issues/new?title=Dataset+file+count+mismatch&body=My+counts:%0A%0ADS1:+%0ADS2:+%0A...)**
