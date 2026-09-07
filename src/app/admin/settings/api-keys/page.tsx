'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';

export default function ApiKeysSettingsPage() {
  const [settings, setSettings] = useState({
    googleMapsApiKey: '',
    googleAnalyticsId: '',
    stripePublishableKey: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/cms/public/settings/apikeys');
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
      await api.post('/admin/cms/settings/apikeys', { value: settings });
      toast.success('API keys saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">API Keys & Integrations</h2>
        <p className="text-muted-foreground">Manage third-party API keys and configuration.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            External Services
          </CardTitle>
          <CardDescription>Securely store configuration for external platforms.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Google Maps API Key</Label>
              <Input 
                type="password"
                value={settings.googleMapsApiKey} 
                onChange={e => setSettings({...settings, googleMapsApiKey: e.target.value})} 
                placeholder="AIzaSy..."
              />
              <p className="text-xs text-zinc-500">Used for vendor location maps and distance calculations.</p>
            </div>
            
            <div className="space-y-2">
              <Label>Google Analytics Measurement ID</Label>
              <Input 
                value={settings.googleAnalyticsId} 
                onChange={e => setSettings({...settings, googleAnalyticsId: e.target.value})} 
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-xs text-zinc-500">Used for frontend traffic analytics.</p>
            </div>

            <div className="space-y-2">
              <Label>Stripe Publishable Key</Label>
              <Input 
                value={settings.stripePublishableKey} 
                onChange={e => setSettings({...settings, stripePublishableKey: e.target.value})} 
                placeholder="pk_test_..."
              />
              <p className="text-xs text-zinc-500">Used for client-side payment tokenization.</p>
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
