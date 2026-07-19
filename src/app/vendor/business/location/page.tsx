'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, MapPin } from 'lucide-react';
import { useBusinessProfile } from '@/contexts/BusinessProfileContext';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function LocationSettingsPage() {
  const { business, updateBusinessLocally } = useBusinessProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    province: '',
    district: '',
    city: '',
    zipCode: '',
    googleMapLocation: ''
  });

  useEffect(() => {
    if (business) {
      setFormData({
        address: business.address || '',
        province: business.province || '',
        district: business.district || '',
        city: business.city || '',
        zipCode: business.zipCode || '',
        googleMapLocation: business.googleMapLocation || ''
      });
    }
  }, [business]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const extractMapSrc = (input: string) => {
    if (!input) return '';
    if (input.startsWith('http')) return input;
    // Extract src from iframe
    const srcMatch = input.match(/src="([^"]+)"/);
    if (srcMatch) return srcMatch[1];
    return input;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address.trim()) return toast.error('Address is required');
    if (!formData.city.trim()) return toast.error('City is required');

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        googleMapLocation: extractMapSrc(formData.googleMapLocation)
      };

      await api.patch('/vendor/business', payload);
      updateBusinessLocally(payload);
      toast.success('Location settings saved!');
      
      // Update local state if we extracted the URL
      if (payload.googleMapLocation !== formData.googleMapLocation) {
        setFormData(prev => ({ ...prev, googleMapLocation: payload.googleMapLocation }));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (!business) return null;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Location Details</h2>
        <p className="text-slate-500 mt-1">Where is your business located?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Full Address *</label>
          <Textarea name="address" value={formData.address} onChange={handleChange} className="bg-slate-50" rows={3} required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Province</label>
          <select name="province" value={formData.province} onChange={handleChange} className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-slate-50 px-3 py-2 text-sm">
            <option value="">Select Province...</option>
            <option value="Western Province">Western Province</option>
            <option value="Central Province">Central Province</option>
            <option value="Southern Province">Southern Province</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">District</label>
          <select name="district" value={formData.district} onChange={handleChange} className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-slate-50 px-3 py-2 text-sm">
            <option value="">Select District...</option>
            <option value="Colombo">Colombo</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Kalutara">Kalutara</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">City *</label>
          <Input name="city" value={formData.city} onChange={handleChange} className="h-12 bg-slate-50" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Postal Code</label>
          <Input name="zipCode" value={formData.zipCode} onChange={handleChange} className="h-12 bg-slate-50" />
        </div>

        <div className="space-y-6 md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Google Maps Integration
          </h3>
          <p className="text-sm text-slate-500">Paste your Google Maps Embed URL or iframe code here to display an interactive map on your profile.</p>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Embed URL (src)</label>
            <Textarea 
              name="googleMapLocation"
              value={formData.googleMapLocation}
              onChange={handleChange}
              className="bg-white text-xs font-mono" 
              rows={4}
              placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ></iframe>' 
            />
          </div>

          <div className="h-64 bg-slate-200 rounded-xl overflow-hidden mt-4 relative">
            {formData.googleMapLocation ? (
              <iframe 
                src={extractMapSrc(formData.googleMapLocation)}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 font-medium">
                <MapPin className="h-8 w-8 mb-2" />
                Map Preview
              </div>
            )}
          </div>
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
