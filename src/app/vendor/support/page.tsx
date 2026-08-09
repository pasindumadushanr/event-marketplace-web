'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { LifeBuoy, Mail, PhoneCall, BookOpen, MessageSquare, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const supportSchema = z.object({
  subject: z.string().min(1, 'Please provide a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type SupportFormValues = z.infer<typeof supportSchema>;

export default function VendorSupportPage() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema),
  });

  const onSubmit = async (data: SupportFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post('/contact', {
        name: `${user?.firstName} ${user?.lastName} (Vendor)`,
        email: user?.email,
        subject: data.subject,
        message: data.message,
      });
      toast.success('Support ticket submitted successfully. Our team will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to submit support ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Support & Help Center</h2>
        <p className="text-muted-foreground mt-1 text-slate-500">
          Need assistance? We're here to help you get the most out of your vendor account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col: Contact Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-bold text-slate-900">Submit a Ticket</h3>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6 opacity-60">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Name</label>
                  <Input value={`${user?.firstName || ''} ${user?.lastName || ''}`} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Email</label>
                  <Input value={user?.email || ''} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Subject</label>
                <select 
                  {...register('subject')}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a topic...</option>
                  <option value="Billing & Payouts">Billing & Payouts</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Account Management">Account Management</option>
                  <option value="Customer Dispute">Customer Dispute</option>
                  <option value="Other">Other</option>
                </select>
                {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">How can we help?</label>
                <Textarea 
                  {...register('message')} 
                  rows={6}
                  placeholder="Please describe your issue in detail..."
                  className="resize-none"
                />
                {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
              </div>

              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Support Ticket
              </Button>
            </form>
          </div>
        </div>

        {/* Right Col: Resources */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <LifeBuoy className="h-24 w-24" />
            </div>
            <h4 className="font-bold text-lg mb-2 relative z-10">Premium Support</h4>
            <p className="text-slate-300 text-sm mb-6 relative z-10">
              As a verified vendor, you receive priority support. We typically respond within 2-4 hours during business days.
            </p>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium">vendors@eventmarketplace.com</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium">+94 (11) 234 5678</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-slate-400" />
              <h4 className="font-bold text-slate-900">Helpful Resources</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-blue-600 hover:underline font-medium block">How to optimize your profile</a>
                <span className="text-slate-500 text-xs">Learn how to attract more customers.</span>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline font-medium block">Understanding Payouts</a>
                <span className="text-slate-500 text-xs">A guide to our payment schedule.</span>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline font-medium block">Managing Calendar Conflicts</a>
                <span className="text-slate-500 text-xs">Best practices for handling double bookings.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
