// Keep canonicals on the working domain until the new domain is configured.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.luxeevents.fun"
).replace(/\/$/, "");
export const PUBLIC_API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://event-marketplace-api.onrender.com"
).replace(/\/$/, "");
