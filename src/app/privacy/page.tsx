import {
  PolicyPage,
  loadPublishedPolicy,
} from "@/components/policies/PolicyPage";
export const revalidate = 60;
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
