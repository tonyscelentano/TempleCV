import type { ResumeDocument } from "../core/schema";
import type { ExportMode } from "./types";

export function renderPrintCss(document: ResumeDocument, exportMode: ExportMode): string {
  const { design } = document;
  const visual = exportMode === "visual";
  const background = visual ? design.color.background : "#ffffff";
  const foreground = visual ? design.color.foreground : "#111827";
  const accent = visual ? design.color.accent : "#111827";
  const muted = visual ? design.color.muted : "#4b5563";
  const rule = visual ? "#2a2a2a" : "#d1d5db";
  const surface = visual ? "#161616" : "#ffffff";

  const isA4 = design.layout.pageSize === "a4";
  const resumeWidth = isA4 ? "210mm" : "8.5in";
  const resumeMinHeight = isA4 ? "297mm" : "11in";

  let baseSpacing = 24;
  let itemSpacing = 18;
  if (design.layout.density === "compact") {
    baseSpacing = 16;
    itemSpacing = 10;
  } else if (design.layout.density === "spacious") {
    baseSpacing = 32;
    itemSpacing = 26;
  }

  const isExpressive = design.layout.imageMode === "expressive";
  const identitySize = isExpressive ? 80 : 60;
  const logoSize = isExpressive ? 72 : 54;
  const logoGap = isExpressive ? 16 : 12;
  const bodyIndent = logoSize + logoGap;

  return `
    @page { size: ${design.layout.pageSize}; margin: 0.5in; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: ${background};
      color: ${foreground};
      font-family: ${fontStack(design.typography.bodyFont)};
      font-size: ${design.typography.baseSize}pt;
      line-height: 1.58;
    }
    .resume {
      width: min(${resumeWidth}, calc(100vw - 32px));
      min-height: ${resumeMinHeight};
      margin: 0 auto;
      padding: ${visual ? "0.62in 0.54in" : "0.5in"};
      background: ${background};
      box-shadow: none;
    }
    .masthead {
      display: flex;
      justify-content: space-between;
      gap: 32px;
      padding-bottom: ${baseSpacing - 2}px;
      margin-bottom: ${baseSpacing}px;
      border-bottom: 1px solid ${rule};
    }
    h1, h2, h3 {
      font-family: ${fontStack(design.typography.headingFont)};
      margin: 0;
      letter-spacing: 0;
    }
    h1 {
      color: ${accent};
      font-size: ${visual ? "27pt" : "22pt"};
      line-height: 1;
      font-weight: 720;
    }
    h2 {
      color: ${muted};
      font-size: 7.8pt;
      margin: ${baseSpacing}px 0 13px;
      padding-bottom: 6px;
      border-bottom: 1px solid ${visual ? "#1f1f1f" : rule};
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    h3 {
      color: ${accent};
      font-size: 11pt;
      font-weight: 650;
    }
    p { margin: 0; }
    ul { margin: 7px 0 0; padding-left: 17px; }
    li { margin: 2px 0; }
    section { margin-bottom: ${baseSpacing}px; }
    .headline {
      color: ${muted};
      margin-top: 8px;
      font-size: 9pt;
      letter-spacing: ${visual ? "0.8px" : "0"};
      text-transform: ${visual ? "uppercase" : "none"};
    }
    .contact {
      color: ${muted};
      font-size: 8.4pt;
      text-align: right;
      white-space: nowrap;
    }
    .identity {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }
    .qr-code {
      width: ${identitySize}px;
      height: ${identitySize}px;
      border: 1px solid ${rule};
      border-radius: 6px;
      background: #ffffff;
      padding: 4px;
    }
    .qr-code svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .identity-image {
      width: ${identitySize}px;
      height: ${identitySize}px;
      border: 1px solid ${rule};
      border-radius: 6px;
      object-fit: cover;
    }
    .identity-image.logo {
      object-fit: contain;
      padding: 6px;
      background: ${surface};
    }
    .item { margin-top: 18px; }
    .entry-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 5px;
    }
    .entry-logo {
      width: 54px;
      height: 54px;
      flex: 0 0 54px;
      border-radius: 6px;
      background: ${surface};
      border: 1px solid ${rule};
      object-fit: contain;
    }
    .has-logo .entry-body {
      ${visual ? `margin-left: ${bodyIndent}px;` : ""}
    }
    .meta { color: ${muted}; font-size: 8.5pt; margin-top: 2px; }
    .project-media {
      display: block;
      width: 100%;
      max-height: 1.8in;
      border: 1px solid ${rule};
      border-radius: 6px;
      object-fit: cover;
    }
    .project-media-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      margin-top: 10px;
    }
    .project-media-grid.single {
      grid-template-columns: 1fr;
    }
    .skills { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; }
    .testimonial {
      margin-top: ${itemSpacing}px;
      padding-left: 18px;
      border-left: 3px solid ${accent};
    }
    .testimonial blockquote {
      margin: 0;
      font-size: 10pt;
      font-style: italic;
      color: ${foreground};
    }
    .testimonial .author {
      margin-top: 8px;
      font-size: 8.5pt;
      color: ${muted};
    }
    .testimonial .author strong {
      color: ${accent};
      font-weight: 650;
    }
    @media print {
      body { background: white; }
      .resume {
        width: auto;
        min-height: auto;
        margin: 0;
        box-shadow: none;
      }
      header.masthead, section[data-section] {
        padding-inline: 0;
        margin-inline: 0;
      }
    }
  `;
}

function fontStack(font: string): string {
  return `"${font}", "Segoe UI", Arial, sans-serif`;
}
