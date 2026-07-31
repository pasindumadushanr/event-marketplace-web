'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      
      // The backend now returns the full user object including their role!
      login(response.data.accessToken, response.data.refreshToken, response.data.user);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Pane - Visuals */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/auth-bg.jpg')" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
        
        <div className="relative z-20 flex items-center text-lg font-bold">
          <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Event Marketplace
        </div>
        
        <div className="relative z-20 space-y-6 max-w-md">
          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1]">
            Create unforgettable moments.
          </h1>
          <p className="text-zinc-300 text-lg">
            Manage your events, connect with premium vendors, and plan your perfect day all in one place.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Welcome back</h1>
            <p className="text-zinc-500 text-sm">
              Enter your email and password to access your account.
            </p>
          </div>

          <div className="space-y-6">
            <GoogleAuthButton mode="login" />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-500 font-medium">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-11 bg-zinc-50/50 border-zinc-200 focus-visible:ring-zinc-900"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-700">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="h-11 bg-zinc-50/50 border-zinc-200 focus-visible:ring-zinc-900"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full h-11 text-base font-medium shadow-sm transition-all hover:shadow-md" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-zinc-900 hover:underline transition-all">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
