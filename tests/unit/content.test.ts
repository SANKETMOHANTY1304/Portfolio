import { describe, expect, it } from "vitest";
import {
  contactSchema,
  projectSchema,
  publishedPortfolio,
  externalUrl,
  assetUrl,
} from "@/lib/content-schema";
import { seedPortfolio } from "@/content/portfolio";
import { jsonLd } from "@/lib/utils";
describe("content boundaries", () => {
  it("keeps draft projects and credentials out of public content", () => {
    const result = publishedPortfolio(seedPortfolio);
    expect(result.projects.some((p) => p.id === "heart-sounds")).toBe(false);
    expect(result.certifications).toEqual([]);
  });
  it("strips private links and images even when present in the database", () => {
    const data = structuredClone(seedPortfolio);
    const p = data.projects[0];
    p.repositoryUrl = "https://github.com/private/project";
    p.cover = "/images/private.png";
    p.images = [{ url: "/images/private.png", alt: "Private" }];
    const result = publishedPortfolio(data);
    expect(result.projects[0].repositoryUrl).toBe("");
    expect(result.projects[0].cover).toBe("");
    expect(result.projects[0].images).toEqual([]);
  });
  it("does not serialize a hidden phone number", () => {
    const data = structuredClone(seedPortfolio);
    data.profile.phone = "123456789";
    expect(publishedPortfolio(data).profile.phone).toBe("");
  });
  it("rejects unsafe URLs and slugs", () => {
    expect(externalUrl.safeParse("javascript:alert(1)").success).toBe(false);
    expect(
      assetUrl.safeParse("https://untrusted.example/file.svg").success,
    ).toBe(false);
    expect(
      projectSchema.safeParse({
        ...seedPortfolio.projects[0],
        slug: "../../admin",
      }).success,
    ).toBe(false);
  });
  it("enforces server-side input length limits", () => {
    expect(
      contactSchema.safeParse({
        name: "Visitor",
        email: "visitor@example.com",
        subject: "Hello",
        message: "x".repeat(5001),
      }).success,
    ).toBe(false);
  });
  it("prevents script termination in structured metadata", () => {
    expect(jsonLd({ name: "</script><script>bad()</script>" })).not.toContain(
      "<",
    );
  });
  it("all seed records conform to the schema", async () => {
    const { schemas } = await import("@/lib/content-schema");
    for (const entity of Object.keys(schemas) as (keyof typeof schemas)[]) {
      const data = seedPortfolio[entity];
      for (const record of Array.isArray(data) ? data : [data])
        expect(
          schemas[entity].safeParse(record).success,
          `${entity} record`,
        ).toBe(true);
    }
  });
});
