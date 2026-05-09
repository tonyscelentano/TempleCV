import { createRoot } from "react-dom/client";
import { useMemo, useRef, useState, useEffect } from "react";
import { SectionCommandGrid, type SectionCommand } from "./components/SectionCommandGrid";
import { useResumeWorkspace } from "./hooks/useResumeWorkspace";
import { AssetsSection } from "./sections/AssetsSection";
import { BasicsSection } from "./sections/BasicsSection";
import { BrandSection } from "./sections/BrandSection";
import { EducationSection } from "./sections/EducationSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import "./styles.css";

type ActiveSection = "basics" | "experience" | "projects" | "testimonials" | "skills" | "education" | "assets";

function App() {
  const workspace = useResumeWorkspace();
  const workspaceRef = useRef(workspace);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // NOTE: renamed from `document` to avoid shadowing the global DOM `document`
  const resumeDoc = workspace.document;
  const [activeSection, setActiveSection] = useState<ActiveSection>("basics");
  const sectionCommands = useMemo<Array<SectionCommand<ActiveSection>>>(
    () => [
      { id: "basics", label: "Basics", meta: "Identity" },
      { id: "experience", label: "Roles", meta: "Work", onAdd: workspace.addExperience },
      { id: "projects", label: "Projects", meta: "Proof", onAdd: workspace.addProject },
      { id: "testimonials", label: "Praise", meta: "Proof", onAdd: workspace.addTestimonial },
      { id: "skills", label: "Skills", meta: "Stack", onAdd: workspace.addSkillGroup },
      { id: "education", label: "School", meta: "Creds", onAdd: workspace.addEducation },
      { id: "assets", label: "Assets", meta: "Media" }
    ],
    [workspace]
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "focus-section" && event.data.section) {
        const validSection = sectionCommands.find(c => c.id === event.data.section);
        if (validSection) {
          setActiveSection(validSection.id as ActiveSection);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [sectionCommands]);

  useEffect(() => {
    workspaceRef.current = workspace;
  }, [workspace]);

  // Write preview HTML directly into the iframe to avoid the white flash
  // caused by srcDoc replacing the entire document on every keystroke.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(workspace.previewHtml);
    doc.close();
  }, [workspace.previewHtml]);

  useEffect(() => {
    const templeCV = window.templeCV as Window["templeCV"] | undefined;
    if (!templeCV?.onMenuCommand) {
      return;
    }

    return templeCV.onMenuCommand((command) => {
      const currentWorkspace = workspaceRef.current;

      switch (command) {
        case "open-package":
          void currentWorkspace.openPackage();
          break;
        case "save-package":
          void currentWorkspace.savePackage();
          break;
        case "export-pdf":
          void currentWorkspace.exportPdf(false);
          break;
        case "export-ats-pdf":
          void currentWorkspace.exportPdf(true);
          break;
        case "export-html":
          void currentWorkspace.exportHtml();
          break;
        case "export-json":
          void currentWorkspace.exportJson();
          break;
        case "export-docx":
          void currentWorkspace.exportDocx();
          break;
      }
    });
  }, []);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div>
            <h1>TempleCV</h1>
            <p>{resumeDoc.title}</p>
          </div>
        </div>

        <SectionCommandGrid activeSection={activeSection} commands={sectionCommands} onSelect={setActiveSection} />

        {activeSection === "basics" ? <BasicsSection document={resumeDoc} updateContent={workspace.updateContent} /> : null}
        {activeSection === "experience" ? (
          <ExperienceSection
            assets={resumeDoc.assets}
            assetSources={workspace.assetSources}
            document={resumeDoc}
            importAssetFile={workspace.importAssetFile}
            onAdd={workspace.addExperience}
            updateContent={workspace.updateContent}
          />
        ) : null}
        {activeSection === "projects" ? (
          <ProjectsSection
            assets={resumeDoc.assets}
            assetSources={workspace.assetSources}
            document={resumeDoc}
            importAssetFile={workspace.importAssetFile}
            onAdd={workspace.addProject}
            updateContent={workspace.updateContent}
          />
        ) : null}
        {activeSection === "testimonials" ? (
          <TestimonialsSection document={resumeDoc} onAdd={workspace.addTestimonial} updateContent={workspace.updateContent} />
        ) : null}
        {activeSection === "skills" ? (
          <SkillsSection document={resumeDoc} onAdd={workspace.addSkillGroup} updateContent={workspace.updateContent} />
        ) : null}
        {activeSection === "education" ? (
          <EducationSection document={resumeDoc} onAdd={workspace.addEducation} updateContent={workspace.updateContent} />
        ) : null}
        {activeSection === "assets" ? (
          <AssetsSection
            assets={resumeDoc.assets}
            assetSources={workspace.assetSources}
            importAssetFile={workspace.importAssetFile}
            removeAsset={workspace.removeAsset}
            updateAsset={workspace.updateAsset}
          />
        ) : null}

        <div style={{ flexGrow: 1 }}></div>

        <p className="status">{workspace.status}</p>
      </aside>

      <section className="preview-pane">
        <div className="preview-wrapper" data-page-size={resumeDoc.design.layout.pageSize}>
          <iframe ref={iframeRef} title="Resume preview" />
        </div>
      </section>

      <aside className="right-sidebar">
        <div className="brand">
          <div>
            <h2>Design & Export</h2>
            <p>Customize presentation</p>
          </div>
        </div>
        
        <div className="toolbar">
          <button type="button" onClick={workspace.openPackage}>
            Open
          </button>
          <button type="button" onClick={workspace.savePackage}>
            Save{workspace.isDirty ? " •" : ""}
          </button>
          <button type="button" onClick={() => workspace.exportPdf(false)}>
            PDF
          </button>
          <button type="button" onClick={() => workspace.exportPdf(true)}>
            ATS PDF
          </button>
          <button type="button" onClick={workspace.exportHtml}>
            HTML
          </button>
          <button type="button" onClick={workspace.exportJson}>
            JSON
          </button>
          <button type="button" onClick={workspace.exportDocx}>
            DOCX
          </button>
        </div>

        <BrandSection document={resumeDoc} updateDesign={workspace.updateDesign} />
      </aside>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
