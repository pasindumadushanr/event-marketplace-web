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
    sinhala: false,
    accent: "Floral envelope opening",
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
    sinhala: true,
    accent: "Sinhala wording, lotus seal & traditional colours",
  },
] as const;

export const birthdayTemplate = {
  id: "B01",
  name: "Make a Wish",
  price: null,
  image: "/invitation-assets/b01/rose-envelope.webp",
  shareImage: "/invitation-assets/b01/rose-envelope.webp",
  demo: "/invitation-templates/b01",
  description: "A cake-and-candles surprise, a personal birthday wish in English and Sinhala, and a gallery of favourite memories.",
  music: false,
  sinhala: false,
} as const;

export const rewindBirthdayTemplate = {
  id: "B02",
  name: "Birthday Rewind",
  price: null,
  image: "/invitation-assets/b02/rewind.svg",
  shareImage: "/invitation-assets/b02/rewind-share.png",
  demo: "/invitation-templates/b02",
  description: "Tap a retro camera, watch a photo develop, and swipe through a memory reel before opening a personal birthday wish in English or Sinhala.",
  music: false,
  sinhala: false,
} as const;

export const birthdayTemplates = [birthdayTemplate, rewindBirthdayTemplate] as const;
export const studioTemplates = [...invitationTemplates, ...birthdayTemplates];
export const isBirthdayTemplate = (id: unknown): id is (typeof birthdayTemplates)[number]["id"] =>
  birthdayTemplates.some((template) => template.id === id);
