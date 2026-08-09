'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { RefreshCw, Search, DollarSign, Download, ArrowUpRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments/admin');
      setPayments(res.data);
    } catch (error) {
      console.error('Failed to load payments', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    return (
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.business?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPlatformRevenue = payments.reduce((sum, p) => sum + (Number(p.totalAmount) * 0.1), 0);
  const totalVolume = payments.reduce((sum, p) => sum + Number(p.totalAmount), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Payments Ledger</h2>
          <p className="text-muted-foreground mt-1">Track all platform transactions and commission revenue.</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Gross Processing Volume</p>
              <h3 className="text-2xl font-bold text-slate-900">LKR {totalVolume.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <ArrowUpRight className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Net Platform Revenue (10%)</p>
              <h3 className="text-2xl font-bold text-slate-900">LKR {totalPlatformRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center">
          <p className="text-sm font-medium text-slate-500 mb-2">Total Successful Transactions</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{payments.length}</h3>
            <span className="text-emerald-500 text-sm font-medium mb-1">+12% this week</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by ID, Customer, or Vendor..." 
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" onClick={fetchPayments} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            No payments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead className="bg-emerald-50 text-emerald-900 font-semibold">Platform Cut</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const amount = Number(payment.totalAmount);
                  const cut = amount * 0.1;
                  
                  return (
                    <TableRow key={payment.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-xs text-slate-500 font-mono">
                        {payment.id.split('-')[0].toUpperCase()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(payment.updatedAt), 'MMM do, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{payment.customer?.firstName} {payment.customer?.lastName}</div>
                        <div className="text-xs text-slate-500">{payment.customer?.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm text-blue-600">{payment.business?.name}</div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        LKR {amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold text-emerald-600 bg-emerald-50/30">
                        + LKR {cut.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {payment.paymentStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
