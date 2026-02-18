# Methods

This file defines the processing rules used to build this archive so results are auditable and reproducible.

## Scope

- Input: publicly released source packages and derivatives used by this repository.
- Output: static pages, searchable extracts, and linked evidence views.

## Core definitions

### Blank page

A page is treated as blank when it contains no meaningful readable content after extraction/OCR, aside from possible scan noise or formatting residue.

### Duplicate

Duplicates are identified using deterministic matching rules in the processing pipeline. Depending on source type, matching may use one or more of:

- binary identity
- normalized text identity
- page-level structural identity

When two records are duplicates under the configured rules, one canonical record is retained for public navigation.

### OCR-derived text

OCR output is treated as machine-extracted text and may contain errors from scan quality, compression, skew, or artifacts.

## Counting rules

- File counts refer to artifacts included in this repository build, after exclusion rules.
- Page/document counts refer to pipeline records, not legal document boundaries.
- Word counts (when reported) are pipeline-derived approximations from extracted text and OCR output.

## Exclusion rules

Large binary artifacts are excluded from git where required for repository size and hosting constraints.

See `.gitignore` for current exclusion patterns.

## Reproducibility statement

Given the same input corpus, the same exclusion set, and the same pipeline rules/configuration, the resulting counts and indexes should be reproducible within normal OCR variance.

## Known sources of variance

- OCR engine/library version changes
- Different preprocessing parameters
- Corrupt/missing input artifacts
- Changes in normalization/dedup thresholds

## Verification workflow

1. Record exact input package set and versions/checksums.
2. Run pipeline with fixed configuration.
3. Compare output counts and key indexes against previous run artifacts.
4. Investigate any material deltas before publishing.
