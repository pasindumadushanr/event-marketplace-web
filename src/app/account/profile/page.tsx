'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, User } from 'lucide-react';

export default function CustomerProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Personal Info</h2>
        <p className="text-slate-500 mt-1">Manage your basic profile details and avatar.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        
        {/* Avatar Section */}
        <div className="flex items-center gap-6 pb-8 border-b border-slate-100 mb-8">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {user.firstName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 p-2 bg-slate-900 rounded-full text-white hover:bg-primary transition-colors shadow-lg">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Profile Picture</h3>
            <p className="text-sm text-slate-500 mb-3">Upload a new photo (JPEG or PNG under 5MB)</p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">Upload new</Button>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Remove</Button>
            </div>
          </div>
        </div>

        {/* Info Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input defaultValue={user.firstName} />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input defaultValue={user.lastName} />
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input defaultValue={user.email} disabled className="bg-slate-50 text-slate-500" />
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed directly.</p>
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input defaultValue={user.phone || ''} placeholder="+1 (555) 000-0000" />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
          <Button className="bg-slate-900 hover:bg-primary text-white px-8">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
