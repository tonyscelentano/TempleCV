import type { ResumeDocument } from "../../core/schema";
import { escapeHtml } from "../htmlEscape";
import { renderDateRange, renderList } from "../renderCommon";

export function renderEducation(document: ResumeDocument): string {
  return `<section data-section="education"><h2>Education</h2>${document.content.education
    .map(
      (item) => `<article class="item">
            <h3>${escapeHtml(item.credential)}</h3>
            <p class="meta">${escapeHtml(item.institution)}${item.location ? ` · ${escapeHtml(item.location)}` : ""}${
              item.dates ? ` · ${escapeHtml(renderDateRange(item.dates))}` : ""
            }</p>
            ${renderList(item.highlights)}
          </article>`
    )
    .join("")}</section>`;
}
