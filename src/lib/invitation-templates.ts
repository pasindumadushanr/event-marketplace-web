// Only implemented designs belong here. Future designs can add their own
// editing capabilities rather than advertising unavailable templates.
export const invitationTemplates = [
  {
    id: "W01",
    name: "Olive & Ivory",
    price: 2500,
    image: "/invitation-assets/w01/assets/calla-lilies.jpg",
    demo: "/invitation-templates/w01",
    description:
      "Floral envelope opening, couple photo, wedding details, gallery and optional music.",
    music: true,
  },
  {
    id: "W02",
    name: "මංගල ඇරයුම",
    price: 2500,
    image: "/invitation-assets/w02/preview.svg",
    demo: "/invitation-templates/w02",
    description:
      "A traditional Sri Lankan invitation in Sinhala, with lotus ornaments, ivory paper, maroon and gold, your photos and WhatsApp RSVP.",
    music: false,
  },
] as const;
