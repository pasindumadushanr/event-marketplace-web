// Only implemented designs belong here. Future designs can add their own
// editing capabilities rather than advertising unavailable templates.
export const classicWeddingIds = ["W07", "W08", "W09"] as const;
export type ClassicWeddingId = (typeof classicWeddingIds)[number];
export const isClassicWedding = (value: unknown): value is ClassicWeddingId =>
  classicWeddingIds.some((id) => id === value);

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
  {
    id: "W07",
    name: "Autumn Petals",
    price: 750,
    image: "/invitation-assets/w07/card.webp",
    demo: "/invitation-templates/w07",
    description: "Warm ivory stationery framed by pressed leaves in honey gold and rose. A traditional card that opens directly to the wedding details.",
    music: false,
    sinhala: false,
    accent: "Pressed autumn leaves & layered ivory paper",
  },
  {
    id: "W08",
    name: "Emerald Lotus",
    price: 750,
    image: "/invitation-assets/w08/card.webp",
    demo: "/invitation-templates/w08",
    description: "Gold lettering rests on a deep green lotus leaf, framed by ivory flowers and glistening water droplets.",
    music: false,
    sinhala: false,
    accent: "Gilded emerald lotus leaf & ivory blossoms",
  },
  {
    id: "W09",
    name: "Olive & Gold",
    price: 750,
    image: "/invitation-assets/w09/card.webp",
    demo: "/invitation-templates/w09",
    description: "Sculpted ivory stationery with a fine gold edge, olive sprigs and a bronze wax seal.",
    music: false,
    sinhala: false,
    accent: "Asymmetric ivory parchment, olive sprigs & wax seal",
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
