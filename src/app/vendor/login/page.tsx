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
import { Diamond } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function VendorLoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      
      const role = response.data.user?.roleName || response.data.user?.role?.name;
      if (role !== 'VENDOR') {
        toast.error('Unauthorized. Please use the customer login.');
        setIsLoading(false);
        return;
      }

      login(response.data.accessToken, response.data.refreshToken, response.data.user);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Luxury Event Setup" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <Link href="/" className="flex items-center gap-2 mb-8 inline-block">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Diamond className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white flex items-center h-10">
              Luxe<span className="font-light">Events</span>
            </span>
          </Link>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Manage your premium bookings.
          </h2>
          <p className="text-lg text-slate-300 font-light max-w-md">
            Welcome back to the vendor portal. Sign in to access your dashboard, respond to clients, and grow your business.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="absolute top-8 right-8">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <Link href="/vendor/register" className="text-primary hover:underline font-semibold">
              Register here
            </Link>
          </p>
        </div>

        <div className="w-full max-w-md space-y-8 mt-12 lg:mt-0">
          
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Diamond className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Luxe<span className="font-light">Events</span>
            </span>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Vendor Sign In</h1>
            <p className="text-slate-500">
              Enter your credentials to access your vendor dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Business Email</Label>
              <Input id="email" type="email" className="h-12 bg-white border-slate-200 focus-visible:ring-primary" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
              </div>
              <Input id="password" type="password" className="h-12 bg-white border-slate-200 focus-visible:ring-primary" {...register('password')} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
