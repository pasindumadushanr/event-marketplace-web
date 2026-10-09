import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  MessageCircle,
  Sparkles,
  Store,
} from "lucide-react";
import "./vendor-cta.css";

const benefits = [
  {
    icon: Camera,
    title: "Showcase your work",
    description: "Let your photos and business profile tell your story.",
  },
  {
    icon: Sparkles,
    title: "Share your services",
    description: "Bring your services and packages together in one place.",
  },
  {
    icon: MessageCircle,
    title: "Keep inquiries organised",
    description: "Connect with customers through your vendor dashboard.",
  },
];

export function VendorCTA() {
  return (
    <section
      className="vendor-invitation px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      aria-labelledby="vendor-invitation-title"
    >
      <div className="vendor-invitation-panel relative mx-auto max-w-7xl overflow-hidden rounded-[28px]">
        <div className="vendor-invitation-decoration" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="relative grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:p-14">
          <div className="min-w-0">
            <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e4c995]">
              <Store className="h-4 w-4 shrink-0" aria-hidden="true" /> For
              wedding & event professionals
            </p>
            <h2
              id="vendor-invitation-title"
              className="max-w-xl text-3xl font-bold leading-[1.15] tracking-tight text-[#fffcf6] sm:text-4xl lg:text-5xl"
            >
              Grow Your Event <span className="text-[#e8c78d]">Business</span>{" "}
              with Us
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#e0e8e1]">
              You create unforgettable celebrations. Let more people discover
              your work, explore your services, and connect with you on
              Nakathata.lk.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/vendor/register"
                className="vendor-invitation-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
              >
                Register Your Business{" "}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/sell"
                className="vendor-invitation-secondary inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold"
              >
                Learn More
              </Link>
            </div>
            <p className="mt-5 text-xs leading-6 text-[#c4d3c8]">
              For venues, photographers, beauty professionals, and every
              celebration specialist.
            </p>
          </div>
          <div className="vendor-invitation-benefits rounded-[22px] p-5 sm:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#866735]">
              Made for your craft
            </p>
            <h3 className="mt-2 text-xl font-semibold leading-7 text-[#304239] sm:text-2xl">
              A beautiful home for your business.
            </h3>
            <ul className="mt-6 space-y-5">
              {benefits.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-3.5">
                  <span className="vendor-invitation-icon inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-[#304239]">
                      {title}
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-[#655e53]">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
