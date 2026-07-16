'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

interface Application {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  vendorStatus: string;
  createdAt: string;
  address: string;
  city: string;
  vendor: {
    firstName: string;
    lastName: string;
    email: string;
  };
  category: {
    name: string;
  };
}

export default function VendorApprovalsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
    setIsProcessing(true);
    try {
      await api.patch(`/admin/vendors/applications/${id}/approve`);
      toast.success('Vendor application approved successfully!');
      setSelectedApp(null);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to approve application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setIsProcessing(true);
    try {
      await api.patch(`/admin/vendors/applications/${selectedApp?.id}/reject`, { reason: rejectReason });
      toast.success('Vendor application rejected.');
      setIsRejectModalOpen(false);
      setSelectedApp(null);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to reject application');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading applications...</div>;

  return (
    <div className="space-y-6 relative">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Vendor Approvals</h2>
        <p className="text-slate-500 mt-1">Review and approve new vendor onboarding applications.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Submitted On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-slate-500">
                  No pending applications found.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>{app.category?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {app.vendor.firstName} {app.vendor.lastName}
                    <br/>
                    <span className="text-xs text-slate-500">{app.vendor.email}</span>
                  </TableCell>
                  <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Under Review
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-2">Review Application</h3>
            <p className="text-slate-500 mb-6">Review the business details before making a decision.</p>

            <div className="space-y-6 my-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Business Name</p>
                  <p className="font-medium">{selectedApp.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Category</p>
                  <p className="font-medium">{selectedApp.category?.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Email</p>
                  <p className="font-medium">{selectedApp.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Phone</p>
                  <p className="font-medium">{selectedApp.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold uppercase text-slate-500">Location</p>
                  <p className="font-medium">{selectedApp.address}, {selectedApp.city}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold uppercase text-slate-500">Description</p>
                  <p className="text-sm mt-1 text-slate-700">{selectedApp.description || 'No description provided.'}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs font-semibold uppercase text-slate-500 mb-2">Vendor Account Details</p>
                <p className="font-medium">{selectedApp.vendor.firstName} {selectedApp.vendor.lastName}</p>
                <p className="text-sm text-slate-600">{selectedApp.vendor.email}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="ghost" onClick={() => setSelectedApp(null)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => setIsRejectModalOpen(true)} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                Reject Application
              </Button>
              <Button onClick={() => handleApprove(selectedApp.id)} disabled={isProcessing} className="bg-green-600 hover:bg-green-700 text-white">
                {isProcessing ? 'Processing...' : 'Approve & Activate'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2">Reject Application</h3>
            <p className="text-slate-500 mb-4 text-sm">
              Please provide a reason for rejecting this application. This will be sent to the vendor.
            </p>
            <div className="py-2">
              <Textarea
                placeholder="e.g. Please provide a valid business registration number..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
