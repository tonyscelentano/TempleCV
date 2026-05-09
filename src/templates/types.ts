export type ExportMode = "visual" | "ats";

export type RenderResumeHtmlOptions = {
  assetSources?: Record<string, string>;
  exportMode?: ExportMode;
};
