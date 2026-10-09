import {
  PolicyPage,
  loadPublishedPolicy,
} from "@/components/policies/PolicyPage";
export const revalidate = 60;
export async function generateMetadata() {
  const page = await loadPublishedPolicy("terms-and-conditions");
  return {
    title: page.metaTitle || "Terms of Service | Nakathata.lk Marketplace",
    description:
      page.metaDescription ||
      "Terms for using Nakathata.lk, vendor listings, inquiries, and service arrangements.",
    alternates: { canonical: "/terms" },
  };
}
export default function TermsPage() {
  return <PolicyPage slug="terms-and-conditions" />;
}
