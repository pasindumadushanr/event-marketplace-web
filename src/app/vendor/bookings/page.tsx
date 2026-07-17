'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Phone,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/vendor');
      setBookings(res.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/bookings/vendor/${id}/status`, { status: newStatus });
      toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending Review</Badge>;
      case 'CONFIRMED':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Confirmed</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Booking Requests</h2>
        <p className="text-muted-foreground mt-1 text-slate-500">
          Manage your incoming booking requests and confirm dates with customers.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-slate-500 py-12">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-slate-500 py-16 border-2 border-dashed rounded-xl bg-white shadow-sm">
          <CalendarDays className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No booking requests yet</h3>
          <p>When customers request a package from your public profile, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row gap-6">
              
              {/* Left Column: Booking Core Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <CalendarDays className="h-4 w-4" />
                    Requested Date: <span className="text-slate-900 font-bold">{format(new Date(booking.date), 'MMMM do, yyyy')}</span>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">{booking.package?.name || 'Unknown Package'}</h3>
                  <p className="text-2xl font-bold text-primary mt-1">LKR {Number(booking.totalAmount).toLocaleString()}</p>
                </div>

                {booking.notes && (
                  <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 italic border border-slate-100 flex gap-3">
                    <MessageSquare className="h-5 w-5 text-slate-400 shrink-0" />
                    <p>"{booking.notes}"</p>
                  </div>
                )}
              </div>

              {/* Right Column: Customer Info & Actions */}
              <div className="lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6 space-y-6">
                
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Customer Details</h4>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-900">{booking.customer.firstName} {booking.customer.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <a href={`mailto:${booking.customer.email}`} className="text-blue-600 hover:underline">{booking.customer.email}</a>
                  </div>
                  {booking.customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <a href={`tel:${booking.customer.phone}`} className="text-blue-600 hover:underline">{booking.customer.phone}</a>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  {booking.status === 'PENDING' && (
                    <>
                      <Button 
                        onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" /> Accept Booking
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => updateStatus(booking.id, 'CANCELLED')}
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-2" /> Decline
                      </Button>
                    </>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <Button 
                      onClick={() => updateStatus(booking.id, 'COMPLETED')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Mark as Completed
                    </Button>
                  )}
                  {(booking.status === 'COMPLETED' || booking.status === 'CANCELLED') && (
                    <p className="text-sm text-center text-slate-500 font-medium bg-slate-50 p-2 rounded-lg">
                      This booking is {booking.status.toLowerCase()}.
                    </p>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
