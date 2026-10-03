export type GalleryItem = {
  id: string;
  url: string;
  type: string;
  sortOrder?: number;
};
export type Service = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  duration: string;
  image: string;
  features: string[];
  status: string;
};
export type Settings = {
  [key: string]: unknown;
  highlights?: string | string[];
  languages?: string | string[];
  whatsapp?: string;
  tiktok?: string;
  policies?: Record<string, string>;
  faqs?: { question: string; answer: string }[];
  faq?: { question: string; answer: string }[];
  features?: { groupName: string; features: string[] }[];
  hours?: {
    day: string;
    isClosed: boolean;
    openTime: string;
    closeTime: string;
  }[];
};
export type ProfileData = {
  [key: string]: unknown;
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  status: string;
  phone: string;
  email: string;
  website: string;
  facebook: string;
  instagram: string;
  youtube: string;
  address: string;
  city: string;
  district: string;
  province: string;
  zipCode: string;
  googleMapLocation: string;
  profileSettings: Settings;
  galleries: GalleryItem[];
  packages: Service[];
};
export const sectionNames = {
  hero: "Name, logo & cover",
  about: "About your business",
  gallery: "Photos & videos",
  packages: "Services & prices",
  contact: "Contact details",
  location: "Location",
  policies: "Booking & payment policies",
  faq: "Common questions",
  features: "Features & amenities",
  hours: "Opening hours",
};
export type Section = keyof typeof sectionNames;
export const lines = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value.join("\n") : value || "";
export const splitLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export function sectionPayload(
  section: Section,
  data: ProfileData,
): Record<string, unknown> {
  const pick = (keys: string[]) =>
    Object.fromEntries(keys.map((key) => [key, data[key] || ""]));
  switch (section) {
    case "hero":
      return pick(["name", "logo", "coverImage"]);
    case "about":
      return {
        description: data.description,
        profileSettings: {
          highlights: data.profileSettings.highlights || [],
          languages: data.profileSettings.languages || [],
        },
      };
    case "contact":
      return {
        ...pick([
          "phone",
          "email",
          "website",
          "facebook",
          "instagram",
          "youtube",
        ]),
        profileSettings: {
          whatsapp: data.profileSettings.whatsapp || "",
          tiktok: data.profileSettings.tiktok || "",
        },
      };
    case "location":
      return pick([
        "address",
        "city",
        "district",
        "province",
        "zipCode",
        "googleMapLocation",
      ]);
    case "policies":
      return {
        profileSettings: { policies: data.profileSettings.policies || {} },
      };
    case "faq":
      return {
        profileSettings: {
          faqs: (data.profileSettings.faqs || []).filter(
            (item) => item.question.trim() && item.answer.trim(),
          ),
        },
      };
    case "features":
      return {
        profileSettings: { features: data.profileSettings.features || [] },
      };
    case "hours":
      return { profileSettings: { hours: data.profileSettings.hours || [] } };
    default:
      return {};
  }
}
