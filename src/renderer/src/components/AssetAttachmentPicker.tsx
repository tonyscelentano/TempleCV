import type { ResumeAsset } from "../../../core/schema";

export function AssetAttachmentPicker({
  assets,
  assetSources,
  emptyLabel,
  onChange,
  selectedIds
}: {
  assets: ResumeAsset[];
  assetSources: Record<string, string>;
  emptyLabel: string;
  onChange: (assetIds: string[]) => void;
  selectedIds: string[];
}) {
  if (assets.length === 0) {
    return <p className="empty-note">{emptyLabel}</p>;
  }

  return (
    <div className="attachment-grid">
      {assets.map((asset) => {
        const selected = selectedIds.includes(asset.id);

        return (
          <button
            className={selected ? "attachment-tile selected" : "attachment-tile"}
            key={asset.id}
            type="button"
            onClick={() => onChange(toggleAssetId(selectedIds, asset.id))}
          >
            <span className="attachment-thumb">
              {assetSources[asset.id] ? <img alt={asset.altText || asset.filename} src={assetSources[asset.id]} /> : null}
            </span>
            <span className="attachment-label">{asset.altText || asset.filename}</span>
          </button>
        );
      })}
    </div>
  );
}

function toggleAssetId(assetIds: string[], assetId: string): string[] {
  return assetIds.includes(assetId) ? assetIds.filter((id) => id !== assetId) : [...assetIds, assetId];
}
