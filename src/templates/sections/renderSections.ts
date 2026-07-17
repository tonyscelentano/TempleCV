import type { ResumeDocument } from "../../core/schema";
import type { RenderResumeHtmlOptions } from "../types";
import { renderEducation } from "./renderEducation";
import { renderExperience } from "./renderExperience";
import { renderProjects } from "./renderProjects";
import { renderSkills } from "./renderSkills";
import { renderSummary } from "./renderSummary";
import { renderTestimonials } from "./renderTestimonials";

export function renderSection(document: ResumeDocument, section: string, options: RenderResumeHtmlOptions): string {
  switch (section) {
    case "summary":
      return renderSummary(document);
    case "experience":
      return renderExperience(document, options);
    case "projects":
      return renderProjects(document, options);
    case "testimonials":
      return renderTestimonials(document);
    case "skills":
      return renderSkills(document);
    case "education":
      return renderEducation(document);
    default:
      return "";
  }
}
