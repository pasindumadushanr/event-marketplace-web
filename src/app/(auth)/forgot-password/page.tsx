'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { KeyRound, ArrowLeft, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'REQUEST' | 'RESET' | 'SUCCESS'>('REQUEST');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      return toast.error('Please enter a valid email address');
    }

    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Reset code sent! Please check your email.');
      setStep('RESET');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request password reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      return toast.error('Please enter the 6-digit verification code');
    }
    if (!newPassword || newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        otp: otp.trim(),
        newPassword,
      });
      setStep('SUCCESS');
      toast.success('Password updated successfully!');
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Check your code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 animate-in fade-in duration-500">
        
        {/* Step 1: Request Code */}
        {step === 'REQUEST' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>
              <p className="text-sm text-slate-500">
                Enter your registered email address and we'll send you a 6-digit recovery code.
              </p>
            </div>

            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-11 bg-slate-50/50 border-slate-200 focus-visible:ring-primary"
                    required
                  />
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? 'Sending Code...' : 'Send Recovery Code'}
              </Button>
            </form>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Step 2: Enter OTP & New Password */}
        {step === 'RESET' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Set New Password</h1>
              <p className="text-sm text-slate-500">
                We sent a 6-digit verification code to <strong className="text-slate-700">{email}</strong>.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-slate-700 font-medium">6-Digit Code</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="h-12 text-center text-xl tracking-widest font-mono font-bold bg-slate-50/50 border-slate-200 focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-slate-700 font-medium">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-primary"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? 'Updating Password...' : 'Reset Password'}
              </Button>
            </form>

            <div className="flex items-center justify-between pt-2 text-sm">
              <button
                type="button"
                onClick={() => setStep('REQUEST')}
                className="text-slate-500 hover:text-slate-900"
              >
                Change Email
              </button>
              <button
                type="button"
                onClick={handleRequestOtp}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Resend Code
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Confirmation */}
        {step === 'SUCCESS' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Password Changed!</h2>
            <p className="text-sm text-slate-500">
              Your password has been successfully updated. Redirecting you to sign in...
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl">
                  Sign In Now
                </Button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
