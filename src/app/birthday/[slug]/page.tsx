import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InvitationExperience } from "@/components/invitations/InvitationExperience";
import type { InvitationContent } from "@/lib/invitations";
import { SITE_URL } from "@/lib/site-url";
import { birthdayTemplates, isBirthdayTemplate } from "@/lib/invitation-templates";

export const dynamic = "force-dynamic";
const birthday = cache(async (slug: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/public/invitations/${encodeURIComponent(slug)}`,
    { cache: "no-store", signal: AbortSignal.timeout(10000) },
  );
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("This card is temporarily unavailable.");
  const value = await response.json();
  if (!isBirthdayTemplate(value.templateId)) notFound();
  return { content: value.content as InvitationContent, templateId: value.templateId };
});

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { templateId } = await birthday(slug);
  const template = birthdayTemplates.find((item) => item.id === templateId)!;
  const title = "A birthday surprise for you | Nakathata.lk";
  const description = templateId === "B02"
    ? "Tap the camera to open your birthday memories and a personal message."
    : "Open your birthday card to make a wish and discover a personal message.";
  return {
    title,
    description,
    robots: { index: false, follow: false, noarchive: true },
    referrer: "no-referrer",
    alternates: { canonical: `${SITE_URL}/birthday/${encodeURIComponent(slug)}` },
    openGraph: { title, description, images: [`${SITE_URL}${template.shareImage}`] },
  };
}

export default async function BirthdayPage({ params }: Props) {
  const value = await birthday((await params).slug);
  return <InvitationExperience {...value} />;
}
