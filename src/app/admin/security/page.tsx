'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function SecurityPage() {
  const { logout } = useAuth();
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords don't match");
    }
    
    setIsSaving(true);
    try {
      await api.patch('/users/me/password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      toast.success('Password updated successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm("Are you sure you want to log out of all other devices? You will stay logged in here.")) return;
    
    setIsLoggingOutAll(true);
    try {
      await api.post('/users/me/logout-all');
      toast.success('Successfully logged out of all other devices');
    } catch (error) {
      toast.error('Failed to logout devices');
    } finally {
      setIsLoggingOutAll(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Security</h2>
        <p className="text-muted-foreground">Manage your password and active sessions.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input 
                  type="password" 
                  value={passwords.current}
                  onChange={e => setPasswords({...passwords, current: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input 
                  type="password" 
                  value={passwords.new}
                  onChange={e => setPasswords({...passwords, new: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input 
                  type="password" 
                  value={passwords.confirm}
                  onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <LogOut className="h-5 w-5" />
              Session Management
            </CardTitle>
            <CardDescription>Manage your active logins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-500">
              If you notice suspicious activity or left your account logged in on a public device, 
              you can instantly invalidate all other sessions.
            </p>
            <Button 
              variant="destructive" 
              onClick={handleLogoutAll} 
              disabled={isLoggingOutAll}
            >
              {isLoggingOutAll ? 'Processing...' : 'Log out of all other devices'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
