'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Bell, Key } from 'lucide-react';

export default function CustomerSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
        <p className="text-slate-500 mt-1">Manage your security and notification preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Security & Password */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Key className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Password & Security</h3>
              <p className="text-sm text-slate-500">Update your password to keep your account secure.</p>
            </div>
          </div>
          
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" />
            </div>
            <Button className="mt-4 bg-slate-900 text-white hover:bg-primary">Update Password</Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
              <p className="text-sm text-slate-500">Choose what updates you want to receive.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-semibold text-slate-900">Booking Updates</p>
                <p className="text-sm text-slate-500">Get notified when a vendor confirms or declines your booking.</p>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary cursor-pointer">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-semibold text-slate-900">Marketing & Offers</p>
                <p className="text-sm text-slate-500">Receive special discounts and seasonal offers from vendors.</p>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 cursor-pointer">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-2xl border border-red-100 p-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-bold text-red-900">Danger Zone</h3>
          </div>
          <p className="text-sm text-red-700 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
