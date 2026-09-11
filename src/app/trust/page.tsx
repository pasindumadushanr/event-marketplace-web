import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { ShieldCheck, CheckCircle2, Lock, Star, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Trust & Safety | LuxeEvents Marketplace',
  description: 'Learn about our 4-pillar trust framework, vendor vetting process, verified reviews, and the LuxeEvents 100% Money-Back Guarantee.',
};

export default function TrustPage() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Rigorous Vendor Vetting',
      description: 'Every vendor listing undergoes administrative review. We verify business registrations, national IDs, track records, and inspect past event portfolios before awarding verified status.',
    },
    {
      icon: Lock,
      title: '100% Refund Guarantee',
      description: 'When you secure your date with an advance deposit through LuxeEvents, your funds are fully protected. If a vendor cancels or fails to show, you receive an immediate 100% refund.',
    },
    {
      icon: Star,
      title: 'Verified Client Reviews',
      description: 'We do not permit paid, fake, or anonymous reviews. Every testimonial and star rating on our platform originates from real clients who completed bookings with that vendor.',
    },
    {
      icon: CheckCircle2,
      title: 'Direct Messaging & Price Clarity',
      description: 'Communicate directly with vendors through encrypted chat, request bespoke quotes, and lock in exact transparent pricing without surprise hidden fees on your wedding day.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Buyer Protection & Security
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-4 mb-4">
            Trust & Safety at LuxeEvents
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Planning a luxury wedding, gala, or celebration should be exhilarating, not stressful. Discover how our multi-layered safety framework ensures complete peace of mind.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{pillar.title}</h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-16">
          <div className="max-w-3xl space-y-4">
            <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> The LuxeEvents Guarantee
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Zero Risk. Your Date is Officially Protected.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              If an unforeseen circumstance occurs and your confirmed vendor cannot service your event, LuxeEvents steps in to either provide an immediate priority replacement from our verified network or issue an instant 100% refund of your advance deposit.
            </p>
            <div className="pt-2">
              <Link href="/search">
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/20">
                  Explore Verified Vendors <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> Best Practices for Safe Event Planning
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-600">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">1. Keep Messages on LuxeEvents</h4>
              <p>Chatting through our secure inbox provides an official paper trail of all agreements, requirements, and quote modifications.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">2. Pay Deposits on Platform</h4>
              <p>Never transfer offline advance deposits without an official booking request. Platform deposits are the only ones covered by our guarantee.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">3. Review Package Details</h4>
              <p>Check the included items, durations, and delivery timelines before confirming your reservation.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
