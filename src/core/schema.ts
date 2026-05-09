import { z } from "zod";

export const CURRENT_SCHEMA_VERSION = "1.1.0";

export const AssetUsageSchema = z.enum([
  "headshot",
  "logo",
  "project-screenshot",
  "background",
  "attachment"
]);

export const ResumeAssetSchema = z.object({
  id: z.string().min(1),
  filename: z.string().min(1),
  mediaType: z.string().min(1),
  usage: AssetUsageSchema,
  altText: z.string().default(""),
  crop: z
    .object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
      width: z.number().min(0).max(1),
      height: z.number().min(0).max(1)
    })
    .optional()
});

export const DateRangeSchema = z.object({
  start: z.string().min(4),
  end: z.string().min(4).optional(),
  present: z.boolean().default(false)
});

export const ExperienceSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional(),
  dates: DateRangeSchema,
  summary: z.string().optional(),
  highlights: z.array(z.string().min(1)).default([]),
  assetIds: z.array(z.string()).default([])
});

export const ProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().optional(),
  url: z.string().url().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string().min(1)).default([]),
  assetIds: z.array(z.string()).default([])
});

export const EducationSchema = z.object({
  id: z.string().min(1),
  institution: z.string().min(1),
  credential: z.string().min(1),
  location: z.string().optional(),
  dates: DateRangeSchema.optional(),
  highlights: z.array(z.string().min(1)).default([])
});

export const TestimonialSchema = z.object({
  id: z.string().min(1),
  quote: z.string().min(1),
  author: z.string().min(1),
  title: z.string().optional()
});

export const ResumeContentSchema = z.object({
  basics: z.object({
    fullName: z.string().min(1),
    headline: z.string().default(""),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    links: z
      .array(
        z.object({
          label: z.string().min(1),
          url: z.string().url()
        })
      )
      .default([])
  }),
  summary: z.string().default(""),
  experience: z.array(ExperienceSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  education: z.array(EducationSchema).default([]),
  testimonials: z.array(TestimonialSchema).default([]),
  skills: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        items: z.array(z.string().min(1)).default([])
      })
    )
    .default([])
});

export const DesignSchema = z.object({
  color: z.object({
    background: z.string().default("#ffffff"),
    foreground: z.string().default("#111111"),
    accent: z.string().default("#000000"),
    muted: z.string().default("#888888")
  }),
  typography: z.object({
    headingFont: z.string().default("Inter"),
    bodyFont: z.string().default("Inter"),
    baseSize: z.number().min(8).max(14).default(10)
  }),
  layout: z.object({
    pageSize: z.enum(["letter", "a4"]).default("letter"),
    density: z.enum(["compact", "balanced", "spacious"]).default("balanced"),
    sectionOrder: z
      .array(z.enum(["summary", "experience", "projects", "testimonials", "skills", "education"]))
      .default(["summary", "experience", "projects", "testimonials", "skills", "education"]),
    imageMode: z.enum(["none", "subtle", "expressive"]).default("subtle"),
    showQrCode: z.boolean().default(false)
  })
});

export const ResumeDocumentSchema = z.object({
  documentType: z.literal("resume"),
  schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
  id: z.string().min(1),
  title: z.string().min(1),
  template: z.object({
    id: z.string().min(1),
    variant: z.string().default("default")
  }),
  content: ResumeContentSchema,
  design: DesignSchema,
  assets: z.array(ResumeAssetSchema).default([]),
  metadata: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    appVersion: z.string().default("0.1.0")
  })
});

export type ResumeAsset = z.infer<typeof ResumeAssetSchema>;
export type ResumeContent = z.infer<typeof ResumeContentSchema>;
export type ResumeDocument = z.infer<typeof ResumeDocumentSchema>;
export type ResumeDesign = z.infer<typeof DesignSchema>;

export function parseResumeDocument(input: unknown): ResumeDocument {
  return ResumeDocumentSchema.parse(input);
}

export function safeParseResumeDocument(input: unknown) {
  return ResumeDocumentSchema.safeParse(input);
}
