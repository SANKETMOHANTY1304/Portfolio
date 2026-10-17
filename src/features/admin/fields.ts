import type { Entity } from "@/lib/content-schema";
export type Field = {
  name: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "checkbox"
    | "number"
    | "list"
    | "select"
    | "asset"
    | "sections"
    | "images"
    | "projects";
  options?: string[];
  help?: string;
};
const f = (
  name: string,
  label: string,
  type: Field["type"] = "text",
  help?: string,
): Field => ({ name, label, type, help });
const common = [
  f("displayOrder", "Display order", "number", "Lower numbers appear first."),
  f("published", "Published — visible to visitors", "checkbox"),
];
export const entityLabels: Record<Entity, string> = {
  profile: "Profile & homepage",
  projects: "Projects",
  experience: "Experience",
  skills: "Skills",
  certifications: "Certifications",
  education: "Education",
  achievements: "Publications & awards",
  social: "Social links",
  settings: "Site settings",
};
export const fields: Record<Entity, Field[]> = {
  profile: [
    f("name", "Full name"),
    f("designation", "Professional designation"),
    f("headline", "Hero headline"),
    f("introduction", "Hero introduction", "textarea"),
    f("about", "About me", "textarea"),
    f("focus", "Current engineering focus", "textarea"),
    f("focusTitle", "Hero specialization label"),
    f("specializations", "What I work on", "sections"),
    f("goals", "Career goals", "textarea"),
    f("email", "Public email"),
    f("phone", "Phone (optional)"),
    f("showPhone", "Show phone publicly", "checkbox"),
    f("location", "Location"),
    f("image", "Headshot", "asset"),
    f("resumeUrl", "Resume PDF", "asset"),
  ],
  projects: [
    f("title", "Project title"),
    f("slug", "URL slug", "text", "Lowercase words separated by hyphens."),
    f("summary", "Problem statement / summary", "textarea"),
    {
      name: "category",
      label: "Category",
      type: "select",
      options: [
        "AI/ML",
        "Generative AI",
        "Backend",
        "Data Science",
        "Deep Learning",
        "Full-Stack",
      ],
    },
    f("technologies", "Technologies", "list"),
    f("cover", "Cover image", "asset"),
    f("coverAlt", "Cover image description"),
    {
      name: "visual",
      label: "Fallback illustration",
      type: "select",
      options: ["graph", "fraud", "activity", "audio", "data"],
    },
    f("repositoryUrl", "GitHub repository URL"),
    f("demoUrl", "Live demo URL"),
    f("workRelated", "Work-related / proprietary project", "checkbox"),
    f("allowRepository", "Allow public repository link", "checkbox"),
    f("allowImages", "Allow public screenshots and cover image", "checkbox"),
    f("featured", "Featured project", "checkbox"),
    f("sections", "Case study sections", "sections"),
    f("images", "Screenshots & diagrams", "images"),
    ...common,
  ],
  experience: [
    f("company", "Company"),
    f("position", "Position"),
    f("employmentType", "Employment type"),
    f("location", "Location"),
    f("startDate", "Start date"),
    f("endDate", "End date / Present"),
    f("description", "Summary", "textarea"),
    f("highlights", "Responsibilities & achievements", "list"),
    f("technologies", "Technologies", "list"),
    f("link", "Supporting link"),
    ...common,
  ],
  skills: [
    f("name", "Skill"),
    f("category", "Category"),
    f("icon", "Icon label (optional)"),
    f("evidenceUrl", "Evidence link"),
    f("projectIds", "Related projects", "projects"),
    ...common,
  ],
  certifications: [
    f("title", "Certificate title"),
    f("issuer", "Issuing organization"),
    f("issueDate", "Issue date"),
    f("credentialId", "Credential ID"),
    f("verificationUrl", "Verification URL"),
    f("previewUrl", "Certificate preview", "asset"),
    f("category", "Category"),
    f("skills", "Related skills", "list"),
    ...common,
  ],
  education: [
    f("degree", "Degree"),
    f("institution", "Institution"),
    f("location", "Location"),
    f("startDate", "Start date"),
    f("endDate", "End date"),
    f("specialization", "Specialization"),
    f("grade", "Grade (optional)"),
    f("coursework", "Relevant coursework", "list"),
    f("achievements", "Academic achievements", "textarea"),
    ...common,
  ],
  achievements: [
    f("title", "Title"),
    f("organization", "Publication / award organization"),
    f("date", "Date"),
    f("description", "Description", "textarea"),
    f(
      "verificationUrl",
      "Verification URL",
      "text",
      "Required before publishing.",
    ),
    f("doi", "DOI"),
    ...common,
  ],
  social: [
    f("label", "Platform / label"),
    f("url", "HTTPS profile URL"),
    ...common,
  ],
  settings: [
    f("title", "SEO page title"),
    f("description", "SEO description", "textarea"),
    f("showCertifications", "Show certifications section", "checkbox"),
  ],
};
export function emptyRecord(entity: Entity): Record<string, unknown> {
  return Object.fromEntries(
    fields[entity].map((field) => [
      field.name,
      field.type === "checkbox"
        ? false
        : field.type === "number"
          ? 0
          : ["list", "sections", "images", "projects"].includes(
                field.type || "",
              )
            ? []
            : field.type === "select"
              ? field.options?.[0] || ""
              : "",
    ]),
  );
}
