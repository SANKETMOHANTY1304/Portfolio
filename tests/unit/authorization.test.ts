import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  user: vi.fn(),
  configured: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/server/auth", () => ({
  authConfigured: mocks.configured,
  auth: () => ({ api: { getSession: mocks.session } }),
}));
vi.mock("@/server/db", () => ({
  db: () => ({ user: { findUnique: mocks.user } }),
}));
import { currentAdmin, requireAdmin } from "@/server/auth/authorize";
beforeEach(() => {
  mocks.configured.mockReturnValue(true);
  mocks.session.mockResolvedValue({ user: { id: "owner" } });
  mocks.user.mockResolvedValue({ id: "owner", name: "Owner", role: "admin" });
});
describe("admin authorization", () => {
  it("denies anonymous sessions", async () => {
    mocks.session.mockResolvedValue(null);
    await expect(requireAdmin()).rejects.toMatchObject({ status: 401 });
  });
  it("checks current database role instead of trusting session claims", async () => {
    mocks.user.mockResolvedValue({ id: "owner", role: "user" });
    expect(await currentAdmin()).toBeNull();
  });
  it("allows a provisioned administrator", async () => {
    expect((await requireAdmin()).id).toBe("owner");
  });
  it("fails closed when authentication is unconfigured", async () => {
    mocks.configured.mockReturnValue(false);
    expect(await currentAdmin()).toBeNull();
  });
});
