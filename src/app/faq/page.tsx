import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { FaqContent } from '@/components/faq/FaqContent';

export const metadata = {
  title: 'FAQ - LuxeEvents',
  description: 'Frequently Asked Questions about using LuxeEvents as a customer or a vendor.',
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      
      {/* Spacer for fixed navbar */}
      <div className="h-20 bg-slate-900" />
      
      <FaqContent />

      <Footer />
    </div>
  );
}
