# Architecture

TempleCV is a local-first desktop app for creating high-quality resumes with deterministic exports.

## Stack

- Electron for the desktop shell and bundled Chromium PDF rendering
- Vite for main, preload, and renderer builds
- React and TypeScript for the editor UI
- Zod for runtime validation and inferred document types
- ZIP-based `.resume` packages for portable documents with managed assets

## Module Boundaries

```text
src/main/       Electron windows, dialogs, file access, PDF print
src/preload/    narrow safe bridge for renderer calls
src/renderer/   React editor and preview UI
src/core/       schemas, validation, migrations, sample documents
src/storage/    .resume package packing and unpacking
src/templates/  HTML/CSS resume rendering
src/exporters/  target export contracts
```

`src/core`, `src/storage`, `src/templates`, and `src/exporters` should not depend on Electron. Electron remains a host boundary, not the product engine.

## Customization Model

Customization should be expressive but constrained:

- design tokens for color, typography, spacing, density, and page size
- template variants for layout choices
- managed image slots for headshots, logos, screenshots, and attachments
- section ordering and custom sections

Do not introduce a freeform canvas in the first product pass. It would make pagination, ATS export, and deterministic PDF output much harder.

## Export Principle

The app stores structured resume data, then renders outward:

```text
.resume package -> schema validation -> asset resolution -> template HTML/CSS -> export target
```

PDF, HTML, DOCX, and JSON are outputs. They are not the canonical editable source.
