'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleMockVerify = () => {
    setIsVerifying(true);
    // In a real app, this hits an endpoint with a token from the email URL.
    // For MVP, we simulate a fast network request and redirect.
    setTimeout(() => {
      toast.success('Email verified successfully!');
      router.push('/vendor/onboarding');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="h-10 w-10 text-blue-600" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Verify your email</h2>
          <p className="text-slate-500 mt-2">
            We've sent a verification link to your email address. Please check your inbox and click the link to continue setting up your business.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 text-left">
          <p className="font-semibold flex items-center gap-2 mb-1">
            <ShieldCheck className="h-4 w-4" /> Developer Note (MVP)
          </p>
          <p>
            Email SMTP is currently bypassed for local development. Click the button below to instantly mock the email verification process.
          </p>
        </div>

        <Button 
          onClick={handleMockVerify} 
          disabled={isVerifying}
          className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
        >
          {isVerifying ? 'Verifying...' : 'Mock Email Verification'}
        </Button>
      </div>
    </div>
  );
}
