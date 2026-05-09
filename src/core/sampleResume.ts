import { CURRENT_SCHEMA_VERSION, type ResumeDocument } from "./schema";

const timestamp = new Date("2026-05-09T00:00:00.000Z").toISOString();

export const sampleResume: ResumeDocument = {
  documentType: "resume",
  schemaVersion: CURRENT_SCHEMA_VERSION,
  id: "sample-resume",
  title: "Sample Resume",
  template: {
    id: "modern-editorial",
    variant: "default"
  },
  content: {
    basics: {
      fullName: "Avery Morgan",
      headline: "Product-minded full stack engineer",
      email: "avery@example.com",
      phone: "+1 555 0100",
      location: "Remote",
      links: [
        { label: "Portfolio", url: "https://example.com" },
        { label: "LinkedIn", url: "https://linkedin.com/in/example" }
      ]
    },
    summary:
      "Full stack engineer focused on reliable product systems, readable interfaces, and pragmatic technical foundations.",
    experience: [
      {
        id: "exp-1",
        company: "Northstar Labs",
        role: "Senior Full Stack Engineer",
        location: "Remote",
        dates: { start: "2022", present: true },
        assetIds: [],
        highlights: [
          "Led development of document workflows used by cross-functional teams.",
          "Reduced export defects by moving rendering into a deterministic template pipeline.",
          "Introduced schema validation and migration checks for user-owned documents."
        ]
      }
    ],
    projects: [
      {
        id: "project-1",
        name: "Portfolio System",
        role: "Creator",
        summary: "A branded project archive with case studies, screenshots, and lightweight analytics.",
        highlights: ["Designed content model", "Built exportable case study pages"],
        assetIds: []
      }
    ],
    testimonials: [
      {
        id: "test-1",
        quote: "Avery is a rare engineer who truly understands product design. They consistently delivered high-impact work that moved the needle for our team.",
        author: "Sarah Chen",
        title: "VP of Product, Northstar Labs"
      }
    ],
    education: [
      {
        id: "edu-1",
        institution: "State University",
        credential: "B.S. Computer Science",
        highlights: []
      }
    ],
    skills: [
      {
        id: "skills-1",
        label: "Engineering",
        items: ["TypeScript", "React", "Node.js", "Document pipelines", "Product systems"]
      }
    ]
  },
  design: {
    color: {
      background: "#ffffff",
      foreground: "#111111",
      accent: "#000000",
      muted: "#888888"
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      baseSize: 10
    },
    layout: {
      pageSize: "letter",
      density: "balanced",
      sectionOrder: ["summary", "experience", "projects", "testimonials", "skills", "education"],
      imageMode: "subtle",
      showQrCode: false
    }
  },
  assets: [],
  metadata: {
    createdAt: timestamp,
    updatedAt: timestamp,
    appVersion: "0.1.0"
  }
};
