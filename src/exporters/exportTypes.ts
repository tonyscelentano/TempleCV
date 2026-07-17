import type { ResumeDocument } from "../core/schema";

export type ExportTarget = "pdf" | "ats-pdf" | "html" | "docx" | "json";

export type ExportRequest = {
  document: ResumeDocument;
  target: ExportTarget;
};

export type ExportResult = {
  filename: string;
  mediaType: string;
  data: Uint8Array | string;
};

export type ResumeExporter = (request: ExportRequest) => Promise<ExportResult>;
