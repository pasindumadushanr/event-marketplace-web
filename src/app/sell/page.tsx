'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, TrendingUp, Shield, Store } from 'lucide-react';

export default function SellLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <header className="w-full bg-white border-b py-6 px-8 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Event Marketplace</h1>
        <Link href="/login">
          <Button variant="outline">Vendor Login</Button>
        </Link>
      </header>

      <main className="w-full max-w-6xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-8">
          <h2 className="text-5xl font-extrabold text-slate-900 leading-tight">
            Grow your event business with <span className="text-blue-600">premium customers</span>.
          </h2>
          <p className="text-xl text-slate-600">
            Join thousands of successful venues, photographers, and caterers managing their entire business on the Event Marketplace platform.
          </p>
          
          <div className="space-y-4">
            {[
              'Reach thousands of engaged couples and planners',
              'Receive direct online bookings and payments',
              'Manage your schedule with our built-in calendar',
              'Build trust with verified reviews and badges'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500 h-6 w-6 shrink-0" />
                <span className="text-lg text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link href="/vendor/register">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg">
                Register Your Business
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:w-1/2 grid grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-md space-y-4 text-center mt-12">
            <TrendingUp className="h-12 w-12 text-blue-500 mx-auto" />
            <h3 className="text-xl font-bold">More Revenue</h3>
            <p className="text-slate-500">Vendors see an average 40% increase in bookings within 3 months.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md space-y-4 text-center">
            <Shield className="h-12 w-12 text-blue-500 mx-auto" />
            <h3 className="text-xl font-bold">Trusted Platform</h3>
            <p className="text-slate-500">We verify all customers to ensure you only get high-quality leads.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md space-y-4 text-center col-span-2">
            <Store className="h-12 w-12 text-blue-500 mx-auto" />
            <h3 className="text-xl font-bold">Powerful Dashboard</h3>
            <p className="text-slate-500">Manage your packages, gallery, reviews, and bookings all from one place.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
