import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { db } from "@/server/db";
import {
  readPortfolio,
  saveRecord,
  deleteRecord,
} from "@/server/repositories/content";
import { consumeLimit } from "@/server/services/rate-limit";
import { seedPortfolio } from "@/content/portfolio";
import { publishedPortfolio } from "@/lib/content-schema";
const url = process.env.TEST_DATABASE_URL;
describe.skipIf(!url)("PostgreSQL integration", () => {
  const ids: string[] = [];
  const rateKey = `test-${randomUUID()}`;
  beforeAll(() => {
    if (!url || !new URL(url).pathname.endsWith("_test"))
      throw new Error("Use a dedicated database ending in _test");
    process.env.DATABASE_URL = url;
  });
  afterAll(async () => {
    if (ids.length)
      await db().project.deleteMany({ where: { id: { in: ids } } });
    await db().rateLimit.deleteMany({ where: { id: rateKey } });
    await db().$disconnect();
  });
  it("creates, edits, publishes, and deletes relational project content", async () => {
    const id = `test-${randomUUID()}`;
    ids.push(id);
    const input = {
      ...seedPortfolio.projects[1],
      id,
      slug: id,
      published: false,
    };
    await saveRecord("projects", input);
    let data = await readPortfolio();
    expect(data.projects.find((p) => p.id === id)?.technologies).toEqual(
      input.technologies,
    );
    expect(publishedPortfolio(data).projects.some((p) => p.id === id)).toBe(
      false,
    );
    await saveRecord("projects", {
      ...input,
      title: "Updated test project",
      published: true,
      technologies: ["Python", "SQL"],
    });
    data = await readPortfolio();
    expect(
      publishedPortfolio(data).projects.find((p) => p.id === id)?.title,
    ).toBe("Updated test project");
    expect(data.projects.find((p) => p.id === id)?.technologies).toEqual([
      "Python",
      "SQL",
    ]);
    await deleteRecord("projects", id);
    expect(await db().projectSection.count({ where: { projectId: id } })).toBe(
      0,
    );
  });
  it("enforces rate limits atomically across concurrent callers", async () => {
    const results = await Promise.all(
      Array.from({ length: 12 }, () => consumeLimit(rateKey, 5, 60)),
    );
    expect(results.filter(Boolean)).toHaveLength(5);
  });
});
