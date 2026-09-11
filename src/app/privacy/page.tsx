import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { ShieldCheck, Lock, Eye, Server, RefreshCw, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | LuxeEvents Marketplace',
  description: 'Learn how LuxeEvents protects your personal data, handles booking information, and ensures safe, encrypted transactions.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Data Protection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Last Updated: September 2026 • We respect your privacy and protect your personal information.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> 1. Commitment to Privacy
            </h2>
            <p>
              At LuxeEvents (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we recognize the sensitivity of the personal, logistical, and financial details involved in planning weddings, galas, and celebrations. This policy explains how we collect, safeguard, and utilize your information across our website and services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" /> 2. Information We Collect
            </h2>
            <p>We only gather details necessary to facilitate seamless marketplace transactions:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Client Data:</strong> Name, email address, telephone number, event date, venue location, and package preferences provided during account creation or booking.</li>
              <li><strong>Vendor Data:</strong> Commercial legal name, trading name, contact details, business registration numbers, government ID documents, bank settlement details, and portfolio media.</li>
              <li><strong>Technical Logs:</strong> IP address, device telemetry, browser type, and interaction cookies utilized to enhance security and session stability.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> 3. Payment & Financial Security
            </h2>
            <p>
              Your financial safety is paramount. All payment operations (such as booking advance deposits) are processed via <strong>256-bit TLS/SSL encrypted channels</strong> with certified payment gateways compliant with PCI-DSS standards.
            </p>
            <p>
              LuxeEvents <strong>never stores full credit or debit card numbers, CVC codes, or banking PINs</strong> on our application servers.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" /> 4. How We Use Your Data
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Facilitating direct communication between clients and verified vendors.</li>
              <li>Transmitting automated transactional notifications (booking approvals, receipt confirmations, and message alerts).</li>
              <li>Verifying vendor legitimacy and preventing fraudulent store accounts.</li>
              <li>Continuously diagnosing performance and platform stability.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" /> 5. Data Rights & Retention
            </h2>
            <p>
              You maintain full ownership of your personal profile. You may access, amend, or request complete deletion of your account and personal data at any time by navigating to your Account Settings or contacting our Data Compliance team at{' '}
              <a href="mailto:privacy@luxeevents.fun" className="text-primary font-bold hover:underline">
                privacy@luxeevents.fun
              </a>.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> 6. Contact Us
            </h2>
            <p>
              If you have any questions or concerns regarding our privacy practices, please contact us via our{' '}
              <Link href="/contact" className="text-primary font-bold hover:underline">
                Contact Page
              </Link>{' '}
              or email us directly at <span className="font-semibold text-slate-900">support@luxeevents.fun</span>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
