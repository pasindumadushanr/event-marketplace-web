export interface InvitationContent {
  partnerOne: string;
  partnerTwo: string;
  welcome: string;
  weddingAt: string;
  venue: string;
  address: string;
  mapUrl: string;
  rsvpPhone: string;
  couplePhoto: string;
  story: string;
  gallery: string[];
  music: boolean;
}
export interface InvitationRecord {
  id: string;
  slug: string;
  templateId: string;
  status: string;
  revision: number;
  draft: InvitationContent;
  updatedAt: string;
  reviewToken?: string;
}
export const emptyInvitation: InvitationContent = {
  partnerOne: "",
  partnerTwo: "",
  welcome: "",
  weddingAt: "",
  venue: "",
  address: "",
  mapUrl: "",
  rsvpPhone: "",
  couplePhoto: "",
  story: "",
  gallery: [],
  music: false,
};
export const demoInvitation: InvitationContent = {
  partnerOne: "Amaya",
  partnerTwo: "Kasun",
  welcome:
    "Together with our families, we invite you to celebrate the beginning of our always.",
  weddingAt: "2027-09-18T16:00:00+05:30",
  venue: "The Kingsbury",
  address: "Colombo, Sri Lanka",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=The+Kingsbury+Colombo",
  rsvpPhone: "",
  couplePhoto: "/images/invitations/w01-demo-couple.jpg",
  story:
    "A little serendipity. A whole lot of love. And a lifetime we cannot wait to begin together.",
  gallery: [],
  music: true,
};
export const studioRoles = ["SUPER_ADMIN", "INVITATION_STAFF"];
export async function studioRequest(path: string, init: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("invitationStudioToken")
      : null;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${path}`,
    {
      ...init,
      cache: "no-store",
      headers: {
        ...(init.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    },
  );
  const value = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token) {
      sessionStorage.removeItem("invitationStudioToken");
      window.dispatchEvent(new Event("invitation-session-expired"));
    }
    throw new Error(
      typeof value.message === "string"
        ? value.message
        : "Could not complete this request. Please try again.",
    );
  }
  return value;
}
