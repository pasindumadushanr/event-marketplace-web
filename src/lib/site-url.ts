// The production canonical stays stable even if Vercel still has the old env value.
export const SITE_URL = "https://nakathata.lk";
export const PUBLIC_API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://event-marketplace-api.onrender.com"
).replace(/\/$/, "");
