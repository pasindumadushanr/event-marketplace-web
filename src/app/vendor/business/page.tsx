import Link from "next/link";
import { Building2, Image, Package, Star, Eye, ArrowRight } from "lucide-react";

const tasks = [
  {
    href: "/vendor/business/general",
    title: "Business details",
    text: "Introduce your business and add your logo.",
    icon: Building2,
  },
  {
    href: "/vendor/gallery",
    title: "Photos & videos",
    text: "Show customers your work and event spaces.",
    icon: Image,
  },
  {
    href: "/vendor/packages",
    title: "Services & prices",
    text: "Explain what you offer and what it costs.",
    icon: Package,
  },
  {
    href: "/vendor/reviews",
    title: "Customer reviews",
    text: "Read feedback and reply to your customers.",
    icon: Star,
  },
];

export default function BusinessRootPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Business Page</h1>
        <p className="mt-2 text-slate-500">
          Choose what you want to update. Start with your details, photos and
          services.
        </p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {tasks.map((task) => (
          <Link
            key={task.href}
            href={task.href}
            className="rounded-xl border border-slate-200 p-5 hover:border-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            <task.icon className="mb-3 h-6 w-6 text-primary" />
            <h2 className="font-semibold text-slate-900">{task.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{task.text}</p>
            <ArrowRight className="mt-4 h-4 w-4 text-slate-400" />
          </Link>
        ))}
      </div>
      <Link
        href="/vendor/preview"
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white"
      >
        <Eye className="h-4 w-4" />
        Preview My Business Page
      </Link>
      <p className="text-sm text-slate-500">
        Contact details and location help customers reach you. Extra sections
        and Google search settings can be added later.
      </p>
    </div>
  );
}
