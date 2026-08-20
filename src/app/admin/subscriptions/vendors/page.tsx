'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminVendorSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await api.get('/subscriptions/vendors');
        setSubscriptions(res.data);
      } catch (error) {
        toast.error('Failed to load vendor subscriptions');
      }
    };
    fetchSubscriptions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendor Memberships</h1>
        <p className="text-muted-foreground">Monitor active and expired vendor subscription plans.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vendor Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">
                    {sub.vendor.firstName} {sub.vendor.lastName}
                    <br/><span className="text-xs text-muted-foreground">{sub.vendor.email}</span>
                  </TableCell>
                  <TableCell>
                    {sub.vendor.businesses?.[0]?.name || 'N/A'}
                  </TableCell>
                  <TableCell>{sub.plan.name}</TableCell>
                  <TableCell>{format(new Date(sub.startDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(sub.endDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={sub.status === 'ACTIVE' ? 'default' : 'secondary'} className={sub.status === 'EXPIRED' ? 'bg-red-100 text-red-800' : ''}>
                      {sub.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {subscriptions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No vendor subscriptions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
