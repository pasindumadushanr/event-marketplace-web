'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Phone, Mail, Globe, Camera, MessageCircle } from 'lucide-react';
import { useBusinessProfile } from '@/contexts/BusinessProfileContext';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function ContactSettingsPage() {
  const { business, updateBusinessLocally } = useBusinessProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    youtube: ''
  });

  useEffect(() => {
    if (business) {
      setFormData({
        phone: business.phone || '',
        email: business.email || '',
        whatsapp: business.profileSettings?.whatsapp || '',
        website: business.website || '',
        facebook: business.facebook || '',
        instagram: business.instagram || '',
        tiktok: business.profileSettings?.tiktok || '',
        youtube: business.youtube || ''
      });
    }
  }, [business]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const urlFields = ['website', 'facebook', 'instagram', 'tiktok', 'youtube'] as const;
    for (const field of urlFields) {
      if (!validateUrl(formData[field])) {
        return toast.error(`Invalid URL provided for ${field}`);
      }
    }

    setIsLoading(true);
    try {
      const payload = {
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        facebook: formData.facebook,
        instagram: formData.instagram,
        youtube: formData.youtube,
        profileSettings: {
          whatsapp: formData.whatsapp,
          tiktok: formData.tiktok,
        }
      };

      await api.patch('/vendor/business', payload);
      updateBusinessLocally(payload);
      toast.success('Contact settings saved!');
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
        <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>
        <p className="text-slate-500 mt-1">How customers can reach you directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Primary Contact */}
        <div className="space-y-6 md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="font-semibold text-slate-900">Primary Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" /> Phone Number
              </label>
              <Input name="phone" value={formData.phone} onChange={handleChange} className="h-12 bg-white" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" /> Email Address
              </label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} className="h-12 bg-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-slate-400" /> WhatsApp Number
              </label>
              <Input name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="h-12 bg-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-400" /> Website URL
              </label>
              <Input name="website" value={formData.website} onChange={handleChange} className="h-12 bg-white" placeholder="https://" />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-6 md:col-span-2">
          <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Social Media Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" /> Facebook
              </label>
              <Input name="facebook" value={formData.facebook} onChange={handleChange} className="h-12 bg-slate-50" placeholder="https://facebook.com/..." />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Camera className="h-4 w-4 text-pink-600" /> Instagram
              </label>
              <Input name="instagram" value={formData.instagram} onChange={handleChange} className="h-12 bg-slate-50" placeholder="https://instagram.com/..." />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">TikTok</label>
              <Input name="tiktok" value={formData.tiktok} onChange={handleChange} className="h-12 bg-slate-50" placeholder="https://tiktok.com/@..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">YouTube</label>
              <Input name="youtube" value={formData.youtube} onChange={handleChange} className="h-12 bg-slate-50" placeholder="https://youtube.com/..." />
            </div>
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
