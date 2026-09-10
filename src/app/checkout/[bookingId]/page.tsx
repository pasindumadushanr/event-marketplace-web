'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreditCard, CheckCircle, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function MockCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      // Simulate network delay for payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await api.post(`/bookings/${bookingId}/payment/confirm`);
      setIsSuccess(true);
      toast.success('Payment successful!');
      
      setTimeout(() => {
        router.push('/account/bookings');
      }, 3000);
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl text-center space-y-6 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Successful!</h1>
          <p className="text-slate-500">Your date is now secured. The vendor has been notified.</p>
          <div className="pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-400">Redirecting to your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <button onClick={() => router.back()} className="flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Order Summary */}
          <div className="w-full md:w-2/5 bg-slate-900 text-white p-8">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Booking Advance</span>
                <span className="font-semibold">LKR 15,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Platform Fee</span>
                <span className="font-semibold">LKR 500</span>
              </div>
              <div className="pt-4 border-t border-slate-700 flex justify-between">
                <span className="font-bold">Total to Pay</span>
                <span className="font-bold text-lg text-primary">LKR 15,500</span>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block mb-1">LuxeEvents Guarantee</strong>
                Your money is protected. If the vendor cancels, you receive a 100% refund of this advance payment.
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="w-full md:w-3/5 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Secure Checkout</h1>
              <p className="text-sm text-slate-500">Enter your card details to lock your date.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Card Information</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="1234 5678 9101 1121"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all mb-2"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Name on Card</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 text-lg transition-transform active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    'Pay LKR 15,500'
                  )}
                </Button>
                <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Payments are secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
