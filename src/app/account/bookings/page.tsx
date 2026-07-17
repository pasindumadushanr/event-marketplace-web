'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Building2, CalendarDays, CheckCircle2, Clock, MapPin, SearchX } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/customer/account/bookings');
        setBookings(res.data);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusStep = (status: string) => {
    if (status === 'PENDING') return 1;
    if (status === 'CONFIRMED') return 2;
    if (status === 'COMPLETED') return 3;
    if (status === 'CANCELLED') return -1;
    return 0;
  };

  const TimelineNode = ({ active, completed, label, isLast }: any) => (
    <div className="flex flex-col items-center relative flex-1">
      <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white transition-colors duration-300
        ${completed ? 'border-primary text-primary' : active ? 'border-blue-500 text-blue-500' : 'border-slate-200 text-slate-300'}
      `}>
        {completed ? <CheckCircle2 className="w-5 h-5" /> : <div className={`w-3 h-3 rounded-full ${active ? 'bg-blue-500' : 'bg-slate-200'}`} />}
      </div>
      <span className={`mt-3 text-xs font-semibold uppercase tracking-wider ${active || completed ? 'text-slate-900' : 'text-slate-400'}`}>
        {label}
      </span>
      {!isLast && (
        <div className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 transition-colors duration-300
          ${completed ? 'bg-primary' : 'bg-slate-100'}
        `} />
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Bookings</h2>
        <p className="text-slate-500 mt-1">Track the status of your upcoming events and vendor requests.</p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><div className="animate-pulse flex space-x-4"><div className="rounded-full bg-slate-200 h-10 w-10"></div><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-slate-200 rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-slate-200 rounded col-span-2"></div><div className="h-2 bg-slate-200 rounded col-span-1"></div></div><div className="h-2 bg-slate-200 rounded"></div></div></div></div></div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center">
          <SearchX className="h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Bookings Found</h3>
          <p className="text-slate-500 max-w-sm mb-6">You haven't requested any vendors yet. Explore the marketplace to find the perfect professionals for your event.</p>
          <Link href="/vendors">
            <Button className="bg-slate-900 hover:bg-primary text-white">Explore Vendors</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => {
            const step = getStatusStep(booking.status);
            
            return (
              <div key={booking.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                
                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <CalendarDays className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Event on {format(new Date(booking.date), 'MMMM do, yyyy')}
                      </h3>
                      <Link href={`/business/${booking.business.id}`} className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1 mt-1">
                        <Building2 className="h-3 w-3" /> {booking.business.name}
                      </Link>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-primary">LKR {Number(booking.totalAmount).toLocaleString()}</p>
                  </div>
                </div>

                {/* Status Timeline or Cancelled State */}
                {step === -1 ? (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center justify-center gap-2 font-medium">
                    <SearchX className="h-5 w-5" /> This booking request was cancelled or declined.
                  </div>
                ) : (
                  <div className="px-4">
                    <div className="flex justify-between max-w-xl mx-auto relative">
                      <TimelineNode 
                        label="Requested" 
                        active={step === 1} 
                        completed={step > 1} 
                      />
                      <TimelineNode 
                        label="Confirmed" 
                        active={step === 2} 
                        completed={step > 2} 
                      />
                      <TimelineNode 
                        label="Completed" 
                        active={step === 3} 
                        completed={step === 3} 
                        isLast={true} 
                      />
                    </div>
                    
                    {/* Status Helper Text */}
                    <p className="text-center text-sm text-slate-500 mt-6 font-medium">
                      {step === 1 && "The vendor is reviewing your request. They will confirm availability soon."}
                      {step === 2 && "The vendor has confirmed your booking! You're all set for the big day."}
                      {step === 3 && "This event has been successfully completed. Thank you for using Event Marketplace!"}
                    </p>
                  </div>
                )}

                {/* Package Details Footer */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-slate-500 font-medium">Package Booked: </span>
                      <span className="text-slate-900 font-semibold">{booking.package?.name || 'Custom Package'}</span>
                    </div>
                    {booking.package?.duration && (
                      <div className="text-sm flex items-center gap-1 text-slate-500">
                        <Clock className="h-4 w-4" /> {booking.package.duration}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
