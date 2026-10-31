import { InvitationExperience } from "@/components/invitations/InvitationExperience";
import { sinhalaDemoInvitation } from "@/lib/invitations";

export const metadata = {
  title: "W02 — මංගල ඇරයුම | Sinhala wedding invitation",
  robots: { index: false, follow: true },
};

export default function W02Demo() {
  return (
    <InvitationExperience
      content={sinhalaDemoInvitation}
      templateId="W02"
      preview
      demo
    />
  );
}
