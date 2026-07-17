import { CURRENT_SCHEMA_VERSION, parseResumeDocument, type ResumeDocument } from "./schema";

type Migration = (document: Record<string, unknown>) => Record<string, unknown>;

const migrations: Record<string, { nextVersion: string; migrate: Migration }> = {
  "1.0.0": {
    nextVersion: "1.1.0",
    migrate: migrateFrom1_0_0To1_1_0
  }
};

export function migrateResumeDocument(input: unknown): ResumeDocument {
  if (!isRecord(input)) {
    throw new Error("Resume document must be an object.");
  }

  let document = { ...input };
  let version = String(document.schemaVersion ?? "");

  if (!version) {
    throw new Error("Resume document is missing schemaVersion.");
  }

  while (version !== CURRENT_SCHEMA_VERSION) {
    const migration = migrations[version];
    if (!migration) {
      throw new Error(`Unsupported resume schema version: ${version}`);
    }

    document = migration.migrate(document);
    version = migration.nextVersion;
    document.schemaVersion = version;
  }

  return parseResumeDocument(document);
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function migrateFrom1_0_0To1_1_0(input: Record<string, unknown>): Record<string, unknown> {
  const content = isRecord(input.content) ? input.content : {};
  const design = isRecord(input.design) ? input.design : {};
  const layout = isRecord(design.layout) ? design.layout : {};

  return {
    ...input,
    content: {
      ...content,
      testimonials: Array.isArray(content.testimonials) ? content.testimonials : []
    },
    design: {
      ...design,
      layout: {
        ...layout,
        showQrCode: typeof layout.showQrCode === "boolean" ? layout.showQrCode : false
      }
    }
  };
}
