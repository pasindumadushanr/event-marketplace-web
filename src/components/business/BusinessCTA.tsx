'use client';

import { useState } from 'react';
import { BookingMethod } from '@/types/business-profile';
import { Button } from '@/components/ui/button';
import { CalendarDays, FileText, Phone, MessageCircle, X, Loader2 } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { toast } from 'sonner';

interface BusinessCTAProps {
  businessId: string;
  bookingMethod: BookingMethod;
  startingPrice: number;
}

export function BusinessCTA({ businessId, bookingMethod, startingPrice }: BusinessCTAProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isMessaging, setIsMessaging] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setLoadingPackages(true);
    setShowBookingModal(true);
    try {
      const res = await api.get(`/discovery/vendors/${businessId}`);
      const pkgs = res.data?.packages || [];
      setPackages(pkgs);
      if (pkgs.length > 0) setSelectedPackageId(pkgs[0].id);
    } catch {
      toast.error('Failed to load packages');
    } finally {
      setLoadingPackages(false);
    }
  };

  const handleSubmitBooking = async () => {
    if (!selectedPackageId) {
      toast.error('Please select a package');
      return;
    }
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    setIsBooking(true);
    try {
      await api.post('/bookings', {
        packageId: selectedPackageId,
        date: selectedDate,
        notes,
      });
      toast.success('Booking request sent successfully!');
      setShowBookingModal(false);
      setSelectedDate('');
      setNotes('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsBooking(false);
    }
  };

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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <>
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-primary/20 sticky top-28">
        {startingPrice > 0 ? (
          <div className="text-center mb-6 pb-6 border-b border-slate-100">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Starting Price</p>
            <p className="text-3xl font-extrabold text-slate-900">
              LKR {startingPrice.toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="text-center mb-6 pb-6 border-b border-slate-100">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Pricing</p>
            <p className="text-xl font-extrabold text-slate-900">
              Custom Quote
            </p>
          </div>
        )}

        <div className="space-y-4">
          {bookingMethod === 'DIRECT_BOOKING' && (
            <>
              <Button 
                onClick={handleBookNow}
                className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 rounded-xl"
              >
                <CalendarDays className="mr-2 h-5 w-5" /> Book Now
              </Button>
              <p className="text-xs text-center text-slate-500 font-medium">Secure your date instantly online.</p>
            </>
          )}

          {bookingMethod === 'REQUEST_QUOTE' && (
            <>
              <Button 
                onClick={handleMessageVendor}
                disabled={isMessaging}
                className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-900/20 rounded-xl"
              >
                <FileText className="mr-2 h-5 w-5" /> {isMessaging ? 'Connecting...' : 'Request a Quote'}
              </Button>
              <p className="text-xs text-center text-slate-500 font-medium">Get a custom proposal within 24 hours.</p>
            </>
          )}

          {bookingMethod === 'CONTACT_ONLY' && (
            <>
              <Button 
                onClick={handleMessageVendor}
                disabled={isMessaging}
                className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg rounded-xl"
              >
                <Phone className="mr-2 h-5 w-5" /> {isMessaging ? 'Connecting...' : 'Contact Vendor'}
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

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Book This Vendor</h3>
              <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {loadingPackages ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : packages.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-slate-500 mb-4">This vendor hasn&apos;t created any packages yet. Please message them directly.</p>
                  <Button onClick={() => { setShowBookingModal(false); handleMessageVendor(); }} className="bg-primary text-white">
                    <MessageCircle className="mr-2 h-4 w-4" /> Message Vendor
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">Select Package</label>
                    <select
                      value={selectedPackageId}
                      onChange={(e) => setSelectedPackageId(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {packages.map((pkg: any) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} — LKR {Number(pkg.price).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">Event Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={minDate}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">Notes (Optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests or details about your event..."
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleSubmitBooking}
                    disabled={isBooking}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl"
                  >
                    {isBooking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarDays className="mr-2 h-5 w-5" />}
                    {isBooking ? 'Submitting...' : 'Confirm Booking'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
