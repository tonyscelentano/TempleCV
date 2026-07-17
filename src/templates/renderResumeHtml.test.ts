import { describe, expect, test } from "vitest";
import type { ResumeDocument } from "../core/schema";
import { sampleResume } from "../core/sampleResume";
import { renderResumeHtml } from "./renderResumeHtml";

describe("renderResumeHtml", () => {
  test("renders education highlights exposed by the form", () => {
    const document = clone(sampleResume);
    document.content.education[0].highlights = ["Capstone in document automation"];

    const html = renderResumeHtml(document);

    expect(html).toContain("Capstone in document automation");
  });

  test("does not mark experience entries as logo-indented when no logo is attached", () => {
    const html = renderResumeHtml(sampleResume);

    expect(html).not.toContain('class="item has-logo"');
  });

  test("renders project media in visual mode and omits it in ATS mode", () => {
    const document = clone(sampleResume);
    document.assets = [
      {
        id: "asset-project-screenshot",
        filename: "project.png",
        mediaType: "image/png",
        usage: "project-screenshot",
        altText: "Project dashboard screenshot"
      }
    ];
    document.content.projects[0].assetIds = ["asset-project-screenshot"];

    const visualHtml = renderResumeHtml(document, {
      assetSources: { "asset-project-screenshot": "data:image/png;base64,abc123" }
    });
    const atsHtml = renderResumeHtml(document, {
      assetSources: { "asset-project-screenshot": "data:image/png;base64,abc123" },
      exportMode: "ats"
    });

    expect(visualHtml).toContain("project-media-grid single");
    expect(visualHtml).toContain("Project dashboard screenshot");
    expect(atsHtml).not.toContain('<img class="project-media"');
  });

  test("renders QR codes with scan-safe colors independent of palette", () => {
    const document = clone(sampleResume);
    document.design.layout.showQrCode = true;
    document.design.color.foreground = "#f8fafc";
    document.design.color.background = "#0f172a";

    const html = renderResumeHtml(document);

    expect(html).toContain("fill:#111111");
    expect(html).toContain("fill:#ffffff");
    expect(html).toContain("background: #ffffff;");
    expect(html).not.toContain("fill:#f8fafc");
  });
});

function clone(document: ResumeDocument): ResumeDocument {
  return JSON.parse(JSON.stringify(document)) as ResumeDocument;
}
