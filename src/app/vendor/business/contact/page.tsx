'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Phone, Mail, Globe, Camera, MessageCircle } from 'lucide-react';

export default function ContactSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Saved Contact Settings');
    }, 1000);
  };

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
              <Input defaultValue="+94 77 123 4567" className="h-12 bg-white" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" /> Email Address
              </label>
              <Input type="email" defaultValue="events@grandballroom.lk" className="h-12 bg-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-slate-400" /> WhatsApp Number
              </label>
              <Input defaultValue="+94 77 123 4567" className="h-12 bg-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-400" /> Website URL
              </label>
              <Input defaultValue="https://grandballroom.lk" className="h-12 bg-white" placeholder="https://" />
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
              <Input defaultValue="https://facebook.com/grandballroom" className="h-12 bg-slate-50" placeholder="https://facebook.com/..." />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Camera className="h-4 w-4 text-pink-600" /> Instagram
              </label>
              <Input defaultValue="https://instagram.com/grandballroom" className="h-12 bg-slate-50" placeholder="https://instagram.com/..." />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">TikTok</label>
              <Input className="h-12 bg-slate-50" placeholder="https://tiktok.com/@..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">YouTube</label>
              <Input className="h-12 bg-slate-50" placeholder="https://youtube.com/..." />
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
