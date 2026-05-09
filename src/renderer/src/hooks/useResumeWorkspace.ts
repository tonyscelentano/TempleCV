import { useMemo, useState } from "react";
import { sampleResume } from "../../../core/sampleResume";
import type { ResumeAsset, ResumeContent, ResumeDocument } from "../../../core/schema";
import { packResumePackage, unpackResumePackage, type ResumePackageAsset } from "../../../storage/resumePackage";
import { renderResumeHtml } from "../../../templates/renderResumeHtml";
import { exportResumeDocx } from "../../../exporters/exportDocx";
import { createAssetFilename, createAssetSources } from "../lib/assets";
import { createId } from "../lib/id";
import { createEducation, createExperience, createProject, createSkillGroup, createTestimonial } from "../lib/resumeFactories";
import { slugify, stripExtension } from "../lib/text";

export function useResumeWorkspace() {
  const [document, setDocument] = useState<ResumeDocument>(sampleResume);
  const [packageAssets, setPackageAssets] = useState<ResumePackageAsset[]>([]);
  const [status, setStatus] = useState("Ready");
  const [isDirty, setIsDirty] = useState(false);
  const assetSources = useMemo(() => createAssetSources(packageAssets), [packageAssets]);
  const previewHtml = useMemo(() => renderResumeHtml(document, { assetSources }), [assetSources, document]);

  function updateContent(updater: (content: ResumeContent) => ResumeContent) {
    setDocument((current) => ({
      ...current,
      content: updater(current.content),
      metadata: { ...current.metadata, updatedAt: new Date().toISOString() }
    }));
    setIsDirty(true);
  }

  function updateDesign(updater: (design: ResumeDocument["design"]) => ResumeDocument["design"]) {
    setDocument((current) => ({
      ...current,
      design: updater(current.design),
      metadata: { ...current.metadata, updatedAt: new Date().toISOString() }
    }));
    setIsDirty(true);
  }

  function addExperience() {
    updateContent((content) => ({ ...content, experience: [...content.experience, createExperience()] }));
    setStatus("Added role");
  }

  function addProject() {
    updateContent((content) => ({ ...content, projects: [...content.projects, createProject()] }));
    setStatus("Added project");
  }

  function addSkillGroup() {
    updateContent((content) => ({ ...content, skills: [...content.skills, createSkillGroup()] }));
    setStatus("Added skill group");
  }

  function addEducation() {
    updateContent((content) => ({ ...content, education: [...content.education, createEducation()] }));
    setStatus("Added education");
  }

  function addTestimonial() {
    updateContent((content) => ({ ...content, testimonials: [...content.testimonials, createTestimonial()] }));
    setStatus("Added testimonial");
  }

  async function openPackage() {
    try {
      if (isDirty) {
        const confirmed = window.confirm("You have unsaved changes. Open a different resume and discard them?");
        if (!confirmed) {
          return;
        }
      }

      const result = await window.templeCV.openPackage();
      if (!result) {
        return;
      }

      const pkg = await unpackResumePackage(result.data);
      setDocument(pkg.document);
      setPackageAssets(pkg.assets);
      setIsDirty(false);
      setStatus(`Opened ${result.path}`);
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  }

  async function savePackage() {
    try {
      const data = await packResumePackage({ document, assets: packageAssets });
      const savedPath = await window.templeCV.savePackage(data, `${slugify(document.title)}.resume`);

      if (savedPath) {
        setIsDirty(false);
        setStatus(`Saved ${savedPath}`);
      }
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  }

  async function exportPdf(atsMode: boolean) {
    try {
      const suggestedName = `${slugify(document.title)}${atsMode ? "-ats" : ""}.pdf`;
      const html = renderResumeHtml(document, { assetSources, exportMode: atsMode ? "ats" : "visual" });
      const exportedPath = await window.templeCV.exportPdf(html, suggestedName, atsMode);

      if (exportedPath) {
        setStatus(`Exported ${exportedPath}`);
      }
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  }

  async function importAsset(usage: ResumeAsset["usage"]): Promise<ResumeAsset | null> {
    const result = await window.templeCV.importAsset();
    if (!result) {
      setStatus("Asset import cancelled");
      return null;
    }

    const asset = addAssetData(usage, result.filename, result.mediaType, new Uint8Array(result.data));
    setStatus(`Imported ${result.filename}`);
    return asset;
  }

  async function importAssetFile(usage: ResumeAsset["usage"], file: File): Promise<ResumeAsset> {
    const data = new Uint8Array(await file.arrayBuffer());
    const asset = addAssetData(usage, file.name, file.type || "application/octet-stream", data);

    setStatus(`Imported ${file.name}`);
    return asset;
  }

  function updateAsset(assetId: string, patch: Partial<Pick<ResumeAsset, "altText" | "usage">>) {
    setDocument((current) => {
      const nextAssets = current.assets.map((asset) => (asset.id === assetId ? { ...asset, ...patch } : asset));

      return {
        ...current,
        assets: nextAssets,
        metadata: { ...current.metadata, updatedAt: new Date().toISOString() }
      };
    });
    setPackageAssets((current) =>
      current.map((item) => (item.asset.id === assetId ? { ...item, asset: { ...item.asset, ...patch } } : item))
    );
  }

  function removeAsset(assetId: string) {
    setDocument((current) => ({
      ...current,
      assets: current.assets.filter((asset) => asset.id !== assetId),
      content: {
        ...current.content,
        // Clean the removed asset ID from every section that can reference assets
        experience: current.content.experience.map((item) => ({
          ...item,
          assetIds: item.assetIds.filter((id) => id !== assetId)
        })),
        projects: current.content.projects.map((project) => ({
          ...project,
          assetIds: project.assetIds.filter((id) => id !== assetId)
        }))
      },
      metadata: { ...current.metadata, updatedAt: new Date().toISOString() }
    }));
    setPackageAssets((current) => current.filter((item) => item.asset.id !== assetId));
  }

  function addAssetData(usage: ResumeAsset["usage"], filename: string, mediaType: string, data: Uint8Array): ResumeAsset {
    const asset: ResumeAsset = {
      id: createId("asset"),
      filename: createAssetFilename(filename, document.assets),
      mediaType,
      usage,
      altText: stripExtension(filename)
    };

    setDocument((current) => ({
      ...current,
      assets: [...current.assets, asset],
      metadata: { ...current.metadata, updatedAt: new Date().toISOString() }
    }));
    setPackageAssets((current) => [...current, { asset, data }]);
    return asset;
  }

  async function exportHtml() {
    try {
      const suggestedName = `${slugify(document.title)}.html`;
      const html = renderResumeHtml(document, { assetSources, exportMode: "visual" });
      const exportedPath = await window.templeCV.exportHtml(html, suggestedName);

      if (exportedPath) {
        setStatus(`Exported ${exportedPath}`);
      }
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  }

  async function exportJson() {
    try {
      const suggestedName = `${slugify(document.title)}.json`;
      const json = JSON.stringify(document, null, 2);
      const exportedPath = await window.templeCV.exportJson(json, suggestedName);

      if (exportedPath) {
        setStatus(`Exported ${exportedPath}`);
      }
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  }

  async function exportDocx() {
    try {
      const suggestedName = `${slugify(document.title)}.docx`;
      const data = await exportResumeDocx(document);
      const exportedPath = await window.templeCV.exportDocx(data, suggestedName);

      if (exportedPath) {
        setStatus(`Exported ${exportedPath}`);
      }
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  }

  return {
    addEducation,
    addExperience,
    addProject,
    addSkillGroup,
    addTestimonial,
    document,
    exportDocx,
    exportHtml,
    exportJson,
    exportPdf,
    assetSources,
    importAsset,
    importAssetFile,
    isDirty,
    openPackage,
    previewHtml,
    removeAsset,
    savePackage,
    status,
    updateAsset,
    updateContent,
    updateDesign
  };
}
