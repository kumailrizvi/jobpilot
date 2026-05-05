import { ConnectorInput, ConnectorResult } from "./types";

/**
 * Lever connector strategy:
 * - Lever forms are relatively consistent.
 * - Public posting pages can be autofilled reliably with the extension.
 * - Direct API submission usually requires employer-side permissions.
 */
export async function applyLever(input: ConnectorInput): Promise<ConnectorResult> {
  if (!input.jobUrl) {
    return {
      status: "FAILED",
      platform: "lever",
      notes: "Missing Lever job URL."
    };
  }

  return {
    status: "NEEDS_USER_ACTION",
    platform: "lever",
    nextUrl: input.jobUrl,
    notes:
      "Lever detected. Use the Chrome extension for assisted autofill. Production upgrade: build a Playwright worker for user-visible sessions, not stealth submission."
  };
}
