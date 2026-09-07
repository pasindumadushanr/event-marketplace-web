'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function SeoSettingsPage() {
  const [settings, setSettings] = useState({
    metaTitle: 'Event Marketplace',
    metaDescription: 'Find the best vendors for your events in Sri Lanka.',
    keywords: 'events, weddings, photography, catering, sri lanka'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/cms/public/settings/seo');
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
      await api.post('/admin/cms/settings/seo', { value: settings });
      toast.success('SEO settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">SEO Settings</h2>
        <p className="text-muted-foreground">Manage search engine optimization for your platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global SEO Tags</CardTitle>
          <CardDescription>These tags will be used as fallbacks across the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Default Meta Title</Label>
              <Input 
                value={settings.metaTitle} 
                onChange={e => setSettings({...settings, metaTitle: e.target.value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Default Meta Description</Label>
              <Textarea 
                value={settings.metaDescription} 
                onChange={e => setSettings({...settings, metaDescription: e.target.value})} 
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Meta Keywords</Label>
              <Input 
                value={settings.keywords} 
                onChange={e => setSettings({...settings, keywords: e.target.value})} 
                placeholder="Comma separated keywords"
              />
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
