import { contextBridge, ipcRenderer } from "electron";

export type OpenResumePackageResult = {
  path: string;
  data: Uint8Array;
} | null;

export type ImportedAssetResult = {
  filename: string;
  mediaType: string;
  data: Uint8Array;
} | null;

export type templeCVApi = {
  openPackage: () => Promise<OpenResumePackageResult>;
  savePackage: (data: Uint8Array, suggestedName: string) => Promise<string | null>;
  exportPdf: (html: string, suggestedName: string, atsMode: boolean) => Promise<string | null>;
  exportHtml: (html: string, suggestedName: string) => Promise<string | null>;
  exportJson: (json: string, suggestedName: string) => Promise<string | null>;
  exportDocx: (data: Uint8Array, suggestedName: string) => Promise<string | null>;
  importAsset: () => Promise<ImportedAssetResult>;
  onMenuCommand: (listener: (command: MenuCommand) => void) => () => void;
};

export type MenuCommand = "open-package" | "save-package" | "export-pdf" | "export-ats-pdf" | "export-html" | "export-json" | "export-docx";

const api: templeCVApi = {
  openPackage: () => ipcRenderer.invoke("resume:open-package"),
  savePackage: (data, suggestedName) => ipcRenderer.invoke("resume:save-package", { data, suggestedName }),
  exportPdf: (html, suggestedName, atsMode) => ipcRenderer.invoke("resume:export-pdf", { html, suggestedName, atsMode }),
  exportHtml: (html, suggestedName) => ipcRenderer.invoke("resume:export-html", { html, suggestedName }),
  exportJson: (json, suggestedName) => ipcRenderer.invoke("resume:export-json", { json, suggestedName }),
  exportDocx: (data, suggestedName) => ipcRenderer.invoke("resume:export-docx", { data, suggestedName }),
  importAsset: () => ipcRenderer.invoke("resume:import-asset"),
  onMenuCommand: (listener) => {
    const handler = (_event: Electron.IpcRendererEvent, command: MenuCommand) => listener(command);

    ipcRenderer.on("resume:menu-command", handler);
    return () => ipcRenderer.removeListener("resume:menu-command", handler);
  }
};

contextBridge.exposeInMainWorld("templeCV", api);

