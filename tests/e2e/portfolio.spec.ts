import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const chapterPaths = [
  "/",
  "/about",
  "/projects",
  "/experience",
  "/skills",
  "/education",
  "/contact",
];
test("every chapter has its own page, navigation, and preserved content", async ({
  page,
}) => {
  for (const path of chapterPaths) {
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    const pager = page.getByRole("navigation", { name: "Portfolio pages" });
    await expect(pager.locator('[aria-current="page"]')).toHaveAttribute(
      "href",
      path,
    );
    await expect(pager.getByRole("link")).toHaveCount(path === "/" ? 8 : 9);
  }
  await page.goto("/about");
  await expect(page.locator(".work-item")).not.toHaveCount(0);
  await page.goto("/experience");
  await page.getByText("Explore responsibilities").first().click();
  await expect(page.locator("details[open] li").first()).toBeVisible();
  await page.goto("/skills");
  await expect(
    page.getByRole("group", { name: "Filter skills" }),
  ).toBeVisible();
  await page.goto("/education");
  await expect(page.getByText("Learning is part of the work.")).toBeVisible();
});
test("project pagination, search, and filters work together", async ({
  page,
}) => {
  await page.goto("/projects");
  await expect(page.locator(".project-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Next project results page" }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Project results page 2", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.getByRole("textbox", { name: "Search projects" }).fill("Fraud");
  await expect(
    page.getByRole("heading", { name: "Fraud detection & risk scoring" }),
  ).toBeVisible();
  await expect(page.locator(".gallery-results")).toContainText("PAGE 1 OF 1");
  await page
    .getByRole("textbox", { name: "Search projects" })
    .fill("no-match-here");
  await expect(
    page.getByRole("heading", { name: "No matching projects" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Show all work/ }).click();
  await expect(page.locator(".project-card")).toHaveCount(3);
});
test("homepage, navigation, filtering, and case study", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Building intelligent",
  );
  await page.getByRole("link", { name: "Explore my work" }).click();
  await page
    .getByRole("button", { name: "Deep Learning", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Human activity recognition",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Fraud detection & risk scoring" }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Explore case study" }).click();
  await expect(page).toHaveURL(/human-activity-recognition/);
  await expect(
    page.getByRole("heading", { name: "Technical implementation" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("all published case studies and the resume render", async ({ page }) => {
  for (const slug of [
    "chapter-aware-multimodal-rag",
    "fraud-risk-scoring",
    "human-activity-recognition",
    "sales-customer-segmentation",
  ]) {
    const res = await page.goto(`/projects/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: "Results and evaluation" }),
    ).toBeVisible();
  }
  await page.goto("/resume");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Sanket Mohanty",
  );
  const pdf = await page.request.get("/documents/Sanket_M_Resume.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
});
test("draft projects return 404", async ({ page }) => {
  expect((await page.goto("/projects/heart-sound-analysis"))?.status()).toBe(
    404,
  );
});
test("contact validates before submitting", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Please enter your full name.")).toBeVisible();
  await expect(page.getByText("Please enter a valid email.")).toBeVisible();
  await expect(
    page.getByText("Please write at least 20 characters."),
  ).toBeVisible();
});
for (const width of [375, 768, 1024, 1440])
  test(`layout fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
    for (const path of chapterPaths.slice(1)) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      if (
        (width === 375 || width === 1440) &&
        ["/about", "/projects", "/contact"].includes(path)
      )
        await page.screenshot({
          path: "test-results/page-" + path.slice(1) + "-" + width + ".png",
          fullPage: true,
        });
    }
    if (width === 375) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "Projects", exact: true })
        .click();
      await expect(page).toHaveURL(/\/projects$/);
      await expect(page.getByRole("dialog")).toHaveCount(0);
    }
  });
test("theme preference survives reload and main page passes axe", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const light = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(light.violations).toEqual([]);
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  const dark = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(dark.violations).toEqual([]);
});
test("chapter pages pass accessibility checks in both themes", async ({
  page,
}) => {
  test.setTimeout(150000);
  for (const theme of ["light", "dark"]) {
    await page.goto("/");
    if ((await page.locator("html").getAttribute("data-theme")) !== theme)
      await page.getByRole("button", { name: "Toggle color theme" }).click();
    for (const path of chapterPaths.slice(1)) {
      await page.goto(path);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(result.violations, path + " " + theme).toEqual([]);
    }
  }
});
test("admin routes and mutations reject anonymous visitors", async ({
  page,
  request,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/admin\/login/);
  for (const [path, method] of [
    ["/api/admin/content/projects", "post"],
    ["/api/admin/upload", "post"],
    ["/api/admin/messages/nope", "delete"],
  ] as const) {
    const response = await request[method](path, { data: {} });
    expect(response.status()).toBe(401);
  }
  expect(
    (await request.post("/api/auth/sign-up/email", { data: {} })).status(),
  ).toBe(404);
});
test.describe("configured database flows", () => {
  test.skip(
    !process.env.TEST_DATABASE_URL ||
      !process.env.E2E_ADMIN_EMAIL ||
      !process.env.E2E_ADMIN_PASSWORD,
    "Requires the documented isolated database fixture.",
  );
  test("contact persists and admin can read, archive, and delete it", async ({
    page,
  }) => {
    const subject = `E2E contact ${Date.now()}`;
    await page.goto("/contact");
    await page
      .getByLabel("Your name", { exact: true })
      .fill("Portfolio Test Visitor");
    await page
      .getByRole("textbox", { name: "Email address", exact: true })
      .fill("visitor@example.com");
    await page.getByLabel("Subject", { exact: true }).fill(subject);
    await page
      .getByLabel("Your message", { exact: true })
      .fill("This is an automated contact test for database persistence.");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(
      page.getByText("Message received. Thanks for reaching out!"),
    ).toBeVisible();
    await login(page);
    await page.getByRole("link", { name: "Contact inbox" }).click();
    const card = page.getByRole("article").filter({ hasText: subject });
    await expect(card).toBeVisible();
    await expect(card).toContainText("Email notification: failed");
    await card.getByRole("button", { name: "Mark read" }).click();
    await expect(card.getByText("Unread", { exact: true })).toHaveCount(0);
    await card.getByRole("button", { name: "Archive", exact: true }).click();
    await page.getByRole("link", { name: "View archive" }).click();
    const archived = page.getByRole("article").filter({ hasText: subject });
    await archived.getByRole("button", { name: "Delete this message" }).click();
    await page.getByRole("button", { name: "Delete permanently" }).click();
    await expect(
      page.getByRole("article").filter({ hasText: subject }),
    ).toHaveCount(0);
  });
  test("admin creates, edits, publishes, and deletes a project", async ({
    page,
    request,
  }) => {
    await login(page);
    const slug = `e2e-project-${Date.now()}`;
    await page.getByRole("button", { name: "Add project" }).click();
    await page
      .getByLabel("Project title", { exact: true })
      .fill("E2E draft project");
    await page.getByLabel("URL slug", { exact: true }).fill(slug);
    await page
      .getByLabel("Problem statement / summary", { exact: true })
      .fill("A project created by an end-to-end test.");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect((await request.get(`/projects/${slug}`)).status()).toBe(404);
    await page
      .getByRole("button", { name: "Edit E2E draft project", exact: true })
      .click();
    await page
      .getByLabel("Project title", { exact: true })
      .fill("E2E published project");
    await page
      .getByLabel("Published — visible to visitors", { exact: true })
      .check();
    await page
      .getByRole("button", { name: "Add section", exact: true })
      .click();
    await page.getByLabel("Section title", { exact: true }).fill("Overview");
    await page
      .getByLabel("Content", { exact: true })
      .fill("A persisted and published case study.");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect
      .poll(async () => (await request.get(`/projects/${slug}`)).status())
      .toBe(200);
    const cookies = await page.context().cookies();
    const crossOrigin = await page.request.post("/api/admin/content/projects", {
      headers: { origin: "https://attacker.example" },
      data: {},
    });
    expect(crossOrigin.status()).toBe(403);
    expect(cookies.some((c) => c.httpOnly)).toBe(true);
    await page
      .getByRole("button", {
        name: "Delete E2E published project",
        exact: true,
      })
      .click();
    await page.getByRole("button", { name: "Delete permanently" }).click();
    await expect(
      page.getByRole("heading", { name: "E2E published project" }),
    ).toHaveCount(0);
  });
});
async function login(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page
    .getByLabel("Email", { exact: true })
    .fill(process.env.E2E_ADMIN_EMAIL!);
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your work, well presented." }),
  ).toBeVisible();
}
