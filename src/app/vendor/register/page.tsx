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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Link href="/sell" className="mb-8 flex items-center text-white gap-2 hover:text-blue-400 transition-colors">
        <Building2 className="h-8 w-8" />
        <span className="text-2xl font-bold tracking-tight">Event Marketplace Partners</span>
      </Link>
      
      <Card className="w-full max-w-md shadow-2xl border-slate-800 bg-slate-900 text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">Create your Vendor Account</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Join the platform and start accepting bookings today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                <Input id="firstName" className="bg-slate-800 border-slate-700" {...register('firstName')} />
                {errors.firstName && <p className="text-sm text-red-400">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                <Input id="lastName" className="bg-slate-800 border-slate-700" {...register('lastName')} />
                {errors.lastName && <p className="text-sm text-red-400">{errors.lastName.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Business Email</Label>
              <Input id="email" type="email" className="bg-slate-800 border-slate-700" {...register('email')} />
              {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
              <Input id="phone" type="tel" className="bg-slate-800 border-slate-700" {...register('phone')} />
              {errors.phone && <p className="text-sm text-red-400">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input id="password" type="password" className="bg-slate-800 border-slate-700" {...register('password')} />
              {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Continue to Onboarding'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-800 pt-6">
          <p className="text-sm text-slate-400">
            Already have a vendor account?{' '}
            <Link href="/login" className="text-blue-400 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
