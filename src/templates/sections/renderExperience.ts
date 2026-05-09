import type { ResumeDocument } from "../../core/schema";
import { renderDateRange, renderList } from "../renderCommon";
import { renderEntryLogo } from "../renderAssets";
import { escapeHtml } from "../htmlEscape";
import type { RenderResumeHtmlOptions } from "../types";

export function renderExperience(document: ResumeDocument, options: RenderResumeHtmlOptions): string {
  return `<section data-section="experience"><h2>Experience</h2>${document.content.experience
    .map((item) => {
      const logoHtml = renderEntryLogo(document, item.assetIds, options);
      const hasLogo = logoHtml !== "";
      return `<article class="item${hasLogo ? " has-logo" : ""}">
            <div class="entry-header">
              ${logoHtml}
              <h3>${escapeHtml(item.company)}</h3>
            </div>
            <div class="entry-body">
              <p class="meta">${escapeHtml(item.role)} · ${escapeHtml(renderDateRange(item.dates))}${
                item.location ? ` · ${escapeHtml(item.location)}` : ""
              }</p>
              ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ""}
              ${renderList(item.highlights)}
            </div>
          </article>`;
    })
    .join("")}</section>`;
}
