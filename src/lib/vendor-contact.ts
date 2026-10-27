export type SocialField =
  "website" | "facebook" | "instagram" | "youtube" | "tiktok";
const hosts: Record<Exclude<SocialField, "website">, string[]> = {
  facebook: ["facebook.com", "fb.com", "fb.me", "fb.watch"],
  instagram: ["instagram.com", "instagr.am"],
  youtube: ["youtube.com", "youtu.be"],
  tiktok: ["tiktok.com"],
};
export function publicContactUrl(
  value: unknown,
  field: SocialField = "website",
): string | null {
  if (typeof value !== "string" || !value.trim() || value.length > 2048)
    return null;
  const raw = value.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw) && !/^https?:\/\//i.test(raw))
    return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      !url.hostname.includes(".")
    )
      return null;
    if (
      field !== "website" &&
      !hosts[field].some(
        (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
      )
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}

// An explicitly cleared canonical field must not fall back to an older number.
export function vendorWhatsappValue(
  settings:
    { whatsapp?: unknown; contact?: { whatsapp?: unknown } } | null | undefined,
): string {
  const raw =
    settings && Object.prototype.hasOwnProperty.call(settings, "whatsapp")
      ? settings.whatsapp
      : settings?.contact?.whatsapp;
  return typeof raw === "string" ? raw : "";
}
