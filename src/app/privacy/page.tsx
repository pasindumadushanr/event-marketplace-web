import {
  PolicyPage,
  loadPublishedPolicy,
} from "@/components/policies/PolicyPage";
// The CMS may be asleep or unavailable during deployment. Load policies when
// requested rather than requiring the backend to answer during next build.
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const page = await loadPublishedPolicy("privacy-policy");
  return {
    title: page.metaTitle || "Privacy Policy | Nakathata.lk Marketplace",
    description:
      page.metaDescription ||
      "How Nakathata.lk uses account details, inquiries, analytics, and optional nearby search information.",
    alternates: { canonical: "/privacy" },
  };
}
export default function PrivacyPage() {
  return <PolicyPage slug="privacy-policy" />;
}
