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

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function VendorRegisterPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Force VENDOR role
      const payload = { ...data, role: 'VENDOR' };
      const response = await api.post('/auth/register', payload);
      
      // Auto login to set JWT, which will route them to /vendor
      login(response.data.accessToken, response.data.refreshToken, response.data.user);
      
      toast.success('Account created! Please verify your email.');
      // The layout or auth context will route them, but since we want them to go to verify-email:
      window.location.href = '/vendor/verify-email';
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create account');
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
            Join the most exclusive event marketplace.
          </h2>
          <p className="text-lg text-slate-300 font-light max-w-md">
            Connect with premium clients, manage bookings seamlessly, and elevate your event business to the next level.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="absolute top-8 right-8">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Log in
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
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create Vendor Account</h1>
            <p className="text-slate-500">
              Enter your details to start accepting premium bookings today.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-700 font-semibold">First Name</Label>
                <Input id="firstName" className="h-12 bg-white border-slate-200 focus-visible:ring-primary" {...register('firstName')} />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-700 font-semibold">Last Name</Label>
                <Input id="lastName" className="h-12 bg-white border-slate-200 focus-visible:ring-primary" {...register('lastName')} />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Business Email</Label>
              <Input id="email" type="email" className="h-12 bg-white border-slate-200 focus-visible:ring-primary" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700 font-semibold">Phone Number</Label>
              <Input id="phone" type="tel" className="h-12 bg-white border-slate-200 focus-visible:ring-primary" {...register('phone')} />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
              <Input id="password" type="password" className="h-12 bg-white border-slate-200 focus-visible:ring-primary" {...register('password')} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Continue to Onboarding'}
            </Button>
            
            <p className="text-center text-sm text-slate-500 mt-6">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
