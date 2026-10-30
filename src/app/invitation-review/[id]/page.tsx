import { ReviewInvitation } from "@/components/invitations/ReviewInvitation";
export const metadata = {
  title: "Private invitation review",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer" as const,
};
export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReviewInvitation id={id} />;
}
