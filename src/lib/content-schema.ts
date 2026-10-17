import { z } from "zod";
const text = z.string().trim().max(500);
const long = z.string().trim().max(12000);
const required = text.min(1, "This field is required.");
export const externalUrl = z.union([
  z.literal(""),
  z.url().refine((v) => v.startsWith("https://"), "Use an HTTPS URL."),
]);
export const assetUrl = z.union([
  z.literal(""),
  z.string().regex(/^\/(images|documents)\/[a-zA-Z0-9_./-]+$/),
  z.url().refine((v) => {
    const u = new URL(v);
    return u.protocol === "https:" && u.hostname === "res.cloudinary.com";
  }, "Use an uploaded Cloudinary asset or a local /images/ or /documents/ path."),
]);
const list = z.array(required).max(50);
const common = {
  id: z.string().max(100).optional(),
  published: z.boolean().default(false),
  displayOrder: z.number().int().min(0).max(10000).default(0),
};
export const profileSchema = z.object({
  id: z.literal("owner").optional(),
  name: required,
  designation: required,
  headline: required,
  introduction: long.min(1),
  about: long.min(1),
  focus: long,
  focusTitle: required.max(80),
  specializations: z.array(z.object({ title: required, body: text })).max(12),
  goals: long,
  email: z.email(),
  phone: text,
  showPhone: z.boolean(),
  location: text,
  image: assetUrl,
  resumeUrl: assetUrl,
});
export const projectSchema = z.object({
  ...common,
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase words separated by hyphens.",
    ),
  title: required,
  summary: long.min(1).max(1200),
  category: z.enum([
    "AI/ML",
    "Generative AI",
    "Backend",
    "Data Science",
    "Deep Learning",
    "Full-Stack",
  ]),
  cover: assetUrl,
  coverAlt: text,
  visual: z.enum(["graph", "fraud", "activity", "audio", "data"]),
  repositoryUrl: externalUrl,
  demoUrl: externalUrl,
  workRelated: z.boolean(),
  allowRepository: z.boolean(),
  allowImages: z.boolean(),
  featured: z.boolean(),
  technologies: list,
  sections: z.array(z.object({ title: required, body: long.min(1) })).max(20),
  images: z
    .array(
      z.object({
        url: assetUrl.refine(Boolean, "An image URL is required."),
        alt: required,
      }),
    )
    .max(12),
});
export const experienceSchema = z.object({
  ...common,
  company: required,
  position: required,
  employmentType: text,
  location: text,
  startDate: text,
  endDate: text,
  description: long.min(1),
  technologies: list,
  highlights: z.array(long.min(1)).max(30),
  link: externalUrl,
});
export const skillSchema = z.object({
  ...common,
  name: required,
  category: required,
  icon: text,
  evidenceUrl: externalUrl,
  projectIds: z.array(z.string().max(100)).max(30),
});
export const certificationSchema = z.object({
  ...common,
  title: required,
  issuer: text,
  issueDate: text,
  credentialId: text,
  verificationUrl: externalUrl,
  previewUrl: assetUrl,
  category: required,
  skills: list,
});
export const educationSchema = z.object({
  ...common,
  degree: required,
  institution: required,
  location: text,
  startDate: text,
  endDate: text,
  specialization: text,
  grade: text,
  coursework: list,
  achievements: long,
});
export const achievementSchema = z
  .object({
    ...common,
    title: required,
    organization: text,
    date: text,
    description: long.min(1),
    verificationUrl: externalUrl,
    doi: text,
  })
  .refine((v) => !v.published || Boolean(v.verificationUrl), {
    message: "Add a verification link before publishing an achievement.",
    path: ["verificationUrl"],
  });
export const socialSchema = z.object({
  ...common,
  label: required,
  url: externalUrl.refine(Boolean, "A URL is required."),
});
export const settingsSchema = z.object({
  id: z.literal("site").optional(),
  title: required,
  description: long.min(1).max(500),
  showCertifications: z.boolean(),
});
export const schemas = {
  profile: profileSchema,
  projects: projectSchema,
  experience: experienceSchema,
  skills: skillSchema,
  certifications: certificationSchema,
  education: educationSchema,
  achievements: achievementSchema,
  social: socialSchema,
  settings: settingsSchema,
};
export type Entity = keyof typeof schemas;
export type Project = z.infer<typeof projectSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type Social = z.infer<typeof socialSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type Portfolio = {
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  education: Education[];
  achievements: Achievement[];
  social: Social[];
  settings: Settings;
};
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  email: z.email("Please enter a valid email.").max(254),
  subject: z.string().trim().min(3, "Add a short subject.").max(150),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters.")
    .max(5000),
  website: z.string().max(200).optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;
export function publicProject(project: Project): Project {
  return {
    ...project,
    repositoryUrl: project.allowRepository ? project.repositoryUrl : "",
    cover: project.allowImages ? project.cover : "",
    images: project.allowImages ? project.images : [],
  };
}
export function publishedPortfolio(data: Portfolio): Portfolio {
  return {
    ...data,
    profile: {
      ...data.profile,
      phone: data.profile.showPhone ? data.profile.phone : "",
    },
    projects: data.projects.filter((v) => v.published).map(publicProject),
    experience: data.experience.filter((v) => v.published),
    skills: data.skills
      .filter((v) => v.published)
      .map((v) => ({
        ...v,
        projectIds: v.projectIds.filter((id) =>
          data.projects.some((p) => p.id === id && p.published),
        ),
      })),
    certifications: data.certifications.filter((v) => v.published),
    education: data.education.filter((v) => v.published),
    achievements: data.achievements.filter(
      (v) => v.published && v.verificationUrl,
    ),
    social: data.social.filter((v) => v.published),
  };
}
