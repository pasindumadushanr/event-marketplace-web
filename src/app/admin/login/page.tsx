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

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
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
      
      const role = response.data.user?.roleName || response.data.user?.role?.name;
      if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
        toast.error('Unauthorized. This portal is for administrators only.');
        setIsLoading(false);
        return;
      }

      login(response.data.accessToken, response.data.refreshToken, response.data.user);
      toast.success('Admin logged in successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-zinc-950">
      <div className="w-full max-w-sm space-y-8 p-8 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Portal</h1>
          <p className="text-zinc-400 text-sm">
            Restricted access. Authorized personnel only.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              className="h-11 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              className="h-11 bg-zinc-800/50 border-zinc-700 text-white focus-visible:ring-zinc-600"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full h-11 text-base font-medium bg-white text-zinc-900 hover:bg-zinc-200 transition-all" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
