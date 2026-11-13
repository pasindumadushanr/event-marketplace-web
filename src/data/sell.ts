import {
  TrendingUp,
  CalendarCheck,
  Store,
  Settings,
  Star,
  BarChart,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  CreditCard,
} from "lucide-react";

export const sellData = {
  hero: {
    title: "Grow Your Event Business with Nakathata.lk",
    subtitle:
      "Join the premier marketplace for luxury event professionals. Reach high-end clients, manage your bookings effortlessly, and scale your business.",
    primaryCTA: "Start Selling Today",
    primaryLink: "/vendor/register",
    secondaryCTA: "Learn More",
    secondaryLink: "#benefits",
  },

  benefits: [
    {
      title: "More Visibility",
      description:
        "Create a page customers can find as our Sri Lankan wedding and event community grows.",
      icon: TrendingUp,
    },
    {
      title: "More Bookings",
      description:
        "Let customers discover your services and contact you directly to discuss their event.",
      icon: CalendarCheck,
    },
    {
      title: "Professional Profile",
      description:
        "Showcase your portfolio, packages, and pricing on a beautifully designed business page.",
      icon: Store,
    },
    {
      title: "Easy Management",
      description:
        "Manage all your inquiries, messages, and bookings from a centralized, intuitive dashboard.",
      icon: Settings,
    },
    {
      title: "Customer Reviews",
      description:
        "Show available customer feedback alongside your portfolio. Review labels explain what has been checked.",
      icon: Star,
    },
    {
      title: "Future Analytics",
      description:
        "More reporting tools are planned. Start with your business page, photos, services and contact details.",
      icon: BarChart,
    },
  ],

  howItWorks: [
    {
      title: "Register Account",
      description: "Sign up for a free vendor account and verify your email.",
      icon: UserPlus,
    },
    {
      title: "Create Business",
      description:
        "Set up your profile, add your services, packages, and portfolio.",
      icon: Store,
    },
    {
      title: "Admin Approval",
      description:
        "Our team will review your profile to ensure it meets our premium standards.",
      icon: ShieldCheck,
    },
    {
      title: "Connect with Customers",
      description:
        "Customers can contact you on WhatsApp. Confirm availability, prices and booking arrangements directly.",
      icon: CheckCircle,
    },
  ],

  pricing: {
    title: "Your first two months are free",
    description:
      "Your free period starts on your original account-registration date. Existing vendors use the same rule. View your exact dates in your dashboard.",
    features: [
      "Beautiful Business Profile",
      "Services, Packages & Portfolio Photos",
      "Direct Client Messaging",
      "Direct WhatsApp Contact",
      "Dedicated Vendor Support",
    ],
    price: "Free",
    period: "For your first two calendar months",
    notice:
      "When your free period ends, your page stays live. Contact our team to discuss the next steps. There are no automatic charges. Online payments and escrow are not available.",
  },

  cta: {
    title: "Ready to elevate your business?",
    description:
      "Join the exclusive network of top-tier event professionals and start growing today.",
    primaryCTA: "Create Vendor Account",
    primaryLink: "/vendor/register",
    secondaryCTA: "View FAQs",
    secondaryLink: "/faq",
  },
};
