import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  type MenuItemConstructorOptions,
  type OpenDialogOptions,
  type SaveDialogOptions
} from "electron";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

let mainWindow: BrowserWindow | null = null;

type MenuCommand = "open-package" | "save-package" | "export-pdf" | "export-ats-pdf" | "export-html" | "export-json" | "export-docx";

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1080,
    minHeight: 720,
    title: "TempleCV",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    await mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
}

app.whenReady().then(async () => {
  registerIpc();
  installApplicationMenu();
  await createWindow();

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

function installApplicationMenu(): void {
  const isMac = process.platform === "darwin";
  const developmentItems: MenuItemConstructorOptions[] = MAIN_WINDOW_VITE_DEV_SERVER_URL
    ? [
        { role: "reload" },
        { role: "toggleDevTools" },
        { type: "separator" }
      ]
    : [];

  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" }
            ]
          } satisfies MenuItemConstructorOptions
        ]
      : []),
    {
      label: "File",
      submenu: [
        { label: "Open Resume...", accelerator: "CmdOrCtrl+O", click: () => sendMenuCommand("open-package") },
        { label: "Save Resume...", accelerator: "CmdOrCtrl+S", click: () => sendMenuCommand("save-package") },
        { type: "separator" },
        { label: "Export PDF...", accelerator: "CmdOrCtrl+E", click: () => sendMenuCommand("export-pdf") },
        { label: "Export ATS PDF...", accelerator: "CmdOrCtrl+Shift+E", click: () => sendMenuCommand("export-ats-pdf") },
        { type: "separator" },
        { label: "Export HTML...", click: () => sendMenuCommand("export-html") },
        { label: "Export JSON...", click: () => sendMenuCommand("export-json") },
        { label: "Export DOCX...", click: () => sendMenuCommand("export-docx") },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" }
      ]
    },
    {
      label: "View",
      submenu: [
        ...developmentItems,
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, isMac ? { role: "zoom" } : { role: "close" }]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function sendMenuCommand(command: MenuCommand): void {
  const target = BrowserWindow.getFocusedWindow() ?? mainWindow;
  target?.webContents.send("resume:menu-command", command);
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function registerIpc(): void {
  ipcMain.handle("resume:open-package", async () => {
    const result = await showOpenDialog({
      title: "Open Resume Package",
      properties: ["openFile"],
      filters: [{ name: "Resume Package", extensions: ["resume"] }]
    });

    if (result.canceled || !result.filePaths[0]) {
      return null;
    }

    const data = await readFile(result.filePaths[0]);
    return {
      path: result.filePaths[0],
      data: new Uint8Array(data)
    };
  });

  ipcMain.handle("resume:save-package", async (_event, payload: { data: Uint8Array; suggestedName: string }) => {
    const result = await showSaveDialog({
      title: "Save Resume Package",
      defaultPath: payload.suggestedName,
      filters: [{ name: "Resume Package", extensions: ["resume"] }]
    });

    if (result.canceled || !result.filePath) {
      return null;
    }

    await writeFile(result.filePath, Buffer.from(payload.data));
    return result.filePath;
  });

  ipcMain.handle("resume:export-pdf", async (_event, payload: { html: string; suggestedName: string; atsMode: boolean }) => {
    const result = await showSaveDialog({
      title: payload.atsMode ? "Export ATS PDF" : "Export PDF",
      defaultPath: payload.suggestedName,
      filters: [{ name: "PDF", extensions: ["pdf"] }]
    });

    if (result.canceled || !result.filePath) {
      return null;
    }

    const pdfWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        offscreen: true,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    });

    try {
      await pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(payload.html)}`);
      const pdf = await pdfWindow.webContents.printToPDF({
        printBackground: true,
        preferCSSPageSize: true,
        pageSize: "Letter",
        margins: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      });

      await writeFile(result.filePath, pdf);
      return result.filePath;
    } finally {
      pdfWindow.close();
    }
  });

  ipcMain.handle("resume:export-html", async (_event, payload: { html: string; suggestedName: string }) => {
    const result = await showSaveDialog({
      title: "Export HTML",
      defaultPath: payload.suggestedName,
      filters: [{ name: "HTML", extensions: ["html"] }]
    });

    if (result.canceled || !result.filePath) {
      return null;
    }

    await writeFile(result.filePath, payload.html, "utf-8");
    return result.filePath;
  });

  ipcMain.handle("resume:export-json", async (_event, payload: { json: string; suggestedName: string }) => {
    const result = await showSaveDialog({
      title: "Export JSON",
      defaultPath: payload.suggestedName,
      filters: [{ name: "JSON", extensions: ["json"] }]
    });

    if (result.canceled || !result.filePath) {
      return null;
    }

    await writeFile(result.filePath, payload.json, "utf-8");
    return result.filePath;
  });

  ipcMain.handle("resume:export-docx", async (_event, payload: { data: Uint8Array; suggestedName: string }) => {
    const result = await showSaveDialog({
      title: "Export DOCX",
      defaultPath: payload.suggestedName,
      filters: [{ name: "Word Document", extensions: ["docx"] }]
    });

    if (result.canceled || !result.filePath) {
      return null;
    }

    await writeFile(result.filePath, Buffer.from(payload.data));
    return result.filePath;
  });

  ipcMain.handle("resume:import-asset", async () => {
    const result = await showOpenDialog({
      title: "Import Resume Asset",
      properties: ["openFile"],
      filters: [
        {
          name: "Images",
          extensions: ["png", "jpg", "jpeg", "webp", "gif", "svg"]
        }
      ]
    });

    if (result.canceled || !result.filePaths[0]) {
      return null;
    }

    const filePath = result.filePaths[0];
    const data = await readFile(filePath);

    return {
      filename: path.basename(filePath),
      mediaType: getMediaType(filePath),
      data: new Uint8Array(data)
    };
  });
}

function getDialogParent(): BrowserWindow | null {
  return mainWindow ?? BrowserWindow.getFocusedWindow();
}

function showOpenDialog(options: OpenDialogOptions) {
  const parent = getDialogParent();
  return parent ? dialog.showOpenDialog(parent, options) : dialog.showOpenDialog(options);
}

function showSaveDialog(options: SaveDialogOptions) {
  const parent = getDialogParent();
  return parent ? dialog.showSaveDialog(parent, options) : dialog.showSaveDialog(options);
}

function getMediaType(filePath: string): string {
  switch (path.extname(filePath).toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}
