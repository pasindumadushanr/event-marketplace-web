'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Search, Image as ImageIcon } from 'lucide-react';
import { useBusinessProfile } from '@/contexts/BusinessProfileContext';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function SEOSettingsPage() {
  const { business, updateBusinessLocally } = useBusinessProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogImage: ''
  });

  useEffect(() => {
    if (business) {
      setFormData({
        slug: business.profileSettings?.seo?.slug || business.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
        metaTitle: business.profileSettings?.seo?.metaTitle || '',
        metaDescription: business.profileSettings?.seo?.metaDescription || '',
        keywords: business.profileSettings?.seo?.keywords || '',
        ogImage: business.profileSettings?.seo?.ogImage || ''
      });
    }
  }, [business]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size must be less than 5MB');
    }

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      toast.loading('Uploading OG Image...', { id: 'upload-og' });
      const res = await api.post('/vendor/business/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, ogImage: res.data.url }));
      toast.success('Upload complete', { id: 'upload-og' });
    } catch (error) {
      toast.error('Upload failed', { id: 'upload-og' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        profileSettings: {
          seo: formData
        }
      };
      await api.patch('/vendor/business', payload);
      updateBusinessLocally(payload);
      toast.success('SEO settings saved!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save SEO settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (!business) return null;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">SEO Optimization</h2>
        <p className="text-slate-500 mt-1">Optimize how your profile appears on Google and social media.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Profile URL Slug</label>
          <div className="flex items-center">
            <span className="bg-slate-100 border border-slate-200 border-r-0 rounded-l-md px-3 h-12 flex items-center text-slate-500 font-mono text-sm shrink-0">
              eventmarketplace.com/business/
            </span>
            <Input name="slug" value={formData.slug} onChange={handleChange} className="h-12 rounded-l-none font-mono text-sm" />
          </div>
          <p className="text-xs text-slate-500">Only lowercase letters, numbers, and hyphens. Changing this will break old links!</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Meta Title</label>
          <Input name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="h-12" placeholder={`${business.name} | Luxury Vendor`} />
          <p className="text-xs text-slate-500">Recommended: 50-60 characters.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Meta Description</label>
          <Textarea 
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            placeholder="Book our services for your next event..." 
            rows={3} 
          />
          <p className="text-xs text-slate-500">Recommended: 150-160 characters. This appears in Google search results.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">SEO Keywords</label>
          <Input name="keywords" value={formData.keywords} onChange={handleChange} className="h-12" placeholder="wedding venue, luxury hall colombo..." />
          <p className="text-xs text-slate-500">Comma separated list of keywords.</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Search className="h-4 w-4" /> Open Graph Image (Social Sharing)
          </label>
          <p className="text-xs text-slate-500 mb-2">This image will appear when someone shares your profile link on WhatsApp or Facebook.</p>
          <div className="relative h-48 w-full md:w-96 bg-slate-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden">
            {formData.ogImage ? (
              <img src={formData.ogImage} alt="OG" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500 font-medium">Upload OG Image (1200x630px)</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
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
