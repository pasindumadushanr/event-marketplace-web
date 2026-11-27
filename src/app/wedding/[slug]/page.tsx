import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InvitationExperience } from "@/components/invitations/InvitationExperience";
import { isBirthdayTemplate, isClassicWedding } from "@/lib/invitation-templates";
import { SITE_URL } from "@/lib/site-url";
export const dynamic = "force-dynamic";
const invitation = cache(async (slug: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/public/invitations/${encodeURIComponent(slug)}`,
    { cache: "no-store", signal: AbortSignal.timeout(10000) },
  );
  if (response.status === 404) notFound();
  if (!response.ok)
    throw new Error("Invitation is temporarily unavailable. Please try again.");
  const value = await response.json();
  if (isBirthdayTemplate(value.templateId)) notFound();
  return value;
});
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { content: c, templateId } = await invitation(slug);
  const title =
    templateId === "W02"
      ? `${c.partnerOne} සහ ${c.partnerTwo} — මංගල ඇරයුම`
      : `${c.partnerOne} & ${c.partnerTwo} — You’re invited`;
  const description =
    templateId === "W02"
      ? c.welcome
      : `Join us to celebrate our wedding at ${c.venue}.`;
  const shareImage = c.couplePhoto || (isClassicWedding(templateId)
    ? `${SITE_URL}/invitation-assets/${templateId.toLowerCase()}/share.jpg` : "");
  return {
    title,
    description,
    robots: { index: false, follow: false, noarchive: true },
    referrer: "no-referrer",
    alternates: { canonical: `${SITE_URL}/wedding/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/wedding/${slug}`,
      type: "website",
      images: shareImage
        ? [{ url: shareImage, alt: c.couplePhoto ? `${c.partnerOne} & ${c.partnerTwo}` : "Wedding invitation artwork" }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: shareImage ? [shareImage] : [],
    },
  };
}
export default async function WeddingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const value = await invitation(slug);
  return (
    <InvitationExperience
      content={value.content}
      templateId={value.templateId}
    />
  );
}
