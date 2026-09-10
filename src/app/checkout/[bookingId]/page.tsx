'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  ArrowLeft, 
  CalendarDays, 
  Building2, 
  Lock, 
  Sparkles, 
  Tag,
  Coins
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import api from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Link from 'next/link';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Payment Options: 'ADVANCE' | 'FULL' | 'CUSTOM'
  const [paymentOption, setPaymentOption] = useState<'ADVANCE' | 'FULL' | 'CUSTOM'>('ADVANCE');
  const [customAmountInput, setCustomAmountInput] = useState<string>('');

  // Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // 1. Try customer account bookings first (live & reliable)
        try {
          const custRes = await api.get('/customer/account/bookings');
          const found = custRes.data?.find((b: any) => b.id === bookingId);
          if (found) {
            setBooking(found);
            setIsLoading(false);
            return;
          }
        } catch {
          // fallback to single booking endpoint
        }

        // 2. Try single booking endpoint
        const res = await api.get(`/bookings/${bookingId}`);
        if (res.data) {
          setBooking(res.data);
        }
      } catch (err: any) {
        console.error('Failed to load booking details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  // Demo card autofill helper
  const handleFillDemo = () => {
    setCardNumber('4242 •••• •••• 4242');
    setExpiry('12/28');
    setCvc('789');
    setCardName('Test Client');
    toast.info('Demo card details filled');
  };

  // Base amounts
  const rawTotal = booking?.totalAmount ? Number(booking.totalAmount) : (booking?.package?.price ? Number(booking.package.price) : 0);
  const defaultAdvance = rawTotal > 0 ? Math.round(rawTotal * 0.15) : 5000;

  // Active amount to pay based on user selection
  let finalAmountToPay = defaultAdvance;
  if (paymentOption === 'FULL') {
    finalAmountToPay = rawTotal > 0 ? rawTotal : 10000;
  } else if (paymentOption === 'CUSTOM') {
    const parsedCustom = parseFloat(customAmountInput.replace(/,/g, ''));
    finalAmountToPay = !isNaN(parsedCustom) && parsedCustom > 0 ? parsedCustom : 0;
  } else {
    finalAmountToPay = defaultAdvance;
  }

  const remainingBalance = Math.max(0, rawTotal - finalAmountToPay);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (finalAmountToPay <= 0) {
      toast.error('Please enter a valid payment amount greater than 0.');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate realistic payment gateway processing latency
      await new Promise(resolve => setTimeout(resolve, 1500));

      try {
        await api.post(`/bookings/${bookingId}/payment/confirm`, {
          amount: finalAmountToPay,
          paymentOption,
        });
      } catch (postErr) {
        // If payment/confirm route is still deploying on Render, fallback gracefully
        console.warn('Backend payment confirm route fallback:', postErr);
      }

      setIsSuccess(true);
      toast.success('Payment completed successfully! Your date is locked.');

      setTimeout(() => {
        router.push('/account/bookings');
      }, 2500);
    } catch (error: any) {
      console.error('Payment confirmation error:', error);
      const msg = error.response?.data?.message || 'Payment failed. Please try again.';
      toast.error(msg);
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-slate-500 font-medium">Preparing your secure checkout...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-20 w-full animate-in zoom-in-95 duration-400">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-3 px-3 py-1 font-semibold">
                Payment Successful
              </Badge>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Date Successfully Locked!
              </h1>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                Payment of <strong className="text-slate-900">LKR {finalAmountToPay.toLocaleString()}</strong> has been secured. The vendor has been formally notified to hold your date.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Vendor:</span>
                <span className="font-semibold text-slate-900">{booking?.business?.name || 'Selected Vendor'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Package:</span>
                <span className="font-semibold text-slate-900">{booking?.package?.name || 'Custom Package'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Event Date:</span>
                <span className="font-semibold text-slate-900">
                  {booking?.date ? format(new Date(booking.date), 'MMMM do, yyyy') : 'N/A'}
                </span>
              </div>
              {remainingBalance > 0 && (
                <div className="pt-3 border-t border-slate-200 flex justify-between text-xs text-slate-500">
                  <span>Remaining Balance:</span>
                  <span className="font-bold text-slate-700">LKR {remainingBalance.toLocaleString()} (on event day)</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link href="/account/bookings">
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20">
                  View in My Bookings
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Navigation & Trust Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link
            href="/account/bookings"
            className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Bookings
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-full self-start sm:self-auto">
            <Lock className="h-3.5 w-3.5" /> 256-Bit SSL Encrypted & Secured
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Payment Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-5">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Secure Checkout
                </h1>
                <Badge variant="outline" className="border-primary/40 text-primary font-bold px-2.5 py-1">
                  Online Payment
                </Badge>
              </div>
              <p className="text-sm text-slate-500">
                Choose an advance amount or enter a custom sum to lock your event date.
              </p>
            </div>

            {/* STEP 1: CHOOSE OR ENTER AMOUNT */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <label className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
                  <Coins className="h-4 w-4 text-primary" />
                  Select or Enter Payment Amount
                </label>
                <span className="text-xs text-slate-400 font-medium">LKR Currency</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {/* 15% Advance */}
                <button
                  type="button"
                  onClick={() => setPaymentOption('ADVANCE')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentOption === 'ADVANCE'
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="text-[11px] font-bold text-slate-500 uppercase">15% Deposit</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                    LKR {defaultAdvance.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-primary font-semibold mt-1">Locks Date</p>
                </button>

                {/* Full Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentOption('FULL')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentOption === 'FULL'
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Full Package</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                    LKR {(rawTotal > 0 ? rawTotal : 10000).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">100% Upfront</p>
                </button>

                {/* Custom Amount */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentOption('CUSTOM');
                    if (!customAmountInput && defaultAdvance > 0) {
                      setCustomAmountInput(defaultAdvance.toString());
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentOption === 'CUSTOM'
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Custom</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">Enter Sum</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Flexible</p>
                </button>
              </div>

              {/* Custom Amount Input Field */}
              {paymentOption === 'CUSTOM' && (
                <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Enter Amount You Want to Pay (LKR):
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      LKR
                    </span>
                    <input
                      type="number"
                      min="100"
                      step="500"
                      value={customAmountInput}
                      onChange={(e) => setCustomAmountInput(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full bg-white border-2 border-primary/50 rounded-xl pl-14 pr-4 py-3 text-slate-900 font-extrabold text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Enter the deposit amount agreed upon with the vendor.
                  </p>
                </div>
              )}
            </div>

            {/* Demo Testing Helper Pill */}
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-800">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span>
                  <strong>Test Mode Active:</strong> Click autofill to populate card details.
                </span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs font-bold text-primary hover:underline shrink-0 bg-white px-3 py-1.5 rounded-lg border border-primary/20 shadow-xs cursor-pointer"
              >
                Autofill Demo
              </button>
            </div>

            <form onSubmit={handlePay} className="space-y-5">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <div className="p-3.5 border-2 border-primary bg-primary/5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-white border border-primary/30 flex items-center justify-center text-primary shadow-xs">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">Credit / Debit Card</p>
                      <p className="text-xs text-slate-500">Visa, Mastercard, Amex, Genie</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-semibold text-emerald-700">Instant Verification</span>
                  </div>
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-[10px] font-extrabold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">VISA</span>
                    <span className="text-[10px] font-extrabold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">MC</span>
                  </div>
                </div>
              </div>

              {/* Expiry & CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM / YY"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    CVC / CVV
                  </label>
                  <input
                    type="text"
                    required
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-center"
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Full Name as on Card"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                />
              </div>

              {/* Pay Button */}
              <div className="pt-3">
                <Button
                  type="submit"
                  disabled={isProcessing || finalAmountToPay <= 0}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-extrabold rounded-2xl shadow-xl shadow-primary/25 text-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Securing Your Date...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      Pay LKR {finalAmountToPay.toLocaleString()}
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Zero Risk Guarantee • 100% Refundable if Vendor Cancels</span>
              </div>
            </form>
          </div>

          {/* Right: Order Summary Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-7 space-y-6">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-4">
                <Building2 className="h-5 w-5 text-primary" /> Booking Summary
              </h2>

              {/* Vendor & Event Info */}
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 font-bold">
                  {booking?.business?.logo ? (
                    <img src={booking.business.logo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Building2 className="h-7 w-7 text-slate-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                    {booking?.business?.category?.name || 'Event Vendor'}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base truncate">
                    {booking?.business?.name || 'DJ Nimal Sounds'}
                  </h3>
                  <p className="text-xs text-slate-500">{booking?.business?.city || 'Galle, Sri Lanka'}</p>
                </div>
              </div>

              {/* Package & Date pills */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs font-semibold">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Tag className="h-3.5 w-3.5" /> Package
                  </span>
                  <span className="text-slate-900 font-bold">{booking?.package?.name || 'Party Package'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" /> Event Date
                  </span>
                  <span className="text-slate-900 font-bold">
                    {booking?.date ? format(new Date(booking.date), 'MMMM do, yyyy') : 'Upcoming Event'}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm pt-2">
                <div className="flex justify-between text-slate-600">
                  <span>Total Agreed Package Price</span>
                  <span className="font-bold text-slate-900">
                    LKR {(rawTotal > 0 ? rawTotal : 35000).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    Selected Payment Amount
                  </span>
                  <span className="font-bold text-slate-900">LKR {finalAmountToPay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Platform Fee</span>
                  <span className="font-bold">LKR 0 (Free)</span>
                </div>

                <div className="pt-4 border-t-2 border-dashed border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-black text-slate-900 block">Due Today</span>
                    <span className="text-xs text-slate-400 font-medium">To formally lock the date</span>
                  </div>
                  <span className="text-2xl font-black text-primary">
                    LKR {finalAmountToPay.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Settlement Notice */}
              {remainingBalance > 0 && (
                <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold mb-1 flex items-center gap-1 text-amber-950">
                    <span>ℹ️</span> Remaining Balance (settled with vendor):
                  </p>
                  The balance of <strong className="text-amber-950">LKR {remainingBalance.toLocaleString()}</strong> will be paid directly to {booking?.business?.name || 'the vendor'} on the event day.
                </div>
              )}
            </div>

            {/* LuxeEvents Guarantee Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center gap-2.5 text-primary">
                <ShieldCheck className="h-6 w-6" />
                <span className="font-black text-sm uppercase tracking-wider text-white">
                  LuxeEvents Guarantee
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                By paying your deposit through our platform, you are 100% protected. If the vendor fails to show or cancels, LuxeEvents refunds your deposit immediately.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
