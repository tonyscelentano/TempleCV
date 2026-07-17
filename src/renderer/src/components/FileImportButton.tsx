import { useRef } from "react";
import type { ResumeAsset } from "../../../core/schema";

export function FileImportButton({
  className = "",
  importAssetFile,
  label,
  onImported,
  usage
}: {
  className?: string;
  importAssetFile: (usage: ResumeAsset["usage"], file: File) => Promise<ResumeAsset>;
  label: string;
  onImported?: (asset: ResumeAsset) => void;
  usage: ResumeAsset["usage"];
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button className={`asset-import-button ${className}`.trim()} type="button" onClick={() => inputRef.current?.click()}>
        {label}
      </button>
      <input
        ref={inputRef}
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="asset-file-input"
        tabIndex={-1}
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }

          void importAssetFile(usage, file).then((asset) => onImported?.(asset));
          event.currentTarget.value = "";
        }}
      />
    </>
  );
}
