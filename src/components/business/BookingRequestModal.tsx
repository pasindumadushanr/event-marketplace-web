'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Package } from '@/types/business-profile';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const bookingSchema = z.object({
  date: z.string().min(1, 'Please select a preferred date'),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingRequestModalProps {
  pkg: Package | null;
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
}

export function BookingRequestModal({ pkg, isOpen, onClose, businessName }: BookingRequestModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  if (!pkg) return null;

  const onSubmit = async (data: BookingFormValues) => {
    if (!user) {
      toast.error('You must be logged in to request a booking.');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/bookings', {
        packageId: pkg.id,
        date: data.date,
        notes: data.notes
      });
      toast.success('Booking request sent successfully! The vendor will review it shortly.');
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit booking request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Request Booking</DialogTitle>
          <DialogDescription>
            You are requesting the <strong className="text-slate-900">{pkg.name}</strong> package from {businessName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Total Price</span>
            <span className="text-lg font-bold text-primary">LKR {Number(pkg.price).toLocaleString()}</span>
          </div>

          {!user && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
              You are currently not logged in. You will be redirected to the login page when you submit.
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Preferred Event Date *</label>
            <Input 
              type="date" 
              min={new Date().toISOString().split('T')[0]} 
              {...register('date')} 
            />
            {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Additional Notes (Optional)</label>
            <Textarea 
              placeholder="Tell the vendor a bit about your event..."
              className="resize-none h-24"
              {...register('notes')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? 'Sending Request...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
