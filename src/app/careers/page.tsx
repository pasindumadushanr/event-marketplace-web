import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

export const metadata = {
  title: 'Careers - LuxeEvents',
  description: 'Join the LuxeEvents team! We are always looking for passionate, driven individuals who want to revolutionize the event planning industry. Check back soon for open positions.',
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
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Careers</h1>
        <div className="prose prose-lg text-slate-600">
          <p>Join the LuxeEvents team! We are always looking for passionate, driven individuals who want to revolutionize the event planning industry. Check back soon for open positions.</p>
          <p className="mt-8">
            This page is currently under development. More detailed information will be available soon.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
