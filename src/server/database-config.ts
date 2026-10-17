import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PoolConfig } from "pg";

const certificatePath = () => resolve("config/certs/supabase-ca.crt");
const isSupabase = (url: URL) =>
  /\.(supabase\.com|supabase\.co)$/.test(url.hostname);

/** Derive transport settings in memory; never rewrite environment credentials. */
export function databaseConfig(connectionString: string): PoolConfig {
  const url = new URL(connectionString);
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

export function migrationUrl(connectionString: string): string {
  const url = new URL(connectionString);
  if (!isSupabase(url)) return connectionString;
  url.searchParams.set("sslmode", "require");
  url.searchParams.set("sslaccept", "strict");
  url.searchParams.set("sslcert", certificatePath());
  return url.toString();
}
