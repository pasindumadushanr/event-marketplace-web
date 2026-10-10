import "server-only";
import { cache } from "react";
import { DEFAULT_PLATFORM, isPlatformSettings } from "./platform-settings";
export const getPlatformSettings = cache(async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/admin/cms/public/platform-settings`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) },
    );
    if (response.ok) {
      const value: unknown = await response.json();
      if (isPlatformSettings(value)) return value;
    }
  } catch {
    /* Preserve built-in branding and analytics during backend outages. */
  }
  return DEFAULT_PLATFORM;
});
