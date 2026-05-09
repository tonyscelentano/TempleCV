import { describe, expect, test } from "vitest";
import { sampleResume } from "../core/sampleResume";
import type { ResumeDocument } from "../core/schema";
import { packResumePackage, unpackResumePackage, type ResumePackageAsset } from "./resumePackage";

describe("resumePackage", () => {
  test("round-trips a document with no assets", async () => {
    const original: ResumeDocument = clone(sampleResume);
    const packed = await packResumePackage({ document: original, assets: [] });
    const unpacked = await unpackResumePackage(packed);

    expect(unpacked.document).toEqual(original);
    expect(unpacked.assets).toEqual([]);
  });

  test("round-trips a document with assets", async () => {
    const original: ResumeDocument = clone(sampleResume);
    const assetData = new Uint8Array([137, 80, 78, 71]); // fake PNG header
    const asset: ResumePackageAsset = {
      asset: {
        id: "test-asset",
        filename: "headshot.png",
        mediaType: "image/png",
        usage: "headshot",
        altText: "Profile photo"
      },
      data: assetData
    };

    original.assets = [asset.asset];

    const packed = await packResumePackage({ document: original, assets: [asset] });
    const unpacked = await unpackResumePackage(packed);

    expect(unpacked.document).toEqual(original);
    expect(unpacked.assets).toHaveLength(1);
    expect(unpacked.assets[0].asset.id).toBe("test-asset");
    expect(unpacked.assets[0].data).toEqual(assetData);
  });

  test("throws on a package missing resume.json", async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    zip.file("random.txt", "not a resume");
    const data = await zip.generateAsync({ type: "uint8array" });

    await expect(unpackResumePackage(data)).rejects.toThrow("resume.json is missing");
  });

  test("throws on a package missing a declared asset file", async () => {
    const doc: ResumeDocument = clone(sampleResume);
    doc.assets = [
      { id: "ghost", filename: "missing.png", mediaType: "image/png", usage: "headshot", altText: "" }
    ];

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    zip.file("resume.json", JSON.stringify(doc));
    // Intentionally NOT adding assets/missing.png
    const data = await zip.generateAsync({ type: "uint8array" });

    await expect(unpackResumePackage(data)).rejects.toThrow("missing asset missing.png");
  });
});

function clone(document: ResumeDocument): ResumeDocument {
  return JSON.parse(JSON.stringify(document)) as ResumeDocument;
}
