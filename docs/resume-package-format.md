# Resume Package Format

A `.resume` file is a ZIP container with a stable internal structure.

```text
my-resume.resume
  resume.json
  assets/
    headshot.webp
    logo.svg
    project-shot.png
```

## `resume.json`

`resume.json` is the canonical editable document.

Top-level fields:

- `documentType`: currently `resume`
- `schemaVersion`: current document schema version
- `id`: document id
- `title`: user-facing document title
- `template`: selected template id and variant
- `content`: structured resume content
- `design`: design tokens and layout preferences
- `assets`: metadata for files in `assets/`
- `metadata`: app and timestamp metadata

## Assets

Assets are referenced by metadata in `resume.json` and stored as binary files under `assets/`.

Supported usage values:

- `headshot`
- `logo`
- `project-screenshot`
- `background`
- `attachment`

Asset records should include alt text and optional normalized crop data. Missing asset files make the package invalid.

## Placement Workflow

Assets are imported once, then assigned where they belong:

- company logos use `logo` and are attached to experience entries
- project/product images use `project-screenshot` and are attached to project entries
- headshots use `headshot` and are rendered only by templates that support identity imagery
- attachments are stored for future export/profile use, but should not be rendered by default

The editable asset record controls usage and alt text. Section records keep only asset IDs so imported media can be reused without duplicating binary data.

## Versioning

Migrations must be deterministic pure functions. They may restructure document data, but they should not rewrite user content or improve wording.

Unknown future schema versions should not be silently modified.
