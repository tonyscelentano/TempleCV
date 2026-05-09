import JSZip from "jszip";
import { migrateResumeDocument } from "../core/migrations";
import type { ResumeAsset, ResumeDocument } from "../core/schema";

export type ResumePackageAsset = {
  asset: ResumeAsset;
  data: Uint8Array;
};

export type ResumePackage = {
  document: ResumeDocument;
  assets: ResumePackageAsset[];
};

const RESUME_JSON_PATH = "resume.json";
const ASSETS_DIR = "assets";

export async function packResumePackage(pkg: ResumePackage): Promise<Uint8Array> {
  const zip = new JSZip();
  zip.file(RESUME_JSON_PATH, JSON.stringify(pkg.document, null, 2));

  for (const item of pkg.assets) {
    zip.file(`${ASSETS_DIR}/${item.asset.filename}`, item.data);
  }

  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}

export async function unpackResumePackage(data: Uint8Array): Promise<ResumePackage> {
  const zip = await JSZip.loadAsync(data);
  const resumeJson = zip.file(RESUME_JSON_PATH);

  if (!resumeJson) {
    throw new Error("Invalid .resume package: resume.json is missing.");
  }

  const document = migrateResumeDocument(JSON.parse(await resumeJson.async("string")));
  const assets = await Promise.all(
    document.assets.map(async (asset) => {
      const file = zip.file(`${ASSETS_DIR}/${asset.filename}`);
      if (!file) {
        throw new Error(`Invalid .resume package: missing asset ${asset.filename}.`);
      }

      return {
        asset,
        data: await file.async("uint8array")
      };
    })
  );

  return { document, assets };
}
