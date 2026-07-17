import type { ResumeContent } from "../../../core/schema";
import { createId } from "./id";

export function createExperience(): ResumeContent["experience"][number] {
  return {
    id: createId("exp"),
    company: "Company",
    role: "Role",
    location: "",
    dates: { start: "2026", present: true },
    assetIds: [],
    highlights: ["Describe the impact you delivered."]
  };
}

export function createProject(): ResumeContent["projects"][number] {
  return {
    id: createId("project"),
    name: "Project",
    summary: "Short project summary.",
    highlights: ["Add one result or feature."],
    assetIds: []
  };
}

export function createSkillGroup(): ResumeContent["skills"][number] {
  return {
    id: createId("skills"),
    label: "Skill group",
    items: ["Skill"]
  };
}

export function createEducation(): ResumeContent["education"][number] {
  return {
    id: createId("edu"),
    institution: "Institution",
    credential: "Credential",
    highlights: []
  };
}

export function createTestimonial(): ResumeContent["testimonials"][number] {
  return {
    id: createId("test"),
    quote: "A short, impactful quote.",
    author: "Name",
    title: "Title or Relationship"
  };
}
