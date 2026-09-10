'use client';

import { useState } from 'react';
import { BookingMethod } from '@/types/business-profile';
import { Button } from '@/components/ui/button';
import { CalendarDays, FileText, Phone, MessageCircle, X, Loader2, CheckCircle2, Calendar, FileEdit } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { toast } from 'sonner';

interface BusinessCTAProps {
  businessId: string;
  bookingMethod: BookingMethod;
  startingPrice: number;
}

const parsePrice = (val: any) => {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val);
  if (val.toString) {
    const str = val.toString();
    if (str !== '[object Object]') return parseFloat(str);
  }
  return 0;
};

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

  const selectedPkg = packages.find(p => p.id === selectedPackageId);

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

      {/* Enhanced Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowBookingModal(false)}></div>
          
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-white to-white p-6 sm:px-8 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Reserve Your Date</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Fill out the details below to request a booking.</p>
              </div>
              <button 
                onClick={() => setShowBookingModal(false)} 
                className="p-2 bg-white hover:bg-slate-100 rounded-full shadow-sm transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:px-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {loadingPackages ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-slate-500 font-medium">Loading packages...</p>
                </div>
              ) : packages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">No Packages Available</h4>
                  <p className="text-slate-500 mb-6 max-w-sm mx-auto">This vendor hasn't set up standard packages yet. Please send them a direct message to discuss pricing.</p>
                  <Button onClick={() => { setShowBookingModal(false); handleMessageVendor(); }} className="bg-slate-900 text-white hover:bg-slate-800 h-12 px-8 rounded-xl font-bold">
                    Message Vendor
                  </Button>
                </div>
              ) : (
                <>
                  {/* Step 1: Package */}
                  <div className="space-y-3">
                    <label className="flex items-center text-xs font-black text-slate-500 uppercase tracking-widest">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-700 mr-2 text-[10px]">1</span>
                      Select Package
                    </label>
                    <select
                      value={selectedPackageId}
                      onChange={(e) => setSelectedPackageId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                    >
                      {packages.map((pkg: any) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} — LKR {parsePrice(pkg.price).toLocaleString()}
                        </option>
                      ))}
                    </select>

                    {/* Selected Package Details Card */}
                    {selectedPkg && (
                      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mt-2 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-bold text-slate-900 leading-tight">{selectedPkg.name}</span>
                          <span className="font-extrabold text-primary shrink-0 ml-4">LKR {parsePrice(selectedPkg.price).toLocaleString()}</span>
                        </div>
                        {selectedPkg.features?.length > 0 && (
                          <ul className="text-sm text-slate-600 space-y-1.5">
                            {selectedPkg.features.map((f: string, i: number) => (
                              <li key={i} className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mr-2 mt-0.5"/> 
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Step 2: Date */}
                  <div className="space-y-3">
                    <label className="flex items-center text-xs font-black text-slate-500 uppercase tracking-widest">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-700 mr-2 text-[10px]">2</span>
                      Event Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={minDate}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Step 3: Notes */}
                  <div className="space-y-3">
                    <label className="flex items-center text-xs font-black text-slate-500 uppercase tracking-widest">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-700 mr-2 text-[10px]">3</span>
                      Event Details <span className="text-slate-400 font-medium ml-1 lowercase">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-4 left-4 pointer-events-none">
                        <FileEdit className="h-5 w-5 text-slate-400" />
                      </div>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Tell us about your event venue, guest count, or any special requests..."
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {!loadingPackages && packages.length > 0 && (
              <div className="p-6 sm:px-8 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBookingModal(false)}
                  className="w-full sm:w-1/3 h-14 rounded-xl font-bold border-slate-200 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitBooking}
                  disabled={isBooking}
                  className="w-full sm:w-2/3 h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 text-lg transition-transform active:scale-[0.98]"
                >
                  {isBooking ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <CalendarDays className="mr-2 h-5 w-5" />
                  )}
                  {isBooking ? 'Submitting...' : 'Confirm Request'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
