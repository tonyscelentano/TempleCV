# TempleCV

## Project Overview
TempleCV is a local-first desktop application for creating high-quality resumes with deterministic exports. It uses a structured resume document model, with versioned schema validation and a ZIP-based `.resume` package format for portable documents that include managed assets.

**Main Technologies:**
- Electron
- React
- Vite
- TypeScript
- Zod (for runtime validation and inferred document types)

## Directory Structure
- `src/main/`: Electron main process handling windows, dialogs, file access, and PDF printing.
- `src/preload/`: Narrow safe bridge for renderer calls (IPC).
- `src/renderer/`: React-based editor and preview UI.
- `src/core/`: Schemas, validation logic, migrations, and sample documents.
- `src/storage/`: Logic for packing and unpacking the ZIP-based `.resume` package format.
- `src/templates/`: HTML/CSS templates for resume rendering.
- `src/exporters/`: Target export contracts (PDF, ATS PDF, HTML, DOCX, JSON).

## Building and Running

Use the following commands to work with the project:

- **Install dependencies:** `npm install --cache .npm-cache`
- **Start the app:** `npm start`
- **Typecheck:** `npm run typecheck`
- **Build:** `npm run build`
- **Package for distribution:** `npm run package`
- **Make installers:** `npm run make`

## Development Conventions

- **Module Boundaries:** `src/core`, `src/storage`, `src/templates`, and `src/exporters` should remain framework-agnostic and should not depend on Electron. Electron is strictly the host boundary.
- **Customization Model:** Emphasizes constrained customization using design tokens, template variants, and managed image slots rather than a freeform canvas.
- **Data Flow:** The application works by taking structured resume data (`resume.json` inside the `.resume` package), validating it against a schema, resolving assets, generating HTML/CSS templates, and finally producing the export target. PDF, HTML, DOCX, and JSON are strictly read-only outputs generated from the canonical editable source.
- **Migrations:** Must be deterministic pure functions. They may restructure data but should not rewrite user content.
