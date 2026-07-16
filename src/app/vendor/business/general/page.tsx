'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Image as ImageIcon, Save } from 'lucide-react';

export default function GeneralSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock save
    setTimeout(() => {
      setIsLoading(false);
      console.log('Saved General Settings');
    }, 1000);
  };

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
          <div className="h-48 bg-slate-200 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-primary/50 transition-colors cursor-pointer">
            <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
            <span className="text-sm text-slate-500 font-medium">Click to upload cover image (1920x1080)</span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700">Business Logo</label>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-2xl bg-slate-200 flex items-center justify-center border border-slate-300">
              <Camera className="h-6 w-6 text-slate-400" />
            </div>
            <div className="flex-1">
              <Button type="button" variant="outline" className="mb-2">Change Logo</Button>
              <p className="text-xs text-slate-500">Recommended size: 400x400px. JPG, PNG or WEBP.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Business Name</label>
          <Input defaultValue="The Grand Ballroom Colombo" className="h-12 bg-slate-50" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Primary Category</label>
          <select className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="1">Hotels & Venues</option>
            <option value="2">Photographers</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Years of Experience</label>
          <Input type="number" defaultValue="15" className="h-12 bg-slate-50" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Business Description</label>
          <Textarea 
            className="min-h-[150px] bg-slate-50 resize-y" 
            defaultValue="The Grand Ballroom Colombo is the epitome of luxury and elegance..."
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Languages Spoken (Comma separated)</label>
          <Input defaultValue="English, Sinhala, Tamil" className="h-12 bg-slate-50" />
          <p className="text-xs text-slate-500">Example: English, Sinhala, Tamil</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Business Highlights (Comma separated)</label>
          <Input defaultValue="5-Star Luxury Venue, In-house International Chefs" className="h-12 bg-slate-50" />
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
