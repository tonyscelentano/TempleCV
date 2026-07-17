import type { ResumeDocument } from "../core/schema";
import QRCode from "qrcode-svg";
import { escapeAttribute, escapeHtml } from "./htmlEscape";

export function renderQrCode(document: ResumeDocument): string {
  const links = document.content.basics.links;
  if (links.length === 0) return "";

  const primaryUrl = links[0].url;
  try {
    const QRConstructor = typeof QRCode === "function" ? QRCode : (QRCode as any).default;

    if (!QRConstructor) {
      throw new Error("QRCode constructor not found");
    }

    const qr = new QRConstructor({
      content: primaryUrl,
      padding: 0,
      color: "#111111",
      background: "#ffffff",
      ecl: "M",
      join: true
    });
    return `<div class="qr-code" title="${escapeAttribute(primaryUrl)}">${qr.svg({ container: "svg-viewbox" })}</div>`;
  } catch (e: any) {
    return `<div class="qr-code" style="color:red; font-size: 8pt; display:flex; align-items:center; justify-content:center; text-align:center; padding: 2px;">${escapeHtml(
      e?.message || String(e)
    )}</div>`;
  }
}
