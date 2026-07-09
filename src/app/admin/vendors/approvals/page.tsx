'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function AdminVendorApprovalsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/admin/vendors/applications?status=UNDER_REVIEW');
      setApplications(res.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this vendor?')) return;
    setIsProcessing(id);
    try {
      await api.patch(`/admin/vendors/applications/${id}/approve`);
      toast.success('Vendor approved successfully!');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to approve vendor');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason === null) return;
    if (!reason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    setIsProcessing(id);
    try {
      await api.patch(`/admin/vendors/applications/${id}/reject`, { reason });
      toast.success('Vendor application rejected.');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to reject vendor');
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading applications...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendor Approvals</h2>
          <p className="text-muted-foreground mt-1">Review and manage pending vendor applications.</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-1">
          {applications.length} Pending
        </Badge>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-slate-500 shadow-sm">
          No pending vendor applications to review at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold">{app.name}</h3>
                      <p className="text-slate-500 font-medium">{app.category?.name}</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">UNDER REVIEW</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 font-medium">Owner</p>
                      <p className="font-semibold">{app.vendor.firstName} {app.vendor.lastName}</p>
                      <p className="text-slate-600">{app.vendor.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Contact</p>
                      <p className="font-semibold">{app.phone || 'N/A'}</p>
                      <p className="text-slate-600">{app.email || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-400 font-medium">Location</p>
                      <p>{[app.address, app.city, app.district, app.province].filter(Boolean).join(', ')}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-400 font-medium">Description</p>
                      <p className="line-clamp-2 text-slate-700">{app.description || 'No description provided.'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-6 flex flex-col justify-center gap-3 border-l md:w-64">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    onClick={() => handleApprove(app.id)}
                    disabled={isProcessing === app.id}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Vendor
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleReject(app.id)}
                    disabled={isProcessing === app.id}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject Application
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
