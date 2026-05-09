import type { ResumeDocument } from "../../core/schema";
import { escapeHtml } from "../htmlEscape";

export function renderSkills(document: ResumeDocument): string {
  return `<section data-section="skills"><h2>Skills</h2><div class="skills">${document.content.skills
    .map((group) => `<p><strong>${escapeHtml(group.label)}</strong><br>${escapeHtml(group.items.join(", "))}</p>`)
    .join("")}</div></section>`;
}
