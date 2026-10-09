import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Star,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Trust & Safety | Nakathata.lk Marketplace",
  description:
    "Understand account email checks, completed-booking review labels, and the limits of verification on Nakathata.lk.",
};

export default function TrustPage() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "What “Verified” means",
      description:
        "A verification label must name the check it represents. We currently confirm vendor account emails. Listing approval is permission to publish, not proof of identity, registration, phone ownership, or service quality. We do not award a general Verified business badge without recorded checks.",
    },
    {
      icon: Lock,
      title: "Know the limits",
      description:
        "An email check confirms access to the vendor account email. A phone number or uploaded document alone is not verification. We do not currently verify identity documents or business registration, and a badge is not a guarantee of service or refunds.",
    },
    {
      icon: Star,
      title: "Verified-customer reviews",
      description:
        "“Verified customer · completed booking” means the reviewer’s account has a completed booking recorded with that vendor, created before the review. Other reviews are labelled “booking not verified.” This does not mean we independently inspected the event or endorse the review.",
    },
    {
      icon: CheckCircle2,
      title: "Direct Messaging & Price Clarity",
      description:
        "Use messages to share your date, location, guest count, and requirements. Confirm the full price, inclusions, and cancellation terms with the vendor in writing. WhatsApp conversations take place outside Nakathata.lk.",
    },
  ];

  return (
    <div className="public-page-surface min-h-screen font-sans flex flex-col justify-between">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      <div className="h-20 bg-slate-900" />

      <main className="wedding-typography flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="public-page-intro text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Clear checks. Honest labels.
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-4 mb-4">
            Trust & Safety at Nakathata.lk
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Understand what we can confirm, what we cannot, and how to make an
            informed choice for your celebration.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="public-page-card rounded-3xl p-8 transition-shadow space-y-4"
              >
                <div className="public-page-icon h-14 w-14 rounded-full flex items-center justify-center">
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {pillar.title}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="public-page-dark-card text-white rounded-3xl p-8 sm:p-12 mb-16">
          <div className="max-w-3xl space-y-4">
            <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Before you choose a vendor
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ask questions. Confirm the details.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Review recent work, read the different review labels, and ask for
              a written agreement. Confirm who will provide the service, the
              event date, the total cost, and cancellation conditions.
              Nakathata.lk does not promise automatic replacements or instant
              refunds.
            </p>
            <div className="pt-2">
              <Link href="/search">
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/20">
                  Explore Vendors <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="public-page-card rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> Best Practices
            for Safe Event Planning
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-600">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">
                1. Keep Messages on Nakathata.lk
              </h4>
              <p>
                Chatting through our secure inbox provides an official paper
                trail of all agreements, requirements, and quote modifications.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">
                2. Confirm Terms in Writing
              </h4>
              <p>
                Agree on deposit, cancellation, and refund terms with your
                vendor. Do not assume that a verification label provides
                financial protection.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">
                3. Review Package Details
              </h4>
              <p>
                Check the included items, durations, and delivery timelines
                before confirming your reservation.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
