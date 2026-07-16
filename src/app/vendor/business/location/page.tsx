'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, MapPin } from 'lucide-react';

export default function LocationSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Saved Location Settings');
    }, 1000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Location Details</h2>
        <p className="text-slate-500 mt-1">Where is your business located?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Full Address</label>
          <Textarea defaultValue="No 45, Galle Road, Colombo 03" className="bg-slate-50" rows={3} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Province</label>
          <select className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-slate-50 px-3 py-2 text-sm">
            <option>Western Province</option>
            <option>Central Province</option>
            <option>Southern Province</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">District</label>
          <select className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-slate-50 px-3 py-2 text-sm">
            <option>Colombo</option>
            <option>Gampaha</option>
            <option>Kalutara</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">City</label>
          <Input defaultValue="Colombo" className="h-12 bg-slate-50" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Postal Code</label>
          <Input defaultValue="00300" className="h-12 bg-slate-50" />
        </div>

        <div className="space-y-6 md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Google Maps Integration
          </h3>
          <p className="text-sm text-slate-500">Paste your Google Maps Embed URL here to display an interactive map on your profile.</p>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Embed URL (src)</label>
            <Textarea 
              className="bg-white text-xs font-mono" 
              rows={4}
              defaultValue="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.62649033324!2d79.77380295834947!3d6.921833527787363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
            />
          </div>

          <div className="h-48 bg-slate-200 rounded-xl overflow-hidden mt-4 relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 font-medium">
              <MapPin className="h-8 w-8 mb-2" />
              Map Preview
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
