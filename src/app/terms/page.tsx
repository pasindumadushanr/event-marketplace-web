import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { FileText, Shield, CheckCircle2, Clock, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | LuxeEvents Marketplace',
  description: 'Review our terms of service governing bookings, vendor listings, payments, advance deposits, and platform policies.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Legal Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Last Updated: September 2026 • Effective for all clients and vendors on LuxeEvents
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> 1. Platform Purpose & Scope
            </h2>
            <p>
              LuxeEvents operates as a curated luxury event marketplace connecting event planners, couples, and corporate organizers (&ldquo;Clients&rdquo;) with vetted event professionals and venues (&ldquo;Vendors&rdquo;).
            </p>
            <p>
              By accessing or using our marketplace (luxeevents.fun), mobile interfaces, and messaging tools, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" /> 2. Account Registration & Eligibility
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Clients:</strong> Must be at least 18 years of age and provide accurate contact and event details when submitting booking requests.</li>
              <li><strong>Vendors:</strong> Must be registered commercial entities or recognized individual professionals. Vendors must submit authentic identity documents, business registrations (where applicable), and portfolio samples during onboarding.</li>
              <li><strong>Account Security:</strong> You are responsible for safeguarding your login credentials and are fully responsible for all activities occurring under your account.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> 3. Bookings & The 15% Advance Deposit System
            </h2>
            <p>
              To protect both Clients and Vendors from arbitrary cancellations, LuxeEvents operates a standardized booking model:
            </p>
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
              <p>
                <strong>Stage 1 (Inquiry & Approval):</strong> Client submits a booking request through the vendor profile. No funds are charged until the vendor formally confirms availability.
              </p>
              <p>
                <strong>Stage 2 (Advance Deposit):</strong> Upon vendor approval, the Client pays an agreed advance deposit (standardized at 15% of the total package value) online through the LuxeEvents platform to officially lock the event date.
              </p>
              <p>
                <strong>Stage 3 (Event Settlement):</strong> The remaining 85% balance is payable directly to the Vendor on the day of the event (or per the vendor&apos;s agreed milestone contract).
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> 4. Cancellation & Refund Policy
            </h2>
            <p>
              <strong>LuxeEvents Guarantee:</strong> If a Vendor fails to provide the agreed service, fails to appear on the event date, or initiates a cancellation, the Client receives an unconditional <strong>100% refund</strong> of their platform advance deposit.
            </p>
            <p>
              <strong>Client Cancellations:</strong> If a Client cancels a confirmed booking:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>More than 30 days prior to the event: 50% of the advance deposit may be refunded at the platform&apos;s discretion.</li>
              <li>Less than 30 days prior to the event: The advance deposit is non-refundable to compensate the vendor for holding the exclusive date.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900">5. Marketplace Code of Conduct</h2>
            <p>
              Users and Vendors agree not to engage in fraudulent representations, abusive language in platform chat, circumvention of platform safety mechanisms, or submission of fabricated reviews. Violations will result in immediate suspension and forfeiture of vendor accounts.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" /> 6. Inquiries & Support
            </h2>
            <p>
              For legal questions, dispute resolutions, or clarifications on our terms, reach out to our legal department at{' '}
              <a href="mailto:support@luxeevents.fun" className="text-primary font-bold hover:underline">
                support@luxeevents.fun
              </a>{' '}
              or submit an inquiry via our <Link href="/contact" className="text-primary font-bold hover:underline">Contact Center</Link>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
