import Link from "next/link";
import {
  Settings,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";

const sections = [
  {
    href: "/vendor/settings",
    title: "Account settings",
    description: "Your name, password and notification preferences.",
    icon: Settings,
  },
  {
    href: "/vendor/documents",
    title: "Verification documents",
    description:
      "Upload and manage your business documents. Available after approval.",
    icon: ShieldCheck,
  },
  {
    href: "/vendor/subscription",
    title: "Membership plan",
    description:
      "View your plan and membership options. Available after approval.",
    icon: CreditCard,
  },
  {
    href: "/vendor/support",
    title: "Get help",
    description: "Ask our team a question or report a problem.",
    icon: HelpCircle,
  },
];

export default function VendorAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Account & Help</h1>
        <p className="mt-2 text-slate-500">
          Manage your account, membership and support in one place.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            <section.icon className="mb-4 h-6 w-6 text-primary" />
            <h2 className="flex items-center justify-between text-lg font-semibold text-slate-900">
              {section.title}
              <ArrowUpRight className="h-4 w-4" />
            </h2>
            <p className="mt-2 text-sm text-slate-500">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
