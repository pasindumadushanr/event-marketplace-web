'use client';

import { useState } from 'react';
import { BookingMethod } from '@/types/business-profile';
import { Button } from '@/components/ui/button';
import { CalendarDays, FileText, Phone, MessageCircle } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';

interface BusinessCTAProps {
  businessId: string;
  bookingMethod: BookingMethod;
  startingPrice: number;
}

export function BusinessCTA({ businessId, bookingMethod, startingPrice }: BusinessCTAProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isMessaging, setIsMessaging] = useState(false);

  const handleMessageVendor = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setIsMessaging(true);
    try {
      await api.post('/chat/conversations', { businessId });
      router.push('/account/messages');
    } catch (error) {
      console.error('Failed to start chat:', error);
      setIsMessaging(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-primary/20 sticky top-28">
      <div className="text-center mb-6 pb-6 border-b border-slate-100">
        <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Starting Price</p>
        <p className="text-3xl font-extrabold text-slate-900">
          LKR {startingPrice.toLocaleString()}
        </p>
      </div>

      <div className="space-y-4">
        {bookingMethod === 'DIRECT_BOOKING' && (
          <>
            <Button className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 rounded-xl">
              <CalendarDays className="mr-2 h-5 w-5" /> Book Now
            </Button>
            <p className="text-xs text-center text-slate-500 font-medium">Secure your date instantly online.</p>
          </>
        )}

        {bookingMethod === 'REQUEST_QUOTE' && (
          <>
            <Button className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-900/20 rounded-xl">
              <FileText className="mr-2 h-5 w-5" /> Request a Quote
            </Button>
            <p className="text-xs text-center text-slate-500 font-medium">Get a custom proposal within 24 hours.</p>
          </>
        )}

        {bookingMethod === 'CONTACT_ONLY' && (
          <>
            <Button className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg rounded-xl">
              <Phone className="mr-2 h-5 w-5" /> Contact Vendor
            </Button>
            <p className="text-xs text-center text-slate-500 font-medium">Reach out directly to discuss your event.</p>
          </>
        )}
        
        <Button 
          variant="outline" 
          onClick={handleMessageVendor}
          disabled={isMessaging}
          className="w-full h-14 text-lg border-primary text-primary hover:bg-primary/5 font-bold rounded-xl mt-4"
        >
          <MessageCircle className="mr-2 h-5 w-5" /> {isMessaging ? 'Connecting...' : 'Message Vendor'}
        </Button>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center gap-4">
        <Button variant="outline" className="flex-1 rounded-xl font-semibold border-slate-200">
          Save to Favorites
        </Button>
        <Button variant="outline" className="flex-1 rounded-xl font-semibold border-slate-200">
          Share
        </Button>
      </div>
    </div>
  );
}
