import type { ResumeContent, ResumeDocument } from "../../core/schema";

export type ContentUpdater = (updater: (content: ResumeContent) => ResumeContent) => void;
export type DesignUpdater = (updater: (design: ResumeDocument["design"]) => ResumeDocument["design"]) => void;
