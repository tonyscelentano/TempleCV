import type { ResumeDocument } from "../../core/schema";
import { escapeHtml } from "../htmlEscape";

export function renderSummary(document: ResumeDocument): string {
  return document.content.summary ? `<section data-section="basics"><h2>Summary</h2><p>${escapeHtml(document.content.summary)}</p></section>` : "";
}
