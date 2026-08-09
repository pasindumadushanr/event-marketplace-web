'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Download, FileSpreadsheet, Loader2, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminReportsPage() {
  const [isExportingPayments, setIsExportingPayments] = useState(false);
  const [isExportingBookings, setIsExportingBookings] = useState(false);

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('No data available to export.');
      return;
    }

    // Extract headers
    const headers = Object.keys(data[0]);
    
    // Convert array of objects to CSV string
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          let val = row[header];
          // Handle nulls and quotes
          if (val === null || val === undefined) val = '';
          val = String(val).replace(/"/g, '""');
          return `"${val}"`;
        }).join(',')
      )
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPayments = async () => {
    setIsExportingPayments(true);
    try {
      const res = await api.get('/payments/admin');
      const payments = res.data;
      
      const formattedData = payments.map((p: any) => ({
        'Transaction ID': p.id,
        'Date': format(new Date(p.updatedAt), 'yyyy-MM-dd HH:mm:ss'),
        'Customer Name': `${p.customer?.firstName} ${p.customer?.lastName}`,
        'Customer Email': p.customer?.email,
        'Vendor Business': p.business?.businessName,
        'Gross Amount (LKR)': p.totalAmount,
        'Platform Commission (LKR)': Number(p.totalAmount) * 0.1,
        'Status': p.paymentStatus
      }));

      downloadCSV(formattedData, `Platform_Financial_Report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      toast.success('Payments exported successfully');
    } catch (error) {
      toast.error('Failed to export payments');
    } finally {
      setIsExportingPayments(false);
    }
  };

  const exportBookings = async () => {
    setIsExportingBookings(true);
    try {
      const res = await api.get('/bookings/admin');
      const bookings = res.data;
      
      const formattedData = bookings.map((b: any) => ({
        'Booking ID': b.id,
        'Created At': format(new Date(b.createdAt), 'yyyy-MM-dd HH:mm:ss'),
        'Event Date': format(new Date(b.date), 'yyyy-MM-dd'),
        'Event Time': b.time,
        'Customer Email': b.customer?.email,
        'Vendor Business': b.business?.businessName,
        'Package Name': b.package?.name || 'Custom',
        'Total Amount (LKR)': b.totalAmount,
        'Status': b.status,
        'Payment Status': b.paymentStatus
      }));

      downloadCSV(formattedData, `Platform_Bookings_Report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      toast.success('Bookings exported successfully');
    } catch (error) {
      toast.error('Failed to export bookings');
    } finally {
      setIsExportingBookings(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Advanced Reports</h2>
        <p className="text-muted-foreground mt-1">Export platform data for accounting and external analysis.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Financial Report */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-emerald-700" />
            </div>
            <CardTitle>Financial Ledger</CardTitle>
            <CardDescription>
              A complete history of all successful transactions and platform commission cuts.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="text-sm text-slate-500 mb-6 space-y-2 list-disc pl-5">
              <li>Includes Transaction IDs and Timestamps</li>
              <li>Calculates 10% platform commission</li>
              <li>Includes associated Vendor and Customer details</li>
            </ul>
            <Button 
              onClick={exportPayments} 
              disabled={isExportingPayments}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isExportingPayments ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download Financial CSV
            </Button>
          </CardContent>
        </Card>

        {/* Bookings Report */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-blue-700" />
            </div>
            <CardTitle>Global Bookings</CardTitle>
            <CardDescription>
              A raw data dump of every booking made across the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="text-sm text-slate-500 mb-6 space-y-2 list-disc pl-5">
              <li>Includes Event Dates and Times</li>
              <li>Includes PENDING, CONFIRMED, and CANCELLED states</li>
              <li>Useful for volume analysis and platform health</li>
            </ul>
            <Button 
              onClick={exportBookings} 
              disabled={isExportingBookings}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isExportingBookings ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="mr-2 h-4 w-4" />
              )}
              Download Bookings CSV
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
