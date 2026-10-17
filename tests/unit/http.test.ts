import { afterEach, describe, expect, it, vi } from "vitest";
import { checkOrigin, readJson } from "@/server/http";
afterEach(() => vi.unstubAllEnvs());
describe("request security", () => {
  it("rejects cross-origin mutations", () => {
    vi.stubEnv("BETTER_AUTH_URL", "https://portfolio.example");
    expect(() =>
      checkOrigin(
        new Request("https://portfolio.example/api/admin", {
          headers: { origin: "https://attacker.example" },
        }),
      ),
    ).toThrow();
  });
  it("rejects missing origin", () => {
    expect(() =>
      checkOrigin(new Request("http://localhost/api/contact")),
    ).toThrow();
  });
  it("accepts the configured origin", () => {
    vi.stubEnv("BETTER_AUTH_URL", "https://portfolio.example");
    expect(() =>
      checkOrigin(
        new Request("https://portfolio.example/api/admin", {
          headers: { origin: "https://portfolio.example" },
        }),
      ),
    ).not.toThrow();
  });
  it("enforces body limits even without Content-Length", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ long: "a".repeat(100) }),
    });
    await expect(readJson(req, 20)).rejects.toMatchObject({ status: 413 });
  });
  it("rejects malformed JSON", async () => {
    await expect(
      readJson(
        new Request("http://localhost", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{",
        }),
      ),
    ).rejects.toMatchObject({ status: 400 });
  });
});
