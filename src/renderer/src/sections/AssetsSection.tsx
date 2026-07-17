import type { ResumeAsset } from "../../../core/schema";
import { FileImportButton } from "../components/FileImportButton";
import { PanelHeader } from "../components/form";

const usageLabels: Record<ResumeAsset["usage"], string> = {
  attachment: "Attachment",
  background: "Background",
  headshot: "Headshot",
  logo: "Logo",
  "project-screenshot": "Screenshot"
};

export function AssetsSection({
  assets,
  assetSources,
  importAssetFile,
  removeAsset,
  updateAsset
}: {
  assets: ResumeAsset[];
  assetSources: Record<string, string>;
  importAssetFile: (usage: ResumeAsset["usage"], file: File) => Promise<ResumeAsset>;
  removeAsset: (assetId: string) => void;
  updateAsset: (assetId: string, patch: Partial<Pick<ResumeAsset, "altText" | "usage">>) => void;
}) {
  return (
    <section className="panel">
      <PanelHeader title="Assets" />
      <div className="asset-actions">
        <FileImportButton label="Headshot" usage="headshot" importAssetFile={importAssetFile} />
        <FileImportButton label="Logo" usage="logo" importAssetFile={importAssetFile} />
        <FileImportButton label="Screenshot" usage="project-screenshot" importAssetFile={importAssetFile} />
      </div>
      {assets.length === 0 ? <p className="empty-note">No imported assets.</p> : null}
      {assets.map((asset) => (
        <article className="asset-row" key={asset.id}>
          <div className="asset-thumb">
            {assetSources[asset.id] ? <img alt={asset.altText || asset.filename} src={assetSources[asset.id]} /> : null}
          </div>
          <div className="asset-fields">
            <strong>{asset.altText || asset.filename}</strong>
            <span>
              {usageLabels[asset.usage]} · {asset.mediaType}
            </span>
            <label>
              Label
              <input value={asset.altText} onChange={(event) => updateAsset(asset.id, { altText: event.target.value })} />
            </label>
            <label>
              Usage
              <select value={asset.usage} onChange={(event) => updateAsset(asset.id, { usage: event.target.value as ResumeAsset["usage"] })}>
                {Object.entries(usageLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="button" onClick={() => removeAsset(asset.id)}>
            Remove
          </button>
        </article>
      ))}
    </section>
  );
}
