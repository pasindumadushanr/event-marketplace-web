export const DEFAULT_GENERAL = {
  siteName: "Nakathata.lk",
  contactEmail: "support@nakathata.lk",
  supportPhone: "",
  contactAddress: "Sri Lanka",
  currency: "LKR",
};
export const DEFAULT_SEO = {
  metaTitle: "Nakathata.lk | Wedding Venues & Event Services in Sri Lanka",
  metaDescription:
    "Find wedding venues, photographers, bridal wear, cakes, wedding cars and event services across Sri Lanka. Explore vendors and contact your wedding team on Nakathata.lk.",
  keywords: "events, weddings, photography, catering, sri lanka",
};
export const DEFAULT_SOCIAL = {
  website: "https://nakathata.lk",
  facebook: "https://web.facebook.com/profile.php?id=61595001868271",
  instagram: "https://www.instagram.com/nakathata.lk/",
  linkedin: "",
  twitter: "",
  youtube: "https://www.youtube.com/channel/UCYSC4gU8KyQuhFn7p3RUjMw",
  tiktok: "https://www.tiktok.com/@nakathata.lk",
};
export type PlatformSettings = {
  general: typeof DEFAULT_GENERAL;
  seo: typeof DEFAULT_SEO;
  social: typeof DEFAULT_SOCIAL;
  analytics: { googleAnalyticsId: string | null };
};
export const DEFAULT_PLATFORM: PlatformSettings = {
  general: DEFAULT_GENERAL,
  seo: DEFAULT_SEO,
  social: DEFAULT_SOCIAL,
  analytics: { googleAnalyticsId: null },
};
export function isPlatformSettings(value: unknown): value is PlatformSettings {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  for (const [group, defaults] of Object.entries({
    general: DEFAULT_GENERAL,
    seo: DEFAULT_SEO,
    social: DEFAULT_SOCIAL,
  })) {
    const record = data[group];
    if (!record || typeof record !== "object") return false;
    if (
      !Object.keys(defaults).every(
        (key) => typeof (record as Record<string, unknown>)[key] === "string",
      )
    )
      return false;
  }
  const analytics = data.analytics as
    { googleAnalyticsId?: unknown } | undefined;
  return (
    !!analytics &&
    (analytics.googleAnalyticsId === null ||
      typeof analytics.googleAnalyticsId === "string")
  );
}
export function analyticsId(
  settings: PlatformSettings,
  environmentId?: string,
) {
  const value = settings.analytics.googleAnalyticsId ?? environmentId ?? "";
  return /^G-[A-Z0-9]{5,20}$/.test(value) ? value : "";
}
