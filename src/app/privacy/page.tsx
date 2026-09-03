import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

export const metadata = {
  title: 'Privacy Policy - LuxeEvents',
  description: 'Your privacy is important to us. LuxeEvents is committed to protecting your personal data. We only collect information necessary to provide you with the best event marketplace experience.',
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
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-lg text-slate-600">
          <p>Your privacy is important to us. LuxeEvents is committed to protecting your personal data. We only collect information necessary to provide you with the best event marketplace experience.</p>
          <p className="mt-8">
            This page is currently under development. More detailed information will be available soon.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
