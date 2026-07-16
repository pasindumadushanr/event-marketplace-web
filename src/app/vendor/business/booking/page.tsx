'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, CalendarDays, FileText, Phone } from 'lucide-react';

export default function BookingSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [bookingMethod, setBookingMethod] = useState('REQUEST_QUOTE');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Saved Booking Settings', bookingMethod);
    }, 1000);
  };

  const methods = [
    {
      id: 'DIRECT_BOOKING',
      title: 'Direct Booking',
      description: 'Allow customers to book dates and packages instantly through the platform. Best for venues and simple packages.',
      icon: CalendarDays
    },
    {
      id: 'REQUEST_QUOTE',
      title: 'Request a Quote',
      description: 'Customers submit their requirements, and you provide a custom proposal. Best for highly customized services like photography.',
      icon: FileText
    },
    {
      id: 'CONTACT_ONLY',
      title: 'Contact Only',
      description: 'Display your contact information and require customers to call or message you directly to discuss bookings.',
      icon: Phone
    }
  ];

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Booking Settings</h2>
        <p className="text-slate-500 mt-1">How would you like customers to engage with your profile?</p>
      </div>

      <div className="space-y-4">
        {methods.map((method) => {
          const isSelected = bookingMethod === method.id;
          return (
            <div 
              key={method.id}
              onClick={() => setBookingMethod(method.id)}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                isSelected ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                <method.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isSelected ? 'text-primary' : 'text-slate-900'}`}>
                  {method.title}
                </h3>
                <p className="text-slate-500 mt-1">{method.description}</p>
              </div>
              <div className="ml-auto shrink-0 pt-2">
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-primary' : 'border-slate-300'
                }`}>
                  {isSelected && <div className="h-3 w-3 rounded-full bg-primary" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white min-w-[150px]">
          {isLoading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
        </Button>
      </div>
    </form>
  );
}
