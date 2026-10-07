import type { Metadata } from "next";
import { SITE_URL } from "./site-url";

export const BRAND_DESCRIPTION =
  "Find wedding venues, photographers, bridal wear, cakes, wedding cars and event services across Sri Lanka. Explore vendors and contact your wedding team on Nakathata.lk.";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image?: string,
): Metadata {
  const url = `${SITE_URL}${path}`;
  const images = [
    { url: image || `${SITE_URL}/images/brand/nakathata-logo.jpg`, alt: title },
  ];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Nakathata.lk",
      locale: "en_LK",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((item) => item.url),
    },
  };
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
