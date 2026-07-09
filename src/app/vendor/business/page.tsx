'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export default function VendorBusinessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const res = await api.get('/vendor/business');
      setBusiness(res.data);
    } catch (error: any) {
      toast.error('Failed to load business profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusiness((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Exclude relational/un-updatable data from the payload
      const { id, vendorId, categoryId, category, createdAt, updatedAt, ...updateData } = business;
      await api.patch('/vendor/business', updateData);
      toast.success('Business profile updated successfully!');
      fetchBusiness();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update business profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading business profile...</div>;
  if (!business) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Business Profile</h2>
          <p className="text-muted-foreground mt-1">
            Manage your public business details, contact information, and location.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {business.isVerified ? (
            <Badge className="bg-green-600 hover:bg-green-700">Verified Business</Badge>
          ) : (
            <Badge variant="secondary" className="text-amber-600 bg-amber-50">Pending Verification</Badge>
          )}
          <Badge variant={business.status === 'ACTIVE' ? 'default' : 'secondary'}>
            Status: {business.status}
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Info */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Core Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Name</label>
              <Input name="name" value={business.name || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input value={business.category?.name || ''} disabled className="bg-slate-50 text-slate-500" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Business Description</label>
              <Textarea 
                name="description" 
                value={business.description || ''} 
                onChange={handleChange} 
                rows={4}
                placeholder="Describe your services, history, and what makes your business unique..." 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Hours</label>
              <Input name="businessHours" value={business.businessHours || ''} onChange={handleChange} placeholder="e.g. Mon-Fri 9AM-5PM" />
            </div>
          </div>
        </div>

        {/* Contact & Socials */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Contact & Socials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input name="phone" value={business.phone || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Email</label>
              <Input name="email" type="email" value={business.email || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website URL</label>
              <Input name="website" type="url" value={business.website || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Facebook Link</label>
              <Input name="facebook" type="url" value={business.facebook || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Instagram Link</label>
              <Input name="instagram" type="url" value={business.instagram || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">YouTube Link</label>
              <Input name="youtube" type="url" value={business.youtube || ''} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Location Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Street Address</label>
              <Input name="address" value={business.address || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input name="city" value={business.city || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">District</label>
              <Input name="district" value={business.district || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Province</label>
              <Input name="province" value={business.province || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Zip Code</label>
              <Input name="zipCode" value={business.zipCode || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Google Maps URL</label>
              <Input name="googleMapLocation" type="url" value={business.googleMapLocation || ''} onChange={handleChange} placeholder="https://goo.gl/maps/..." />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={fetchBusiness} disabled={isSaving}>Discard Changes</Button>
          <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
