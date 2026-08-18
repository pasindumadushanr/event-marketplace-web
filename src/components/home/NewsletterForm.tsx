'use client';

import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function NewsletterForm() {
  return (
    <div className="flex w-full md:w-auto max-w-md gap-2">
      <div className="relative w-full">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
        <Input 
          type="email" 
          placeholder="Enter your email" 
          className="pl-10 h-12 bg-slate-950 border-slate-800 text-white focus-visible:ring-primary w-full"
        />
      </div>
      <Button className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6">
        Subscribe
      </Button>
    </div>
  );
}
