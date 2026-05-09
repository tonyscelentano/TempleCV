import type { ResumeDocument } from "../../core/schema";
import { escapeHtml } from "../htmlEscape";

export function renderTestimonials(document: ResumeDocument): string {
  return document.content.testimonials.length > 0
    ? `<section data-section="testimonials"><h2>Social Proof</h2>${document.content.testimonials
        .map(
          (item) => `<article class="testimonial">
                <blockquote>"${escapeHtml(item.quote)}"</blockquote>
                <div class="author">
                  <strong>${escapeHtml(item.author)}</strong>${item.title ? `, ${escapeHtml(item.title)}` : ""}
                </div>
              </article>`
        )
        .join("")}</section>`
    : "";
}
