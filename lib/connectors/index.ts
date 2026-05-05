import { applyGreenhouse } from "./greenhouse";
import { applyLever } from "./lever";
import { ConnectorInput, ConnectorResult, detectPlatform } from "./types";

export async function routeApplication(input: ConnectorInput): Promise<ConnectorResult> {
  const platform = detectPlatform(input.jobUrl);

  if (platform === "greenhouse") return applyGreenhouse(input);
  if (platform === "lever") return applyLever(input);

  return {
    status: "NEEDS_USER_ACTION",
    platform,
    nextUrl: input.jobUrl,
    notes:
      `${platform} detected. Use the Chrome extension for assisted autofill. Fully automated submission is intentionally not enabled for this platform in the MVP.`
  };
}
