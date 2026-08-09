'use client';

import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Cancelled</h1>
        <p className="text-slate-500 mb-8">
          Your payment was cancelled or failed. Your booking request has not been confirmed.
        </p>
        
        <div className="space-y-3">
          <Link href="/customer/dashboard" className="block w-full">
            <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold">
              Return to Dashboard
            </Button>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="w-full h-12 rounded-md font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
