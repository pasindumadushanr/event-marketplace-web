'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Event Marketplace',
    contactEmail: 'admin@eventmarketplace.com',
    currency: 'LKR',
    supportPhone: '+94701234567'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/cms/public/settings/general');
        if (res.data) setSettings(res.data);
      } catch (error) {
        // It's okay if not found initially
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post('/admin/cms/settings/general', { value: settings });
      toast.success('General settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">General Settings</h2>
        <p className="text-muted-foreground">Manage your platform's core configuration.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Details</CardTitle>
          <CardDescription>Basic information displayed across the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input 
                  value={settings.siteName} 
                  onChange={e => setSettings({...settings, siteName: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Input 
                  value={settings.currency} 
                  onChange={e => setSettings({...settings, currency: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input 
                  type="email"
                  value={settings.contactEmail} 
                  onChange={e => setSettings({...settings, contactEmail: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Support Phone</Label>
                <Input 
                  value={settings.supportPhone} 
                  onChange={e => setSettings({...settings, supportPhone: e.target.value})} 
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
