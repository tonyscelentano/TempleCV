import type { ResumeDocument } from "../../../core/schema";
import type { DesignUpdater } from "../types";

const FONT_OPTIONS = ["Inter", "Helvetica Neue", "Georgia", "Playfair Display", "DM Sans", "Lato", "Raleway"];

const CURATED_PALETTES = [
  { name: "Monochrome", background: "#ffffff", foreground: "#111111", accent: "#000000", muted: "#888888" },
  { name: "Midnight", background: "#0d0d0d", foreground: "#e0e0e0", accent: "#ffffff", muted: "#7c7c7c" },
  { name: "Slate", background: "#0f172a", foreground: "#f8fafc", accent: "#38bdf8", muted: "#64748b" },
  { name: "Nordic", background: "#eceff4", foreground: "#2e3440", accent: "#5e81ac", muted: "#4c566a" },
  { name: "Oatmeal", background: "#fdfbf7", foreground: "#3e3b32", accent: "#8c7b61", muted: "#a8a291" },
  { name: "Forest", background: "#f0f4f1", foreground: "#1f2924", accent: "#2a5940", muted: "#85998f" },
  { name: "Dusk", background: "#1c1917", foreground: "#fafaf9", accent: "#f59e0b", muted: "#a8a29e" }
];

const SECTION_LABELS: Record<string, string> = {
  summary: "Summary",
  experience: "Experience",
  projects: "Projects",
  testimonials: "Testimonials",
  skills: "Skills",
  education: "Education"
};

export function BrandSection({ document, updateDesign }: { document: ResumeDocument; updateDesign: DesignUpdater }) {
  const { design } = document;

  const moveSection = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= design.layout.sectionOrder.length) return;
    const newOrder = [...design.layout.sectionOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[newIndex];
    newOrder[newIndex] = temp;
    updateDesign((d) => ({ ...d, layout: { ...d.layout, sectionOrder: newOrder } }));
  };

  return (
    <section className="panel">
      <h2>Palette</h2>
      <div className="palette-grid" role="group" aria-label="Color palettes">
        {CURATED_PALETTES.map((palette) => {
          const active = design.color.background === palette.background && design.color.accent === palette.accent;

          return (
            <button
              key={palette.name}
              aria-label={`Use ${palette.name} palette`}
              aria-pressed={active}
              className={`palette-swatch ${active ? "active" : ""}`}
              style={{ background: palette.background, borderColor: palette.accent }}
              title={palette.name}
              type="button"
              onClick={() => updateDesign((d) => ({ ...d, color: palette }))}
            >
              <span aria-hidden="true" className="palette-color-preview" style={{ background: palette.foreground }}></span>
              <span aria-hidden="true" className="palette-color-preview" style={{ background: palette.accent }}></span>
              <span aria-hidden="true" className="palette-color-preview" style={{ background: palette.muted }}></span>
            </button>
          );
        })}
      </div>
      
      <details className="advanced-colors">
        <summary>Custom Colors</summary>
        <div className="field-grid" style={{ marginTop: '8px' }}>
          <label>
            Accent
            <input
              type="color"
              value={design.color.accent}
              onChange={(event) =>
                updateDesign((d) => ({ ...d, color: { ...d.color, accent: event.target.value } }))
              }
            />
          </label>
          <label>
            Background
            <input
              type="color"
              value={design.color.background}
              onChange={(event) =>
                updateDesign((d) => ({ ...d, color: { ...d.color, background: event.target.value } }))
              }
            />
          </label>
          <label>
            Text
            <input
              type="color"
              value={design.color.foreground}
              onChange={(event) =>
                updateDesign((d) => ({ ...d, color: { ...d.color, foreground: event.target.value } }))
              }
            />
          </label>
          <label>
            Muted
            <input
              type="color"
              value={design.color.muted}
              onChange={(event) =>
                updateDesign((d) => ({ ...d, color: { ...d.color, muted: event.target.value } }))
              }
            />
          </label>
        </div>
      </details>

      <h2>Typography</h2>
      <label>
        Heading font
        <select
          value={design.typography.headingFont}
          onChange={(event) =>
            updateDesign((d) => ({ ...d, typography: { ...d.typography, headingFont: event.target.value } }))
          }
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </label>
      <label>
        Body font
        <select
          value={design.typography.bodyFont}
          onChange={(event) =>
            updateDesign((d) => ({ ...d, typography: { ...d.typography, bodyFont: event.target.value } }))
          }
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </label>
      <label>
        Base size — {design.typography.baseSize}pt
        <input
          type="range"
          min={8}
          max={14}
          step={0.5}
          value={design.typography.baseSize}
          onChange={(event) =>
            updateDesign((d) => ({ ...d, typography: { ...d.typography, baseSize: Number(event.target.value) } }))
          }
        />
      </label>

      <h2>Layout</h2>
      <label>
        Page size
        <div className="segmented-control" role="group" aria-label="Page size">
          <button 
            aria-pressed={design.layout.pageSize === "letter"}
            className={design.layout.pageSize === "letter" ? "active" : ""}
            type="button"
            onClick={() => updateDesign((d) => ({ ...d, layout: { ...d.layout, pageSize: "letter" } }))}
          >Letter</button>
          <button 
            aria-pressed={design.layout.pageSize === "a4"}
            className={design.layout.pageSize === "a4" ? "active" : ""}
            type="button"
            onClick={() => updateDesign((d) => ({ ...d, layout: { ...d.layout, pageSize: "a4" } }))}
          >A4</button>
        </div>
      </label>
      <label>
        Density
        <div className="segmented-control" role="group" aria-label="Resume density">
          <button 
            aria-pressed={design.layout.density === "compact"}
            className={design.layout.density === "compact" ? "active" : ""}
            type="button"
            onClick={() => updateDesign((d) => ({ ...d, layout: { ...d.layout, density: "compact" } }))}
          >Compact</button>
          <button 
            aria-pressed={design.layout.density === "balanced"}
            className={design.layout.density === "balanced" ? "active" : ""}
            type="button"
            onClick={() => updateDesign((d) => ({ ...d, layout: { ...d.layout, density: "balanced" } }))}
          >Balanced</button>
          <button 
            aria-pressed={design.layout.density === "spacious"}
            className={design.layout.density === "spacious" ? "active" : ""}
            type="button"
            onClick={() => updateDesign((d) => ({ ...d, layout: { ...d.layout, density: "spacious" } }))}
          >Spacious</button>
        </div>
      </label>
      <label>
        Image mode
        <div className="segmented-control" role="group" aria-label="Image mode">
          <button 
            aria-pressed={design.layout.imageMode === "none"}
            className={design.layout.imageMode === "none" ? "active" : ""}
            title="No images"
            type="button"
            onClick={() => updateDesign((d) => ({ ...d, layout: { ...d.layout, imageMode: "none" } }))}
          >None</button>
          <button 
            aria-pressed={design.layout.imageMode === "subtle"}
            className={design.layout.imageMode === "subtle" ? "active" : ""}
            title="Small, unobtrusive images"
            type="button"
            onClick={() => updateDesign((d) => ({ ...d, layout: { ...d.layout, imageMode: "subtle" } }))}
          >Subtle</button>
          <button 
            aria-pressed={design.layout.imageMode === "expressive"}
            className={design.layout.imageMode === "expressive" ? "active" : ""}
            title="Large, prominent images"
            type="button"
            onClick={() => updateDesign((d) => ({ ...d, layout: { ...d.layout, imageMode: "expressive" } }))}
          >Express</button>
        </div>
      </label>
      <label className="inline-check" style={{ marginTop: '12px' }}>
        <input
          checked={design.layout.showQrCode}
          type="checkbox"
          onChange={(event) =>
            updateDesign((d) => ({ ...d, layout: { ...d.layout, showQrCode: event.target.checked } }))
          }
        />
        Show QR code for primary link
      </label>

      <h2>Section Order</h2>
      <div className="section-order-list" role="list" aria-label="Resume section order">
        {design.layout.sectionOrder.map((section, index) => (
          <div className="section-order-item" key={section} role="listitem">
            <span className="section-order-label">{SECTION_LABELS[section] ?? section}</span>
            <div className="section-order-controls">
              <button
                aria-label={`Move ${SECTION_LABELS[section] ?? section} up`}
                className="section-order-button"
                disabled={index === 0}
                type="button"
                onClick={() => moveSection(index, -1)}
              >↑</button>
              <button
                aria-label={`Move ${SECTION_LABELS[section] ?? section} down`}
                className="section-order-button"
                disabled={index === design.layout.sectionOrder.length - 1}
                type="button"
                onClick={() => moveSection(index, 1)}
              >↓</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
