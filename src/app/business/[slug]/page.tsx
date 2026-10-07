import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicBusiness } from "@/lib/public-business";
import { SITE_URL } from "@/lib/site-url";
import BusinessProfileClient from "./BusinessProfileClient";
import { pageMetadata, breadcrumbs, jsonLd } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const business = await getPublicBusiness(slug);
    if (!business)
      return {
        title: "Business not found | Nakathata.lk",
        robots: { index: false, follow: false },
      };
    const seo = business.profileSettings?.seo || {};
    const title = seo.metaTitle || `${business.name} | Nakathata.lk`;
    const description =
      seo.metaDescription ||
      business.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
      `Discover ${business.name} on Nakathata.lk.`;
    const url = `${SITE_URL}/business/${encodeURIComponent(seo.slug || business.id)}`;
    const image = seo.ogImage || business.coverImage || business.logo;
    return pageMetadata(title, description, new URL(url).pathname, image);
  } catch {
    return {
      title: "Business profile | Nakathata.lk",
      robots: { index: false },
    };
  }
}
export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;
  let business;
  try {
    business = await getPublicBusiness(slug);
  } catch {
    /* Client shows the API error. */
  }
  if (business === null) notFound();
  const path = business
    ? `/business/${encodeURIComponent(business.profileSettings?.seo?.slug || business.id)}`
    : "";
  const data = business
    ? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}${path}#business`,
        name: business.name,
        url: `${SITE_URL}${path}`,
        description: business.description
          ?.replace(/<[^>]*>/g, "")
          .slice(0, 500),
        image: business.coverImage || business.logo || undefined,
        telephone: business.phone || undefined,
        address:
          business.address || business.city
            ? {
                "@type": "PostalAddress",
                streetAddress: business.address || undefined,
                addressLocality: business.city || undefined,
                addressRegion: business.district || undefined,
                addressCountry: "LK",
              }
            : undefined,
      }
    : null;
  return (
    <>
      {data && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
        />
      )}
      {business && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(
              breadcrumbs([
                { name: "Home", path: "/" },
                { name: "Vendors", path: "/search" },
                { name: business.name, path },
              ]),
            ),
          }}
        />
      )}
      <BusinessProfileClient key={slug} slug={slug} initialData={business} />
    </>
  );
}
