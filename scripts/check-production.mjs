// Read-only checks. Never submits forms, bookings, messages or payments.
const site = (process.env.SITE_URL || "https://www.luxeevents.fun").replace(
  /\/$/,
  "",
);
const api = (
  process.env.API_URL || "https://event-marketplace-api.onrender.com"
).replace(/\/$/, "");
const checks = [
  [site + "/", 200],
  [site + "/categories", 200],
  [site + "/robots.txt", 200],
  [site + "/sitemap.xml", 200],
  [api + "/health", 200],
  [api + "/business-categories", 200],
  [api + "/discovery/search?limit=1", 200],
  [api + "/contact", 401],
  [api + "/admin/cms/public/settings/email", 404],
];
let failures = 0;
await Promise.all(
  checks.map(async ([url, expected]) => {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      const ok = response.status === expected;
      console.log(
        `${ok ? "PASS" : "FAIL"} ${url} (${response.status}, expected ${expected})`,
      );
      if (!ok) failures++;
    } catch {
      failures++;
      console.log(`FAIL ${url} (unreachable)`);
    }
  }),
);
process.exitCode = failures ? 1 : 0;
