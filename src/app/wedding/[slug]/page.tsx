import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InvitationExperience } from "@/components/invitations/InvitationExperience";
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
  return response.json();
});
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { content: c } = await invitation(slug);
  const title = `${c.partnerOne} & ${c.partnerTwo} — You’re invited`;
  const description = `Join us to celebrate our wedding at ${c.venue}.`;
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
      images: c.couplePhoto
        ? [{ url: c.couplePhoto, alt: `${c.partnerOne} & ${c.partnerTwo}` }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: c.couplePhoto ? [c.couplePhoto] : [],
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
  return <InvitationExperience content={value.content} />;
}
