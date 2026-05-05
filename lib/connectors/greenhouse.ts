import { ConnectorInput, ConnectorResult } from "./types";

/**
 * Greenhouse connector strategy:
 * - Greenhouse Job Board pages are more structured than Workday/Dayforce.
 * - Real production submission may require parsing board token, job id, required custom questions,
 *   resume upload, and sometimes CAPTCHA.
 * - This MVP returns user-assisted mode and gives the extension a clean path.
 */
export async function applyGreenhouse(input: ConnectorInput): Promise<ConnectorResult> {
  if (!input.jobUrl) {
    return {
      status: "FAILED",
      platform: "greenhouse",
      notes: "Missing Greenhouse job URL."
    };
  }

  return {
    status: "NEEDS_USER_ACTION",
    platform: "greenhouse",
    nextUrl: input.jobUrl,
    notes:
      "Greenhouse detected. Use the Chrome extension to autofill the form with the approved resume, cover letter, and answers. Production upgrade: add board-token/job-id parsing and handle required custom questions."
  };
}
