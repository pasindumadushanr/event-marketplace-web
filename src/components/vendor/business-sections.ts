import {
  Building2,
  Phone,
  MapPin,
  FileText,
  Images,
  Package,
  Star,
  ListChecks,
  Clock,
  Settings,
  LayoutTemplate,
  Search,
} from "lucide-react";

export const businessSections = [
  {
    key: "general",
    href: "/vendor/business/general",
    title: "Business details",
    description: "Your name, introduction, logo and cover photo.",
    group: "Essentials",
    icon: Building2,
  },
  {
    key: "contact",
    href: "/vendor/business/contact",
    title: "Contact & social links",
    description: "Help customers call, email and follow you.",
    group: "Essentials",
    icon: Phone,
  },
  {
    key: "location",
    href: "/vendor/business/location",
    title: "Location",
    description: "Show customers where to find your business.",
    group: "Essentials",
    icon: MapPin,
  },
  {
    key: "policies",
    href: "/vendor/business/policies",
    title: "Policies & questions",
    description: "Explain bookings, payments and common questions.",
    group: "Essentials",
    icon: FileText,
  },
  {
    key: "gallery",
    href: "/vendor/gallery",
    title: "Photos & videos",
    description: "Let your best work tell your story.",
    group: "Showcase your business",
    icon: Images,
  },
  {
    key: "packages",
    href: "/vendor/packages",
    title: "Services & prices",
    description: "Make it easy to choose what you offer.",
    group: "Showcase your business",
    icon: Package,
  },
  {
    key: "reviews",
    href: "/vendor/reviews",
    title: "Customer reviews",
    description: "Read feedback and reply to your customers.",
    group: "Showcase your business",
    icon: Star,
  },
  {
    key: "features",
    href: "/vendor/business/features",
    title: "Features & amenities",
    description: "Highlight what makes your service special.",
    group: "More options",
    icon: ListChecks,
  },
  {
    key: "hours",
    href: "/vendor/business/hours",
    title: "Opening hours",
    description: "Let customers know when to contact you.",
    group: "More options",
    icon: Clock,
  },
  {
    key: "booking",
    href: "/vendor/business/booking",
    title: "Booking preferences",
    description: "Choose how customers request your services.",
    group: "More options",
    icon: Settings,
  },
  {
    key: "content",
    href: "/vendor/business/content",
    title: "Extra page sections",
    description: "Add more stories, information and highlights.",
    group: "More options",
    icon: LayoutTemplate,
  },
  {
    key: "seo",
    href: "/vendor/business/seo",
    title: "Google search appearance",
    description: "Optional search titles and descriptions.",
    group: "More options",
    icon: Search,
  },
];

type SetupBusiness = {
  name?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  profileSettings?: { policies?: { bookingPolicy?: string } };
};

export function businessEssentials(business: SetupBusiness | null) {
  return {
    general: !!(
      business?.name &&
      business.description &&
      business.logo &&
      business.coverImage
    ),
    contact: !!(business?.phone && business.email),
    location: !!(business?.address && business.city),
    policies: !!business?.profileSettings?.policies?.bookingPolicy,
  };
}
