import { InvitationExperience } from "@/components/invitations/InvitationExperience";
import { demoInvitation } from "@/lib/invitations";
export const metadata = {
  title: "W01 — Olive & Ivory invitation demo",
  robots: { index: false, follow: true },
};
export default function W01Demo() {
  return <InvitationExperience content={demoInvitation} preview />;
}
