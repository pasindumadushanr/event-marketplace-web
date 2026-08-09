'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
        <p className="text-slate-500 mb-8">
          Thank you for your payment. Your booking has been confirmed and the vendor has been notified.
        </p>
        
        <div className="space-y-3">
          <Link href="/customer/dashboard" className="block w-full">
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold">
              Go to My Bookings
            </Button>
          </Link>
          <Link href="/discovery" className="block w-full">
            <Button variant="outline" className="w-full h-12 text-slate-600 border-slate-200">
              Continue Browsing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
