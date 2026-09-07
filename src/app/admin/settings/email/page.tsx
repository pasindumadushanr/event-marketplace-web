'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@eventmarketplace.com',
    fromName: 'Event Marketplace'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/cms/public/settings/email');
        if (res.data) setSettings(res.data);
      } catch (error) {
        // Ignored if not found
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post('/admin/cms/settings/email', { value: settings });
      toast.success('Email settings saved successfully');
    } catch (error) {
      toast.error('Failed to save email settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Email Settings</h2>
        <p className="text-muted-foreground">Configure SMTP settings for outgoing platform emails.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            SMTP Configuration
          </CardTitle>
          <CardDescription>Enter your email provider credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SMTP Host</Label>
                <Input 
                  value={settings.smtpHost} 
                  onChange={e => setSettings({...settings, smtpHost: e.target.value})} 
                  placeholder="smtp.gmail.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label>SMTP Port</Label>
                <Input 
                  value={settings.smtpPort} 
                  onChange={e => setSettings({...settings, smtpPort: e.target.value})} 
                  placeholder="587"
                />
              </div>

              <div className="space-y-2">
                <Label>SMTP Username</Label>
                <Input 
                  value={settings.smtpUser} 
                  onChange={e => setSettings({...settings, smtpUser: e.target.value})} 
                  placeholder="youremail@gmail.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label>SMTP Password</Label>
                <Input 
                  type="password"
                  value={settings.smtpPassword} 
                  onChange={e => setSettings({...settings, smtpPassword: e.target.value})} 
                  placeholder="••••••••••••"
                />
              </div>
              
              <div className="space-y-2 pt-4 col-span-2 border-t border-slate-100">
                <h4 className="font-semibold text-sm mb-4">Sender Details</h4>
              </div>

              <div className="space-y-2">
                <Label>From Name</Label>
                <Input 
                  value={settings.fromName} 
                  onChange={e => setSettings({...settings, fromName: e.target.value})} 
                  placeholder="Event Marketplace"
                />
              </div>

              <div className="space-y-2">
                <Label>From Email</Label>
                <Input 
                  value={settings.fromEmail} 
                  onChange={e => setSettings({...settings, fromEmail: e.target.value})} 
                  placeholder="noreply@eventmarketplace.com"
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
