import type { MetadataRoute } from "next";
import { SITE_URL, PUBLIC_API_URL } from "@/lib/site-url";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    "",
    "/categories",
    "/locations",
    "/search",
    "/about",
    "/contact",
    "/faq",
    "/blog",
    "/terms",
    "/privacy",
    "/trust",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path ? 0.7 : 1,
  }));
  try {
    const response = await fetch(`${PUBLIC_API_URL}/discovery/sitemap`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Sitemap API unavailable");
    for (const business of await response.json())
      entries.push({
        url: `${SITE_URL}/business/${encodeURIComponent(business.slug)}`,
        lastModified: business.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
  } catch {
    console.warn(
      "Vendor sitemap entries unavailable; serving public pages only",
    );
  }
  return entries;
}
