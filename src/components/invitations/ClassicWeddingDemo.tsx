import type { Metadata } from "next";
import { ClassicWeddingInvitation } from "./ClassicWeddingInvitation";
import { invitationTemplates, type ClassicWeddingId } from "@/lib/invitation-templates";
import { emptyInvitation, type InvitationContent } from "@/lib/invitations";

const sample: InvitationContent = {
  ...emptyInvitation,
  partnerOne: "Amaya Perera",
  partnerTwo: "Sanjuka Silva",
  welcome: "Invite you to celebrate the joy of their wedding.",
  weddingAt: "2027-11-20T16:30:00+05:30",
  venue: "The Garden Pavilion",
  address: "Bentota, Sri Lanka",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Bentota+Sri+Lanka",
};

export function classicDemoMetadata(id: ClassicWeddingId): Metadata {
  const template = invitationTemplates.find((item) => item.id === id)!;
  return {
    title: `${template.name} — Wedding invitation demo | Nakathata.lk`,
    description: template.description,
    robots: { index: false, follow: true },
  };
}

export function ClassicWeddingDemo({ id }: { id: ClassicWeddingId }) {
  const content = {
    ...sample,
    ...(id === "W07" ? { familyOne: "The Perera family", familyTwo: "The Silva family" } : {}),
    ...(id === "W08" ? { weddingVerse: "Two hearts, one new beginning." } : {}),
  };
  return <ClassicWeddingInvitation templateId={id} content={content} demo />;
}
