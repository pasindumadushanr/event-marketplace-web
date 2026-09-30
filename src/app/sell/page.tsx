import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { SellContent } from '@/components/sell/SellContent';

export const metadata = {
  title: 'Become a Vendor - Nakathata.lk',
  description: 'Join the premier marketplace for luxury event professionals. Scale your business and reach high-end clients.',
};

export default function SellPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      
      {/* Spacer for fixed navbar */}
      <div className="h-20 bg-slate-900" />
      
      <SellContent />

      <Footer />
    </div>
  );
}
