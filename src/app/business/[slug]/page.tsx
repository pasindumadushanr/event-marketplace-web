import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicBusiness } from "@/lib/public-business";
import { SITE_URL } from "@/lib/site-url";
import BusinessProfileClient from "./BusinessProfileClient";
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
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        images: image ? [{ url: image, alt: business.name }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
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
  return (
    <BusinessProfileClient key={slug} slug={slug} initialData={business} />
  );
}
