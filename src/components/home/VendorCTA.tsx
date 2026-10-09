import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import "./vendor-cta.css";

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
        <div className="relative px-6 py-10 text-center sm:px-10 sm:py-12 lg:px-14">
          <div className="mx-auto max-w-3xl">
            <h2
              id="vendor-invitation-title"
              className="text-3xl font-bold leading-[1.15] tracking-tight text-[#fffcf6] sm:text-4xl lg:text-5xl"
            >
              Grow Your Event <span className="text-[#e8c78d]">Business</span>{" "}
              with Us
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#e0e8e1]">
              Showcase your work and connect with customers on Nakathata.lk.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
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
          </div>
        </div>
      </div>
    </section>
  );
}
