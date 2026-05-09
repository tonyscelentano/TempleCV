import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  type IBorderOptions
} from "docx";
import type { ResumeDocument } from "../core/schema";

const THIN_BOTTOM: IBorderOptions = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };

export async function exportResumeDocx(doc: ResumeDocument): Promise<Uint8Array> {
  const { content } = doc;

  const children: Paragraph[] = [];

  // --- Name & Headline ---
  children.push(
    new Paragraph({
      children: [new TextRun({ text: content.basics.fullName, bold: true, size: 36, font: "Calibri" })],
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 }
    })
  );

  if (content.basics.headline) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: content.basics.headline, color: "666666", size: 20 })],
        spacing: { after: 80 }
      })
    );
  }

  // --- Contact line ---
  const contactParts = [content.basics.email, content.basics.phone, content.basics.location].filter(Boolean);
  if (content.basics.links.length) {
    contactParts.push(...content.basics.links.map((link) => link.url));
  }
  if (contactParts.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join(" · "), size: 18, color: "444444" })],
        spacing: { after: 200 },
        border: { bottom: THIN_BOTTOM }
      })
    );
  }

  // --- Summary ---
  if (content.summary) {
    children.push(sectionHeading("Summary"));
    children.push(
      new Paragraph({ children: [new TextRun({ text: content.summary, size: 20 })], spacing: { after: 120 } })
    );
  }

  // --- Experience ---
  if (content.experience.length) {
    children.push(sectionHeading("Experience"));

    for (const item of content.experience) {
      const dateStr = `${item.dates.start} – ${item.dates.present ? "Present" : (item.dates.end ?? "")}`;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: item.company, bold: true, size: 22 }),
            new TextRun({ text: ` — ${item.role}`, size: 20 })
          ],
          spacing: { before: 120, after: 40 }
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: dateStr, color: "666666", size: 18, italics: true }),
            ...(item.location ? [new TextRun({ text: ` · ${item.location}`, color: "666666", size: 18 })] : [])
          ],
          spacing: { after: 60 }
        })
      );

      if (item.summary) {
        children.push(new Paragraph({ children: [new TextRun({ text: item.summary, size: 20 })], spacing: { after: 40 } }));
      }

      for (const highlight of item.highlights) {
        children.push(bulletParagraph(highlight));
      }
    }
  }

  // --- Projects ---
  if (content.projects.length) {
    children.push(sectionHeading("Projects"));

    for (const project of content.projects) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: project.name, bold: true, size: 22 }),
            ...(project.role ? [new TextRun({ text: ` — ${project.role}`, size: 20 })] : [])
          ],
          spacing: { before: 120, after: 40 }
        })
      );

      if (project.summary) {
        children.push(new Paragraph({ children: [new TextRun({ text: project.summary, size: 20 })], spacing: { after: 40 } }));
      }

      for (const highlight of project.highlights) {
        children.push(bulletParagraph(highlight));
      }
    }
  }

  // --- Education ---
  if (content.education.length) {
    children.push(sectionHeading("Education"));

    for (const edu of content.education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, bold: true, size: 22 }),
            new TextRun({ text: ` — ${edu.credential}`, size: 20 })
          ],
          spacing: { before: 120, after: 60 }
        })
      );

      for (const highlight of edu.highlights) {
        children.push(bulletParagraph(highlight));
      }
    }
  }

  // --- Skills ---
  if (content.skills.length) {
    children.push(sectionHeading("Skills"));

    for (const group of content.skills) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${group.label}: `, bold: true, size: 20 }),
            new TextRun({ text: group.items.join(", "), size: 20 })
          ],
          spacing: { after: 40 }
        })
      );
    }
  }

  // --- Testimonials ---
  if (content.testimonials.length) {
    children.push(sectionHeading("Testimonials"));

    for (const testimonial of content.testimonials) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `"${testimonial.quote}"`, italics: true, size: 20 })],
          spacing: { before: 80, after: 40 },
          indent: { left: 360 }
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `— ${testimonial.author}`, bold: true, size: 18 }),
            ...(testimonial.title ? [new TextRun({ text: `, ${testimonial.title}`, size: 18, color: "666666" })] : [])
          ],
          indent: { left: 360 },
          spacing: { after: 80 }
        })
      );
    }
  }

  const document = new Document({
    sections: [{ children }]
  });

  const buffer = await Packer.toBuffer(document);
  return new Uint8Array(buffer);
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 18, color: "888888", font: "Calibri" })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    border: { bottom: THIN_BOTTOM }
  });
}

function bulletParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 20 })],
    bullet: { level: 0 },
    spacing: { after: 20 }
  });
}
