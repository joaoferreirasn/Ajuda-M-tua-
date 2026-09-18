/** Standalone Better Auth for Ajuda Mútua. Email/password only. */
import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Pool } from "pg";
import { getCookie } from "@tanstack/react-start/server";
import { ensureDbReady, getPglite } from "../db";
import { emailAndPasswordEnabled } from "./email-password";
import { pgliteDialect } from "./pglite-dialect";

const env = (key: string) => process.env[key]?.trim() || undefined;
const databaseUrl = env("DATABASE_URL");
const explicitBaseURL = env("BETTER_AUTH_URL");
export const authConfigured = Boolean(databaseUrl && env("BETTER_AUTH_SECRET"));
export const SESSION_TOKEN_COOKIE = "__Host-ajuda-mutua.session_token";

const database = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : { dialect: pgliteDialect(() => getPglite()), type: "postgres" as const };

const baseURL = explicitBaseURL ?? "http://localhost:8080";
const trustedOrigins = explicitBaseURL ? [explicitBaseURL] : [
  "http://localhost:8080", "http://127.0.0.1:8080", "http://[::1]:8080",
];

void ensureDbReady();

export const auth = betterAuth({
  baseURL,
  secret: env("BETTER_AUTH_SECRET") ?? "dev-only-change-this-secret",
  database,
  trustedOrigins,
  ...(emailAndPasswordEnabled ? { emailAndPassword: { enabled: true } } : {}),
  session: { cookieCache: { enabled: true, maxAge: 300 } },
  advanced: {
    useSecureCookies: false,
    defaultCookieAttributes: { secure: true, sameSite: "lax", path: "/" },
    cookies: {
      session_token: { name: SESSION_TOKEN_COOKIE },
    },
  },
  plugins: [tanstackStartCookies()],
});

export function readSessionToken(): string | null {
  return getCookie(SESSION_TOKEN_COOKIE) ?? null;
}
