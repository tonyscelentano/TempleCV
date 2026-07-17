import type { ResumeContent } from "../../../core/schema";
import type { ContentUpdater } from "../types";

export function updateBasics<Key extends keyof ResumeContent["basics"]>(
  updateContent: ContentUpdater,
  key: Key,
  value: ResumeContent["basics"][Key]
) {
  updateContent((content) => ({
    ...content,
    basics: { ...content.basics, [key]: value }
  }));
}

export function updateExperience(
  updateContent: ContentUpdater,
  index: number,
  patch: Partial<ResumeContent["experience"][number]>
) {
  updateContent((content) => ({
    ...content,
    experience: replaceAt(content.experience, index, { ...content.experience[index], ...patch })
  }));
}

export function updateExperienceDate(
  updateContent: ContentUpdater,
  index: number,
  patch: Partial<ResumeContent["experience"][number]["dates"]>
) {
  updateContent((content) => {
    const item = content.experience[index];

    return {
      ...content,
      experience: replaceAt(content.experience, index, {
        ...item,
        dates: { ...item.dates, ...patch }
      })
    };
  });
}

export function updateProject(updateContent: ContentUpdater, index: number, patch: Partial<ResumeContent["projects"][number]>) {
  updateContent((content) => ({
    ...content,
    projects: replaceAt(content.projects, index, { ...content.projects[index], ...patch })
  }));
}

export function updateSkillGroup(updateContent: ContentUpdater, index: number, patch: Partial<ResumeContent["skills"][number]>) {
  updateContent((content) => ({
    ...content,
    skills: replaceAt(content.skills, index, { ...content.skills[index], ...patch })
  }));
}

export function updateEducation(updateContent: ContentUpdater, index: number, patch: Partial<ResumeContent["education"][number]>) {
  updateContent((content) => ({
    ...content,
    education: replaceAt(content.education, index, { ...content.education[index], ...patch })
  }));
}

export function updateTestimonial(updateContent: ContentUpdater, index: number, patch: Partial<ResumeContent["testimonials"][number]>) {
  updateContent((content) => ({
    ...content,
    testimonials: replaceAt(content.testimonials, index, { ...content.testimonials[index], ...patch })
  }));
}

function replaceAt<T>(items: T[], index: number, item: T): T[] {
  return items.map((existing, existingIndex) => (existingIndex === index ? item : existing));
}
