import { describe, expect, test } from "vitest";
import { migrateResumeDocument } from "./migrations";
import { CURRENT_SCHEMA_VERSION, type ResumeDocument } from "./schema";
import { sampleResume } from "./sampleResume";

describe("migrateResumeDocument", () => {
  test("migrates 1.0.0 documents to the current schema", () => {
    const legacyDocument = clone(sampleResume) as unknown as Record<string, any>;
    legacyDocument.schemaVersion = "1.0.0";
    delete legacyDocument.content.testimonials;
    delete legacyDocument.design.layout.showQrCode;

    const migrated = migrateResumeDocument(legacyDocument);

    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(migrated.content.testimonials).toEqual([]);
    expect(migrated.design.layout.showQrCode).toBe(false);
  });
});

function clone(document: ResumeDocument): ResumeDocument {
  return JSON.parse(JSON.stringify(document)) as ResumeDocument;
}
