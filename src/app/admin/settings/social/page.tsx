'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function SocialSettingsPage() {
  const [settings, setSettings] = useState({
    facebook: 'https://facebook.com/eventmarketplace',
    instagram: 'https://instagram.com/eventmarketplace',
    twitter: 'https://twitter.com/eventmarketplace',
    youtube: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/cms/public/settings/social');
        if (res.data) setSettings(res.data);
      } catch (error) {
        // Ignored
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post('/admin/cms/settings/social', { value: settings });
      toast.success('Social links saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Social Media Links</h2>
        <p className="text-muted-foreground">Manage your platform's social media presence.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Social URLs</CardTitle>
          <CardDescription>These links will appear in the footer of the public website.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input 
                  value={settings.facebook} 
                  onChange={e => setSettings({...settings, facebook: e.target.value})} 
                  placeholder="https://facebook.com/..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input 
                  value={settings.instagram} 
                  onChange={e => setSettings({...settings, instagram: e.target.value})} 
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label>X (Twitter) URL</Label>
                <Input 
                  value={settings.twitter} 
                  onChange={e => setSettings({...settings, twitter: e.target.value})} 
                  placeholder="https://twitter.com/..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input 
                  value={settings.youtube} 
                  onChange={e => setSettings({...settings, youtube: e.target.value})} 
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
