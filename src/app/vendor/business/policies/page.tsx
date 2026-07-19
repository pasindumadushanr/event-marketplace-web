'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useBusinessProfile } from '@/contexts/BusinessProfileContext';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function PoliciesSettingsPage() {
  const { business, updateBusinessLocally } = useBusinessProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [policies, setPolicies] = useState({
    bookingPolicy: '',
    cancellationPolicy: '',
    paymentPolicy: ''
  });
  const [faqs, setFaqs] = useState<{ question: string, answer: string }[]>([]);

  useEffect(() => {
    if (business) {
      setPolicies({
        bookingPolicy: business.profileSettings?.policies?.bookingPolicy || '',
        cancellationPolicy: business.profileSettings?.policies?.cancellationPolicy || '',
        paymentPolicy: business.profileSettings?.policies?.paymentPolicy || ''
      });
      if (business.profileSettings?.faqs && Array.isArray(business.profileSettings.faqs)) {
        setFaqs(business.profileSettings.faqs);
      } else {
        setFaqs([{ question: '', answer: '' }]);
      }
    }
  }, [business]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanedFaqs = faqs.filter(faq => faq.question.trim() !== '' && faq.answer.trim() !== '');

    try {
      const payload = {
        profileSettings: {
          policies,
          faqs: cleanedFaqs
        }
      };
      await api.patch('/vendor/business', payload);
      updateBusinessLocally(payload);
      toast.success('Policies & FAQ saved!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save policies');
    } finally {
      setIsLoading(false);
    }
  };

  if (!business) return null;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Policies & FAQ</h2>
        <p className="text-slate-500 mt-1">Set clear expectations for your customers.</p>
      </div>

      {/* Policies */}
      <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h3 className="font-semibold text-slate-900">Business Policies</h3>
        
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700">Booking Policy</label>
          <Textarea 
            value={policies.bookingPolicy}
            onChange={(e) => setPolicies(p => ({ ...p, bookingPolicy: e.target.value }))}
            className="bg-white" rows={2} placeholder="e.g. A 30% non-refundable deposit is required..." 
          />
        </div>
        
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700">Cancellation Policy</label>
          <Textarea 
            value={policies.cancellationPolicy}
            onChange={(e) => setPolicies(p => ({ ...p, cancellationPolicy: e.target.value }))}
            className="bg-white" rows={2} placeholder="e.g. Cancellations made 90 days prior receive a 50% refund..." 
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700">Payment Policy</label>
          <Textarea 
            value={policies.paymentPolicy}
            onChange={(e) => setPolicies(p => ({ ...p, paymentPolicy: e.target.value }))}
            className="bg-white" rows={2} placeholder="e.g. Final payment is due 14 days before the event..." 
          />
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-semibold text-slate-900">Frequently Asked Questions</h3>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:bg-primary/10"
            onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
          >
            <Plus className="h-4 w-4 mr-2" /> Add FAQ
          </Button>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-slate-200 p-4 rounded-xl relative group">
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="absolute -top-3 -right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Question</label>
                  <Input 
                    value={faq.question}
                    onChange={(e) => {
                      const newFaqs = [...faqs];
                      newFaqs[index].question = e.target.value;
                      setFaqs(newFaqs);
                    }}
                    placeholder="e.g. Do you allow outside catering?" 
                    className="h-10" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Answer</label>
                  <Textarea 
                    value={faq.answer}
                    onChange={(e) => {
                      const newFaqs = [...faqs];
                      newFaqs[index].answer = e.target.value;
                      setFaqs(newFaqs);
                    }}
                    placeholder="e.g. No, we provide all catering in-house." 
                    rows={2} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white min-w-[150px]">
          {isLoading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
        </Button>
      </div>
    </form>
  );
}
