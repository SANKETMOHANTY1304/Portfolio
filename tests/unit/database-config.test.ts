import { describe, expect, it } from "vitest";
import { databaseConfig, migrationUrl } from "../../src/server/database-config";

describe("database TLS configuration", () => {
  it("enforces verified Supabase TLS even when the input URL requests disabled TLS", () => {
    const url =
      "postgresql://test:encoded%40password@aws-0-test.pooler.supabase.com:6543/postgres?sslmode=disable";
    const config = databaseConfig(url);
    expect(config.ssl).toMatchObject({ rejectUnauthorized: true });
    expect(new URL(config.connectionString!).searchParams.has("sslmode")).toBe(
      false,
    );
    expect(new URL(config.connectionString!).password).toBe(
      "encoded%40password",
    );
  });
  it("does not apply Supabase trust settings to unrelated hosts", () => {
    const url =
      "postgresql://test:password@supabase.com.example.org:5432/portfolio";
    expect(databaseConfig(url)).toEqual({ connectionString: url });
    expect(migrationUrl(url)).toBe(url);
  });
  it("requires strict certificate validation for Supabase migrations", () => {
    const url = new URL(
      migrationUrl(
        "postgresql://test:password@db.test.supabase.co:5432/postgres",
      ),
    );
    expect(url.searchParams.get("sslmode")).toBe("require");
    expect(url.searchParams.get("sslaccept")).toBe("strict");
    expect(url.searchParams.get("sslcert")).toMatch(/supabase-ca\.crt$/);
  });
});
