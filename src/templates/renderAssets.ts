import type { ResumeAsset, ResumeDocument } from "../core/schema";
import { escapeAttribute } from "./htmlEscape";
import type { RenderResumeHtmlOptions } from "./types";

export function renderEntryLogo(document: ResumeDocument, assetIds: string[], options: RenderResumeHtmlOptions): string {
  if ((options.exportMode ?? "visual") === "ats" || document.design.layout.imageMode === "none") {
    return "";
  }

  const asset = document.assets.find((candidate) => assetIds.includes(candidate.id) && candidate.usage === "logo");
  const source = asset ? options.assetSources?.[asset.id] : undefined;

  if (!asset || !source) {
    return "";
  }

  return `<img class="entry-logo" src="${escapeAttribute(source)}" alt="${escapeAttribute(asset.altText)}">`;
}

export function renderIdentityImage(document: ResumeDocument, options: RenderResumeHtmlOptions): string {
  if ((options.exportMode ?? "visual") === "ats" || document.design.layout.imageMode === "none") {
    return "";
  }

  const asset = findFirstAsset(document.assets, ["logo", "headshot"]);
  const source = asset ? options.assetSources?.[asset.id] : undefined;

  if (!asset || !source) {
    return "";
  }

  return `<img class="identity-image ${asset.usage === "logo" ? "logo" : "headshot"}" src="${escapeAttribute(source)}" alt="${escapeAttribute(
    asset.altText
  )}">`;
}

export function renderProjectMedia(document: ResumeDocument, assetIds: string[], options: RenderResumeHtmlOptions): string {
  if ((options.exportMode ?? "visual") === "ats" || document.design.layout.imageMode === "none") {
    return "";
  }

  const assets = document.assets.filter(
    (candidate) => assetIds.includes(candidate.id) && (candidate.usage === "project-screenshot" || candidate.usage === "attachment")
  );
  const images = assets
    .map((asset) => {
      const source = options.assetSources?.[asset.id];
      return source ? `<img class="project-media" src="${escapeAttribute(source)}" alt="${escapeAttribute(asset.altText)}">` : "";
    })
    .filter(Boolean);

  if (images.length === 0) {
    return "";
  }

  return `<div class="project-media-grid ${images.length === 1 ? "single" : ""}">${images.join("")}</div>`;
}

function findFirstAsset(assets: ResumeAsset[], usage: ResumeAsset["usage"][]): ResumeAsset | undefined {
  return assets.find((asset) => usage.includes(asset.usage));
}
