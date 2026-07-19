'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Image as ImageIcon, Save } from 'lucide-react';
import { useBusinessProfile } from '@/contexts/BusinessProfileContext';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function GeneralSettingsPage() {
  const { business, updateBusinessLocally } = useBusinessProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    languages: '',
    highlights: '',
    coverImage: '',
    logo: ''
  });

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        categoryId: business.categoryId || '',
        description: business.description || '',
        languages: business.profileSettings?.languages || '',
        highlights: business.profileSettings?.highlights || '',
        coverImage: business.coverImage || '',
        logo: business.logo || ''
      });
    }
  }, [business]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size must be less than 5MB');
    }

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      toast.loading(`Uploading ${field}...`, { id: `upload-${field}` });
      const res = await api.post('/vendor/business/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, [field]: res.data.url }));
      toast.success('Upload complete', { id: `upload-${field}` });
    } catch (error) {
      toast.error('Upload failed', { id: `upload-${field}` });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Business name is required');
    
    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        categoryId: formData.categoryId,
        description: formData.description,
        coverImage: formData.coverImage,
        logo: formData.logo,
        profileSettings: {
          languages: formData.languages,
          highlights: formData.highlights,
        }
      };
      
      await api.patch('/vendor/business', payload);
      updateBusinessLocally(payload);
      toast.success('General settings saved!');
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
        <h2 className="text-2xl font-bold text-slate-900">General Information</h2>
        <p className="text-slate-500 mt-1">Update your primary business details and brand imagery.</p>
      </div>

      {/* Brand Imagery */}
      <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h3 className="font-semibold text-slate-900">Brand Imagery</h3>
        
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700">Cover Image</label>
          <div className="relative h-48 bg-slate-200 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden">
            {formData.coverImage ? (
              <img src={formData.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500 font-medium">Click to upload cover image (1920x1080)</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'coverImage')} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700">Business Logo</label>
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 rounded-2xl bg-slate-200 flex items-center justify-center border border-slate-300 overflow-hidden">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <Camera className="h-6 w-6 text-slate-400" />
              )}
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Upload Logo</p>
              <p className="text-xs text-slate-500 mt-1">Recommended size: 400x400px. JPG, PNG or WEBP.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Business Name *</label>
          <Input name="name" value={formData.name} onChange={handleChange} className="h-12 bg-slate-50" required />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Business Description</label>
          <Textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="min-h-[150px] bg-slate-50 resize-y" 
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Languages Spoken (Comma separated)</label>
          <Input name="languages" value={formData.languages} onChange={handleChange} className="h-12 bg-slate-50" />
          <p className="text-xs text-slate-500">Example: English, Sinhala, Tamil</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Business Highlights (Comma separated)</label>
          <Input name="highlights" value={formData.highlights} onChange={handleChange} className="h-12 bg-slate-50" />
          <p className="text-xs text-slate-500">Short bullet points that stand out on your profile.</p>
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
