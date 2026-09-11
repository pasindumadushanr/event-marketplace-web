'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/vendor/business/general');
  }, [router]);

  return (
    <div className="p-8 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
