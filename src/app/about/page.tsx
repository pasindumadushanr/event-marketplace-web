import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { AboutContent } from '@/components/about/AboutContent';

export const metadata = {
  title: 'About Us - LuxeEvents',
  description: 'Learn about the mission, vision, and story behind LuxeEvents, the premium event marketplace.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      
      {/* Spacer for fixed navbar */}
      <div className="h-20 bg-slate-900" />
      
      <AboutContent />

      <Footer />
    </div>
  );
}
