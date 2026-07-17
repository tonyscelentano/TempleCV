import type { ResumeDocument } from "../../../core/schema";
import { updateBasics } from "../lib/resumeUpdates";
import { emptyToUndefined } from "../lib/text";
import type { ContentUpdater } from "../types";
import { TextField } from "../components/form";

export function BasicsSection({ document, updateContent }: { document: ResumeDocument; updateContent: ContentUpdater }) {
  const links = document.content.basics.links;

  const updateLink = (index: number, patch: Partial<{ label: string; url: string }>) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], ...patch };
    updateBasics(updateContent, "links", newLinks);
  };

  const removeLink = (index: number) => {
    updateBasics(updateContent, "links", links.filter((_, i) => i !== index));
  };

  const addLink = () => {
    updateBasics(updateContent, "links", [...links, { label: "Website", url: "https://" }]);
  };

  return (
    <section className="panel">
      <h2>Basics</h2>
      <label>
        Name
        <input value={document.content.basics.fullName} onChange={(event) => updateBasics(updateContent, "fullName", event.target.value)} />
      </label>
      <label>
        Headline
        <input value={document.content.basics.headline} onChange={(event) => updateBasics(updateContent, "headline", event.target.value)} />
      </label>
      <div className="field-grid">
        <label>
          Email
          <input value={document.content.basics.email ?? ""} onChange={(event) => updateBasics(updateContent, "email", emptyToUndefined(event.target.value))} />
        </label>
        <label>
          Phone
          <input value={document.content.basics.phone ?? ""} onChange={(event) => updateBasics(updateContent, "phone", emptyToUndefined(event.target.value))} />
        </label>
      </div>
      <label>
        Location
        <input
          value={document.content.basics.location ?? ""}
          onChange={(event) => updateBasics(updateContent, "location", emptyToUndefined(event.target.value))}
        />
      </label>
      <label>
        Summary
        <textarea
          value={document.content.summary}
          rows={5}
          onChange={(event) => updateContent((content) => ({ ...content, summary: event.target.value }))}
        />
      </label>

      <div className="links-heading">
        <h3>Links</h3>
        <button type="button" onClick={addLink}>Add Link</button>
      </div>
      <div className="links-stack">
        {links.map((link, index) => (
          <div key={index} className="editor-card link-card">
            <div className="card-heading">
              <h4>{index === 0 ? "Primary Link (QR Code)" : "Secondary Link"}</h4>
              <button type="button" onClick={() => removeLink(index)}>Remove</button>
            </div>
            <div className="field-grid">
              <TextField label="Label (e.g. Portfolio)" value={link.label} onChange={(val) => updateLink(index, { label: val })} />
              <TextField label="URL" value={link.url} onChange={(val) => updateLink(index, { url: val })} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
