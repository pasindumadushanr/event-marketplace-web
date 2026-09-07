'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Bell } from 'lucide-react';
import { format } from 'date-fns';

export default function NotificationsPage() {
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', message: '', targetRole: 'ALL' });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const res = await api.get('/notifications/admin/broadcasts');
      setBroadcasts(res.data);
    } catch (error) {
      toast.error('Failed to load broadcast history');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await api.post('/notifications/admin/broadcast', formData);
      toast.success('Notification broadcasted successfully');
      setFormData({ title: '', message: '', targetRole: 'ALL' });
      fetchBroadcasts();
    } catch (error) {
      toast.error('Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Global Notifications</h2>
        <p className="text-muted-foreground">Broadcast alerts and updates to users across the platform.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              New Broadcast
            </CardTitle>
            <CardDescription>Send a system notification to specific user groups.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select 
                  value={formData.targetRole} 
                  onValueChange={(val) => setFormData({...formData, targetRole: val as string})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Users (Everyone)</SelectItem>
                    <SelectItem value="VENDOR">Vendors Only</SelectItem>
                    <SelectItem value="CUSTOMER">Customers Only</SelectItem>
                    <SelectItem value="ADMIN">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g., Scheduled Maintenance"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea 
                  value={formData.message} 
                  onChange={e => setFormData({...formData, message: e.target.value})} 
                  placeholder="Enter the notification content..."
                  rows={4}
                  required
                />
              </div>
              
              <Button type="submit" disabled={isSending} className="w-full">
                {isSending ? 'Sending...' : 'Broadcast Notification'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Broadcast History
            </CardTitle>
            <CardDescription>Recent notifications sent by the system.</CardDescription>
          </CardHeader>
          <CardContent>
            {broadcasts.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-8">No broadcasts sent yet.</p>
            ) : (
              <div className="space-y-4">
                {broadcasts.map((b) => (
                  <div key={b.id} className="p-4 border rounded-lg bg-zinc-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{b.title}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                        {b.targetRole === 'ALL' ? 'Everyone' : b.targetRole}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 mb-2">{b.message}</p>
                    <p className="text-xs text-zinc-400">
                      Sent on {format(new Date(b.createdAt), 'MMM dd, yyyy h:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
