import type { ResumeDocument } from "../core/schema";
import { escapeHtml } from "./htmlEscape";
import { renderContact } from "./renderCommon";
import { renderIdentityImage } from "./renderAssets";
import { renderPrintCss } from "./renderPrintCss";
import { renderQrCode } from "./renderQrCode";
import { renderSection } from "./sections/renderSections";
import type { RenderResumeHtmlOptions } from "./types";

export type { RenderResumeHtmlOptions } from "./types";

export function renderResumeHtml(document: ResumeDocument, options: RenderResumeHtmlOptions = {}): string {
  const { content, design } = document;
  const exportMode = options.exportMode ?? "visual";
  const sections = design.layout.sectionOrder.map((section) => renderSection(document, section, options)).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(document.title)}</title>
  <style>
    ${renderPrintCss(document, exportMode)}
    ${renderPreviewCss(exportMode)}
  </style>
</head>
<body>
  <main class="resume ${exportMode === "ats" ? "ats" : "visual"}">
    <header class="masthead" data-section="basics">
      <div>
        <h1>${escapeHtml(content.basics.fullName)}</h1>
        <p class="headline">${escapeHtml(content.basics.headline)}</p>
      </div>
      <div class="identity">
        ${design.layout.showQrCode ? renderQrCode(document) : ""}
        ${renderIdentityImage(document, options)}
        <div class="contact">${renderContact(document)}</div>
      </div>
    </header>
    ${sections}
  </main>
  ${renderPreviewBridge(exportMode)}
</body>
</html>`;
}

function renderPreviewCss(exportMode: RenderResumeHtmlOptions["exportMode"]): string {
  if (exportMode === "ats") {
    return "";
  }

  return `
      header.masthead, section[data-section] {
        position: relative;
        cursor: pointer;
        transition: background-color 0.15s ease;
        border-radius: 8px;
        padding-inline: 16px;
        margin-inline: -16px;
      }
      header.masthead:hover, section[data-section]:hover {
        background-color: rgba(128, 128, 128, 0.05);
      }
      header.masthead:active, section[data-section]:active {
        background-color: rgba(128, 128, 128, 0.08);
      }
    `;
}

function renderPreviewBridge(exportMode: RenderResumeHtmlOptions["exportMode"]): string {
  if (exportMode === "ats") {
    return "";
  }

  return `
  <script>
    document.addEventListener('click', (e) => {
      const sectionEl = e.target.closest('[data-section]');
      if (sectionEl) {
        const sectionName = sectionEl.getAttribute('data-section');
        window.parent.postMessage({ type: 'focus-section', section: sectionName }, '*');
      }
    });
  </script>
  `;
}
