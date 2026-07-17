# Export Pipeline

The export pipeline keeps the editable model separate from delivery formats.

```text
ResumeDocument
  -> validate
  -> migrate if needed
  -> resolve assets
  -> render template HTML
  -> export PDF, ATS PDF, HTML, DOCX, or JSON
```

## PDF

PDF is generated through Electron's bundled Chromium renderer using print CSS. The preview and PDF path should render from the same template HTML whenever possible.

## ATS PDF

ATS PDF should use the same content model with a stricter template:

- minimal images
- clear text hierarchy
- standard section names
- conservative typography
- no background graphics

Visual resumes and ATS resumes are separate export profiles, not separate source documents.

## DOCX

DOCX should be generated directly from the structured resume model. Do not convert PDF to DOCX.

## HTML and JSON

HTML is a portable visual export. JSON is a raw data export for interoperability and debugging.
