import { cache } from "react";
import { PUBLIC_API_URL } from "@/lib/site-url";
import { pageMetadata, breadcrumbs, jsonLd } from "@/lib/seo";
import { BusinessCategory } from "@/lib/categories";
import CategoryLandingClient from "./CategoryLandingClient";
type Props = { params: Promise<{ categorySlug: string }> };
const load = cache(async (slug: string) => {
  try {
    const [catalog, search] = await Promise.all([
      fetch(`${PUBLIC_API_URL}/business-categories`, {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(10000),
      }),
      fetch(
        `${PUBLIC_API_URL}/discovery/search?categorySlug=${encodeURIComponent(slug)}&page=1`,
        { cache: "no-store", signal: AbortSignal.timeout(10000) },
      ),
    ]);
    if (!catalog.ok || !search.ok) return null;
    const categories: BusinessCategory[] = await catalog.json();
    const results = await search.json();
    if (!Array.isArray(categories) || !Array.isArray(results.data)) return null;
    return {
      categories,
      results,
      category: categories.find((item) => item.slug === slug),
    };
  } catch {
    return null;
  }
});
export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params;
  const data = await load(categorySlug);
  if (!data?.category)
    return {
      title: "Wedding Vendor Category | Nakathata.lk",
      robots: { index: false, follow: true },
    };
  const name = data.category.name;
  return {
    ...pageMetadata(
      `${name} in Sri Lanka | Nakathata.lk`,
      `Explore ${name.toLowerCase()} for weddings and events in Sri Lanka. Compare vendor services, locations and customer reviews, then contact businesses directly.`,
      `/c/${encodeURIComponent(categorySlug)}`,
    ),
    robots: { index: data.results.meta?.total > 0, follow: true },
  };
}
export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const data = await load(categorySlug);
  return (
    <>
      {data?.category && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(
              breadcrumbs([
                { name: "Home", path: "/" },
                { name: "Categories", path: "/categories" },
                {
                  name: data.category.name,
                  path: `/c/${encodeURIComponent(categorySlug)}`,
                },
              ]),
            ),
          }}
        />
      )}
      <CategoryLandingClient
        key={categorySlug}
        initialData={data || undefined}
      />
    </>
  );
}
