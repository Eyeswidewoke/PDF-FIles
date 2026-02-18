# Contributing to THE PDF FILES

Thanks for wanting to help. This project exists because people like you give a damn.

## You don't need to be a developer

Seriously. The most valuable contributions are often from people who just **read the documents** and find things. If you can read a PDF and write a coherent sentence, you can contribute.

## Ways to contribute

### 1. Report what you find
Found something interesting in the documents? A connection we missed? A name that should be tracked?

- [Open a new Issue](https://github.com/Eyeswidewoke/PDF-FIles/issues/new) with what you found
- Include the **document ID** (e.g., `EFTA02284351`) and the **dataset** it came from
- Describe what you see and why it matters
- Separate what the document *says* from what you *think it means*

### 2. Fix errors
Found a broken link, wrong name, bad OCR text, or incorrect attribution?

- Use the issue templates (broken link, doc-ID correction, OCR error)
- Or just open a general issue describing the problem
- Include file paths and specific text so we can find it fast

### 3. Improve cast profiles
We track 148 key figures with profiles, connections, and document references. Many need work:

- Better summaries based on actual document content
- Missing connections that should be mapped
- Timeline events we haven't captured
- Corrections to roles, titles, or descriptions

### 4. Submit code changes
If you're a developer:

1. Fork the repository
2. Create a branch (`git checkout -b fix/broken-search-link`)
3. Make your changes
4. Test locally (`python -m http.server 8000`)
5. Submit a pull request with a clear description

### 5. Write or improve investigations
The investigation pages (`INVESTIGATION-*.md`) are living documents. You can:

- Add sourced findings with document IDs
- Improve clarity or organization
- Flag claims that need better sourcing
- Suggest new investigation threads

### 6. Mirror the site
The more copies that exist, the harder it is to suppress. See [`MIRROR.md`](./MIRROR.md).

---

## Ground rules

1. **Source everything.** Every claim must link back to a specific document ID or file path. Unsourced claims will be removed.

2. **Don't editorialize facts.** A document mentioning someone's name is not proof of wrongdoing. Present what the documents say, not what you want them to say.

3. **Keep changes focused.** One PR should do one thing. Don't bundle 15 unrelated changes.

4. **Protect privacy.** Follow the standards in [`ETHICS.md`](./ETHICS.md). Victims, minors, and uninvolved private individuals have boundaries.

5. **Be reproducible.** Prefer scripts and deterministic transforms over manual edits. If you changed 500 files, show the script that did it.

6. **No speculation as fact.** Mark uncertain readings, low-confidence OCR, and interpretive claims explicitly.

---

## Pull request expectations

- Keep PRs focused and small
- Include a short "what changed and why" summary
- Include exact file paths and doc IDs affected
- For count-impacting changes (new cast members, new artifacts), include before/after numbers
- Test that the site still works locally before submitting

## Review priority

1. **Data integrity** — factual correctness, sourcing
2. **Broken references** — dead links, missing files
3. **Reproducibility** — method consistency, scripted transforms
4. **UI/wording** — improvements that don't affect data

## First-time contributors

Never contributed to an open-source project before? Here's the simplest path:

1. Find something wrong (typo, broken link, missing info)
2. Click the file on GitHub and hit the pencil icon to edit
3. Make your fix
4. GitHub will automatically create a fork and PR for you
5. We'll review it and merge if it checks out

That's it. You don't need to know git. You don't need to install anything.

---

## Want to become a maintainer?

If you're interested in ongoing involvement — reviewing PRs, moderating discussions, helping with project direction — [open an issue](https://github.com/Eyeswidewoke/PDF-FIles/issues/new) and tell us about yourself and what you want to help with.

We're actively looking for:
- **Code reviewers** — people who can review PRs for technical quality
- **Content reviewers** — people who can verify document sourcing and accuracy
- **Moderators** — people who can help manage issues and discussions
- **Subject matter experts** — journalists, legal analysts, researchers with domain knowledge

---

*The documents belong to the public. So does this project.*
