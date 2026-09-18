import { createAuthClient } from "better-auth/react";
import { runSignOut } from "../../../scripts/sign-out-plan.mjs";

/** Standalone Better Auth client. No Grok account or Grok broker is required. */
export const authClient = createAuthClient({});

export const authEnabled = import.meta.env.VITE_AUTH_ENABLED !== "false";

export async function signOut(): Promise<void> {
  await runSignOut({
    requestSignOut: () => authClient.signOut(),
    clearToken: () => undefined,
  });
}
