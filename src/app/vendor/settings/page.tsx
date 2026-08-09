'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { UserCircle, Shield, KeyRound, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function VendorSettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const { register: registerProfile, handleSubmit: handleSubmitProfile, reset: resetProfile, formState: { errors: profileErrors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, formState: { errors: passwordErrors } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get('/auth/me');
        resetProfile({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          phone: res.data.phone || '',
        });
      } catch (error) {
        toast.error('Failed to load profile data');
      }
    };
    fetchMe();
  }, [resetProfile]);

  const onSubmitProfile = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      await api.patch('/users/me', data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormValues) => {
    if (!data.password) {
      toast.error('Please enter a new password');
      return;
    }
    
    setIsPasswordSaving(true);
    try {
      await api.patch('/users/me', { password: data.password });
      toast.success('Password updated successfully');
      resetPassword({ password: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Account Settings</h2>
        <p className="text-muted-foreground mt-1 text-slate-500">
          Manage your personal account details and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Details Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <UserCircle className="h-6 w-6 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
            </div>
            
            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">First Name</label>
                  <Input {...registerProfile('firstName')} />
                  {profileErrors.firstName && <p className="text-xs text-red-500">{profileErrors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Last Name</label>
                  <Input {...registerProfile('lastName')} />
                  {profileErrors.lastName && <p className="text-xs text-red-500">{profileErrors.lastName.message}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Email Address</label>
                <Input {...registerProfile('email')} disabled={user?.authProvider === 'google'} className={user?.authProvider === 'google' ? 'bg-slate-50' : ''} />
                {profileErrors.email && <p className="text-xs text-red-500">{profileErrors.email.message}</p>}
                {user?.authProvider === 'google' && (
                  <p className="text-xs text-slate-500">Your email is managed by Google and cannot be changed here.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Phone Number</label>
                <Input {...registerProfile('phone')} />
              </div>

              <Button type="submit" disabled={isSaving} className="bg-slate-900 hover:bg-slate-800 text-white w-full sm:w-auto">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </div>

          {/* Security Section */}
          {user?.authProvider !== 'google' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <KeyRound className="h-6 w-6 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-900">Update Password</h3>
              </div>
              
              <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">New Password</label>
                  <Input type="password" {...registerPassword('password')} />
                  {passwordErrors.password && <p className="text-xs text-red-500">{passwordErrors.password.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Confirm New Password</label>
                  <Input type="password" {...registerPassword('confirmPassword')} />
                  {passwordErrors.confirmPassword && <p className="text-xs text-red-500">{passwordErrors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" disabled={isPasswordSaving} className="bg-slate-900 hover:bg-slate-800 text-white w-full sm:w-auto">
                  {isPasswordSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <Shield className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h4 className="font-semibold text-slate-900 mb-2">Account Security</h4>
            <p className="text-sm text-slate-500 mb-4">
              We take the security of your account seriously. Please ensure your contact details are always up to date.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
