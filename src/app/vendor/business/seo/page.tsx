'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Search, Image as ImageIcon } from 'lucide-react';

export default function SEOSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Saved SEO Settings');
    }, 1000);
  };

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
            <Input defaultValue="the-grand-ballroom" className="h-12 rounded-l-none font-mono text-sm" />
          </div>
          <p className="text-xs text-slate-500">Only lowercase letters, numbers, and hyphens. Changing this will break old links!</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Meta Title</label>
          <Input defaultValue="The Grand Ballroom | Luxury Wedding Venue in Colombo" className="h-12" />
          <p className="text-xs text-slate-500">Recommended: 50-60 characters.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Meta Description</label>
          <Textarea 
            defaultValue="Book The Grand Ballroom for your luxury wedding in Colombo. Featuring 5-star catering, beautiful architecture, and parking for 500 guests." 
            rows={3} 
          />
          <p className="text-xs text-slate-500">Recommended: 150-160 characters. This appears in Google search results.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">SEO Keywords</label>
          <Input defaultValue="wedding venue, luxury hall colombo, event space sri lanka" className="h-12" />
          <p className="text-xs text-slate-500">Comma separated list of keywords.</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Search className="h-4 w-4" /> Open Graph Image (Social Sharing)
          </label>
          <p className="text-xs text-slate-500 mb-2">This image will appear when someone shares your profile link on WhatsApp or Facebook.</p>
          <div className="h-48 w-full md:w-96 bg-slate-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-primary/50 transition-colors cursor-pointer">
            <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
            <span className="text-sm text-slate-500 font-medium">Upload OG Image (1200x630px)</span>
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
