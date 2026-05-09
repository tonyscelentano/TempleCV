import type { ResumeAsset } from "../../../core/schema";
import type { ResumePackageAsset } from "../../../storage/resumePackage";

export function createAssetSources(assets: ResumePackageAsset[]): Record<string, string> {
  return Object.fromEntries(assets.map((item) => [item.asset.id, toDataUrl(item.asset.mediaType, item.data)]));
}

export function createAssetFilename(filename: string, existingAssets: ResumeAsset[]): string {
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  const extensionIndex = sanitized.lastIndexOf(".");
  const base = extensionIndex > 0 ? sanitized.slice(0, extensionIndex) : sanitized;
  const extension = extensionIndex > 0 ? sanitized.slice(extensionIndex) : "";
  let candidate = sanitized;
  let counter = 1;

  while (existingAssets.some((asset) => asset.filename === candidate)) {
    candidate = `${base}-${counter}${extension}`;
    counter += 1;
  }

  return candidate;
}

function toDataUrl(mediaType: string, data: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < data.length; index += chunkSize) {
    binary += String.fromCharCode(...data.slice(index, index + chunkSize));
  }

  return `data:${mediaType};base64,${btoa(binary)}`;
}
