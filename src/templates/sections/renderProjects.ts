import type { ResumeDocument } from "../../core/schema";
import { escapeHtml } from "../htmlEscape";
import { renderProjectMedia } from "../renderAssets";
import { renderList } from "../renderCommon";
import type { RenderResumeHtmlOptions } from "../types";

export function renderProjects(document: ResumeDocument, options: RenderResumeHtmlOptions): string {
  return `<section data-section="projects"><h2>Projects</h2>${document.content.projects
    .map(
      (item) => `<article class="item">
            <h3>${escapeHtml(item.name)}</h3>
            ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ""}
            ${renderProjectMedia(document, item.assetIds, options)}
            ${renderList(item.highlights)}
          </article>`
    )
    .join("")}</section>`;
}
