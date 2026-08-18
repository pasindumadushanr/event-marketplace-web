'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CreditCard, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

function MockCheckoutContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter();
  
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await api.get(`/payments/session/${sessionId}`);
        if (res.data.paymentStatus === 'PAID') {
          router.push('/checkout/success');
        }
        setSessionDetails(res.data);
      } catch (error) {
        toast.error('Invalid or expired checkout session');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, router]);

  const handleSimulatePayment = async (outcome: 'SUCCESS' | 'FAILED') => {
    setIsProcessing(true);
    try {
      await api.post('/payments/process', { sessionId, outcome });
      
      if (outcome === 'SUCCESS') {
        toast.success('Payment successful!');
        router.push('/checkout/success');
      } else {
        toast.error('Payment failed!');
        router.push('/checkout/cancel');
      }
    } catch (error) {
      toast.error('Error simulating payment');
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    router.push('/checkout/cancel');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-slate-500">Loading secure checkout...</p>
        </div>
      </div>
    );
  }

  if (!sessionDetails) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Checkout (Mock Mode)</h1>
          <p className="text-slate-400 mt-2 text-sm flex items-center justify-center gap-1">
            <ShieldCheck className="h-4 w-4" /> Secure Payment Simulation
          </p>
        </div>

        {/* Order Details */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-slate-700">
              <span>Business</span>
              <span className="font-medium text-slate-900">{sessionDetails.businessName}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Package</span>
              <span className="font-medium text-slate-900">{sessionDetails.packageName}</span>
            </div>
            <div className="h-px bg-slate-200 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900">Total Amount</span>
              <span className="text-2xl font-bold text-primary">LKR {Number(sessionDetails.totalAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-sm flex gap-3 items-start mb-6">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>
              <strong>Developer Mode:</strong> This is a mock checkout interface. No real money will be charged. Choose a simulated outcome below.
            </p>
          </div>

          <Button 
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold text-lg"
            onClick={() => handleSimulatePayment('SUCCESS')}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Simulate Successful Payment'}
          </Button>

          <Button 
            className="w-full h-12 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold border border-red-200"
            variant="outline"
            onClick={() => handleSimulatePayment('FAILED')}
            disabled={isProcessing}
          >
            Simulate Failed Payment
          </Button>

          <Button 
            className="w-full h-12 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            variant="ghost"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancel and Return
          </Button>
        </div>

      </div>
    </div>
  );
}

export default function MockCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-slate-500">Loading secure checkout...</p>
        </div>
      </div>
    }>
      <MockCheckoutContent />
    </Suspense>
  );
}
