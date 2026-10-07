import type { MetadataRoute } from "next";
import { SITE_URL, PUBLIC_API_URL } from "@/lib/site-url";
import { BusinessCategory, categoryPath } from "@/lib/categories";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    "",
    "/categories",
    "/locations",
    "/about",
    "/contact",
    "/faq",
    "/blog",
    "/terms",
    "/privacy",
    "/trust",
    "/sell",
    "/careers",
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
  await Promise.all([
    (async () => {
      try {
        const response = await fetch(`${PUBLIC_API_URL}/business-categories`, {
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) return;
        const categories: BusinessCategory[] = await response.json();
        if (!Array.isArray(categories)) return;
        const populated = new Set(
          categories
            .filter((c) => (c.businessCount ?? c._count?.businesses ?? 0) > 0)
            .flatMap((c) =>
              categoryPath(categories, c.id).map((parent) => parent.id),
            ),
        );
        for (const c of categories)
          if (c.status !== "INACTIVE" && populated.has(c.id))
            entries.push({
              url: `${SITE_URL}/c/${encodeURIComponent(c.slug)}`,
              changeFrequency: "weekly",
              priority: 0.7,
            });
      } catch {
        console.warn("Category sitemap entries unavailable");
      }
    })(),
    (async () => {
      try {
        const response = await fetch(
          `${PUBLIC_API_URL}/admin/cms/public/blog`,
          { next: { revalidate: 3600 }, signal: AbortSignal.timeout(10000) },
        );
        if (!response.ok) return;
        const posts = await response.json();
        if (!Array.isArray(posts)) return;
        for (const post of posts)
          if (typeof post.slug === "string" && post.slug)
            entries.push({
              url: `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`,
              lastModified: post.updatedAt || post.publishedAt || undefined,
              changeFrequency: "monthly",
              priority: 0.6,
            });
      } catch {
        console.warn("Blog sitemap entries unavailable");
      }
    })(),
  ]);
  return entries;
}
