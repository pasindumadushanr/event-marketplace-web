'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

import { Suspense } from 'react';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    
    if (accessToken && refreshToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const user = {
          id: payload.sub,
          email: payload.email,
          role: { name: payload.role },
          firstName: payload.firstName || '',
          lastName: payload.lastName || ''
        };
        
        login(accessToken, refreshToken, user as any);
        toast.success('Successfully logged in with Google!');
      } catch (e) {
        console.error('Failed to parse token payload', e);
        toast.error('Authentication failed');
        router.push('/login');
      }
    } else {
      toast.error('Authentication failed');
      router.push('/login');
    }
  }, [router, searchParams, login]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
        <p className="text-zinc-600 font-medium">Authenticating...</p>
        <Suspense fallback={null}>
          <AuthCallbackContent />
        </Suspense>
      </div>
    </div>
  );
}
