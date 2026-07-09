'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function VendorStatusPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const res = await api.get('/vendor/business/onboarding/status');
      const data = res.data;
      
      if (data.vendorStatus === 'NOT_STARTED') {
        router.push('/vendor/onboarding');
        return;
      }
      
      if (data.vendorStatus === 'APPROVED') {
        router.push('/vendor');
        return;
      }

      setStatus(data.vendorStatus);
      setRejectionReason(data.rejectionReason);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch status', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Checking application status...</div>;
  }

  const renderContent = () => {
    switch (status) {
      case 'PENDING':
      case 'UNDER_REVIEW':
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Clock className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Under Review</h2>
            <p className="text-slate-600">Your vendor application has been received and is currently being reviewed by our administrative team. We will notify you once your account is approved.</p>
          </div>
        );
      case 'REJECTED':
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <XCircle className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Application Rejected</h2>
            <p className="text-slate-600">Unfortunately, your application was not approved at this time.</p>
            {rejectionReason && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mt-4 text-left">
                <strong>Reason:</strong> {rejectionReason}
              </div>
            )}
            <div className="pt-4">
              <Button onClick={() => router.push('/vendor/onboarding')} className="bg-slate-900 hover:bg-slate-800">
                Update & Resubmit Application
              </Button>
            </div>
          </div>
        );
      case 'SUSPENDED':
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Account Suspended</h2>
            <p className="text-slate-600">Your vendor account has been temporarily suspended. Please contact support for more information.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="w-full bg-white border-b py-4 px-8 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Event Marketplace</h1>
        <Button variant="ghost" onClick={logout}>Logout</Button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white p-12 rounded-2xl shadow-xl border border-slate-100">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
