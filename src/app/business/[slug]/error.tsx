'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function BusinessProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Business Profile Render Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      <div className="h-20 bg-slate-900" />

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-6 border border-amber-200">
          <AlertCircle className="h-8 w-8" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Unable to Load Profile
        </h1>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          We encountered an issue displaying this vendor's profile. Please try reloading or explore other vendors.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button 
            onClick={() => reset()}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold"
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto rounded-xl font-semibold border-slate-200">
              <Home className="h-4 w-4 mr-2" /> Return Home
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
