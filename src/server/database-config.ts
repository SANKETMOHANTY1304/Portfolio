import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PoolConfig } from "pg";

const certificatePath = () => resolve("config/certs/supabase-ca.crt");
const isSupabase = (url: URL) =>
  /\.(supabase\.com|supabase\.co)$/.test(url.hostname);

type DatabaseVariable = "DATABASE_URL" | "DIRECT_URL";

function parseDatabaseUrl(value: string, variable: DatabaseVariable): URL {
  try {
    const url = new URL(value);
    if (
      value !== value.trim() ||
      /[\r\n]/.test(value) ||
      !["postgresql:", "postgres:"].includes(url.protocol) ||
      !url.hostname
    ) {
      throw new Error();
    }
    return url;
  } catch {
    // URL parser errors can contain the input, including its password.
    // Do not retain the original error as a cause or print the supplied value.
    throw new Error(
      `${variable} must be a valid PostgreSQL connection URL starting with postgresql:// or postgres://. Enter only the URL, without surrounding quotes, whitespace, or the variable name and equals sign.`,
    );
  }
}

/** Derive transport settings in memory; never rewrite environment credentials. */
export function databaseConfig(connectionString: string): PoolConfig {
  const url = parseDatabaseUrl(connectionString, "DATABASE_URL");
  if (!isSupabase(url)) return { connectionString };
  // pg's URL SSL options would replace the explicit verified TLS configuration.
  for (const key of [
    "sslmode",
    "sslcert",
    "sslkey",
    "sslrootcert",
    "ssl",
    "uselibpqcompat",
  ])
    url.searchParams.delete(key);
  return {
    connectionString: url.toString(),
    ssl: {
      ca: readFileSync(certificatePath(), "utf8"),
      rejectUnauthorized: true,
    },
  };
}

export function migrationUrl(
  connectionString: string,
  variable: DatabaseVariable = "DIRECT_URL",
): string {
  const url = parseDatabaseUrl(connectionString, variable);
  if (!isSupabase(url)) return connectionString;
  url.searchParams.set("sslmode", "require");
  url.searchParams.set("sslaccept", "strict");
  url.searchParams.set("sslcert", certificatePath());
  return url.toString();
}
