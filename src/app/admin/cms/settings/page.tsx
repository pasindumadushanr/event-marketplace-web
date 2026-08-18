'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Globe, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Footer Settings State
  const [footerDesc, setFooterDesc] = useState('');
  const [copyright, setCopyright] = useState('');
  const [subtext, setSubtext] = useState('');
  
  // Social Links
  const [socials, setSocials] = useState({
    website: '',
    instagram: '',
    facebook: '',
    linkedin: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/cms/public/settings/FOOTER_CONTENT');
      if (res.data && res.data.value) {
        const val = res.data.value;
        setFooterDesc(val.description || '');
        setCopyright(val.copyright || '');
        setSubtext(val.subtext || '');
        if (val.socials) setSocials(val.socials);
      }
    } catch (error) {
      // It's normal for it to 404 if it hasn't been set yet
      console.log("No existing footer settings found.");
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        value: {
          description: footerDesc,
          copyright,
          subtext,
          socials
        }
      };
      
      await api.post('/admin/cms/settings/FOOTER_CONTENT', payload);
      toast.success('Footer settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center text-zinc-500">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Global Settings</h1>
          <p className="text-sm text-zinc-500">Manage global website content like the Footer.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="bg-zinc-950 text-white">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="border-b bg-zinc-50 px-6 py-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-zinc-500" />
          <h2 className="font-semibold text-zinc-800">Footer Settings</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-zinc-700">Brand Description</label>
              <textarea 
                className="w-full min-h-[100px] rounded-md border border-zinc-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950"
                value={footerDesc}
                onChange={(e) => setFooterDesc(e.target.value)}
                placeholder="The premier destination for luxury events..."
              />
              <p className="text-xs text-zinc-500">Appears directly below the logo in the footer.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm text-zinc-900 border-b pb-2">Social Media Links</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-zinc-500">Website URL</label>
                  <Input value={socials.website} onChange={e => setSocials({...socials, website: e.target.value})} placeholder="https://..." />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500">Instagram URL</label>
                  <Input value={socials.instagram} onChange={e => setSocials({...socials, instagram: e.target.value})} placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500">Facebook URL</label>
                  <Input value={socials.facebook} onChange={e => setSocials({...socials, facebook: e.target.value})} placeholder="https://facebook.com/..." />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500">LinkedIn URL</label>
                  <Input value={socials.linkedin} onChange={e => setSocials({...socials, linkedin: e.target.value})} placeholder="https://linkedin.com/..." />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm text-zinc-900 border-b pb-2">Copyright & Subtext</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-zinc-500">Copyright Text</label>
                  <Input value={copyright} onChange={e => setCopyright(e.target.value)} placeholder="© 2026 LuxeEvents..." />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500">Subtext</label>
                  <Input value={subtext} onChange={e => setSubtext(e.target.value)} placeholder="Designed for Premium Events" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
