'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Store, MapPin, UploadCloud, FileText, ChevronRight, ChevronLeft } from 'lucide-react';

export default function VendorOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '', description: '', email: '', phone: '', website: '',
    categoryId: '',
    address: '', city: '', district: '', province: '', zipCode: '',
  });

  useEffect(() => {
    api.get('/business-categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/vendor/business/onboarding/wizard', formData);
      toast.success('Application submitted successfully!');
      router.push('/vendor/status');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: 'Business Info', icon: Store },
    { title: 'Category', icon: CheckCircle2 },
    { title: 'Location', icon: MapPin },
    { title: 'Media', icon: UploadCloud },
    { title: 'Verification', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Partner Onboarding</h2>
          <p className="mt-2 text-lg text-slate-600">Complete your profile to start accepting bookings.</p>
        </div>

        {/* Progress Tracker */}
        <div className="mb-8 flex items-center justify-between">
          {steps.map((s, index) => {
            const isActive = step === index + 1;
            const isCompleted = step > index + 1;
            return (
              <div key={index} className="flex flex-col items-center relative w-full">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 z-10 bg-white ${isActive ? 'border-blue-600 text-blue-600' : isCompleted ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300 text-slate-400'}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mt-2 text-xs font-medium text-slate-500 absolute top-12 whitespace-nowrap">{s.title}</div>
                {index !== steps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}`} style={{ zIndex: 0 }} />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 mt-16 border border-slate-100">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-xl font-bold border-b pb-4">Step 1: Business Information</h3>
              <div className="space-y-4">
                <div><label className="text-sm font-medium">Business Name *</label><Input name="name" value={formData.name} onChange={handleChange} /></div>
                <div><label className="text-sm font-medium">Description</label><Textarea name="description" value={formData.description} onChange={handleChange} rows={4} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium">Business Email *</label><Input name="email" type="email" value={formData.email} onChange={handleChange} /></div>
                  <div><label className="text-sm font-medium">Phone Number *</label><Input name="phone" type="tel" value={formData.phone} onChange={handleChange} /></div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-xl font-bold border-b pb-4">Step 2: Business Category</h3>
              <div className="space-y-4">
                <label className="text-sm font-medium">Select your primary service category *</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="" disabled>Select category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-xl font-bold border-b pb-4">Step 3: Location</h3>
              <div className="space-y-4">
                <div><label className="text-sm font-medium">Street Address</label><Input name="address" value={formData.address} onChange={handleChange} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium">City</label><Input name="city" value={formData.city} onChange={handleChange} /></div>
                  <div><label className="text-sm font-medium">District</label><Input name="district" value={formData.district} onChange={handleChange} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium">Province</label><Input name="province" value={formData.province} onChange={handleChange} /></div>
                  <div><label className="text-sm font-medium">Zip Code</label><Input name="zipCode" value={formData.zipCode} onChange={handleChange} /></div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-xl font-bold border-b pb-4">Step 4: Branding (Optional for now)</h3>
              <div className="border-2 border-dashed rounded-xl p-8 text-center text-slate-500 bg-slate-50">
                <UploadCloud className="h-10 w-10 mx-auto text-blue-500 mb-2" />
                <p>Upload Logo & Cover Image</p>
                <p className="text-xs mt-2">You can easily update this later in your dashboard gallery!</p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-xl font-bold border-b pb-4">Step 5: Review & Submit</h3>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-blue-900">
                <h4 className="font-bold text-lg mb-2">Ready to join Event Marketplace?</h4>
                <p className="text-sm">By submitting this application, our administrative team will review your business details. Once approved, you will gain full access to the vendor dashboard to manage packages, bookings, and your public gallery.</p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between mt-10 pt-6 border-t">
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1 || isSubmitting}>
              <ChevronLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            
            {step < 5 ? (
              <Button onClick={() => setStep(step + 1)} className="bg-blue-600 hover:bg-blue-700">
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={submitApplication} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting ? 'Submitting...' : 'Submit Application'} <CheckCircle2 className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
