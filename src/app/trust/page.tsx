import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

export const metadata = {
  title: 'Trust & Safety - LuxeEvents',
  description: 'Safety is our top priority. All vendors on LuxeEvents undergo a rigorous vetting process. We provide secure payments, verified reviews, and 24/7 support to ensure a flawless experience.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      
      {/* Spacer for fixed navbar */}
      <div className="h-20 bg-slate-900" />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Trust & Safety</h1>
        <div className="prose prose-lg text-slate-600">
          <p>Safety is our top priority. All vendors on LuxeEvents undergo a rigorous vetting process. We provide secure payments, verified reviews, and 24/7 support to ensure a flawless experience.</p>
          <p className="mt-8">
            This page is currently under development. More detailed information will be available soon.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
