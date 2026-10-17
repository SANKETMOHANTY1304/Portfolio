import { describe, expect, it, vi } from "vitest";
import { acceptContact } from "@/server/services/contact";
const message = {
  name: "Test Visitor",
  email: "visitor@example.com",
  subject: "Portfolio question",
  message: "I would like to discuss an engineering opportunity.",
};
function deps() {
  return {
    allowed: vi.fn().mockResolvedValue(true),
    save: vi.fn().mockResolvedValue({ id: "saved-message" }),
    notify: vi.fn().mockResolvedValue(true),
    mark: vi.fn().mockResolvedValue(undefined),
  };
}
describe("contact delivery", () => {
  it("stores before attempting notification", async () => {
    const d = deps();
    await expect(acceptContact(message, d)).resolves.toEqual({ ok: true });
    expect(d.save.mock.invocationCallOrder[0]).toBeLessThan(
      d.notify.mock.invocationCallOrder[0],
    );
    expect(d.mark).toHaveBeenCalledWith("saved-message", true);
  });
  it("keeps a saved message successful when email fails", async () => {
    const d = deps();
    d.notify.mockRejectedValue(new Error("Email outage"));
    await expect(acceptContact(message, d)).resolves.toEqual({ ok: true });
    expect(d.mark).toHaveBeenCalledWith("saved-message", false);
  });
  it("does not lose a submission when status bookkeeping fails", async () => {
    const d = deps();
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    d.mark.mockRejectedValue(new Error("Temporary failure"));
    await expect(acceptContact(message, d)).resolves.toEqual({ ok: true });
    log.mockRestore();
  });
  it("discards honeypot messages without persistence", async () => {
    const d = deps();
    await acceptContact({ ...message, website: "spam.example" }, d);
    expect(d.save).not.toHaveBeenCalled();
    expect(d.notify).not.toHaveBeenCalled();
  });
  it("rejects rate-limited requests before saving", async () => {
    const d = deps();
    d.allowed.mockResolvedValue(false);
    await expect(acceptContact(message, d)).rejects.toMatchObject({
      status: 429,
    });
    expect(d.save).not.toHaveBeenCalled();
  });
  it("does not send mail when the database fails", async () => {
    const d = deps();
    d.save.mockRejectedValue(new Error("Database outage"));
    await expect(acceptContact(message, d)).rejects.toThrow();
    expect(d.notify).not.toHaveBeenCalled();
  });
});
