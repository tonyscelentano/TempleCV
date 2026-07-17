import type { ResumeDocument } from "../core/schema";
import { escapeHtml } from "./htmlEscape";

export function renderContact(document: ResumeDocument): string {
  const basics = document.content.basics;
  const contact = [basics.email, basics.phone, basics.location, ...basics.links.map((link) => link.label)].filter(Boolean);

  return contact.map((item) => `<div>${escapeHtml(String(item))}</div>`).join("");
}

export function renderDateRange(dates: { start: string; end?: string; present: boolean }): string {
  return `${dates.start} – ${dates.present ? "Present" : (dates.end ?? "")}`;
}

export function renderList(items: string[]): string {
  return items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
}
