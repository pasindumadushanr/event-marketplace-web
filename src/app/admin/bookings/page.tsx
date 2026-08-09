'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { RefreshCw, Search, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/admin');
      setBookings(res.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/bookings/admin/${id}/status`, { status });
      toast.success(`Booking marked as ${status}`);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.business?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? b.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'CONFIRMED': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmed</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Completed</Badge>;
      case 'CANCELLED': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Global Bookings</h2>
          <p className="text-muted-foreground mt-1">Manage and oversee all platform bookings.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by ID, Customer Email, or Business..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter ? `Status: ${statusFilter}` : 'Filter by Status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter Bookings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Bookings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('PENDING')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('CONFIRMED')}>Confirmed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('COMPLETED')}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('CANCELLED')}>Cancelled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon" onClick={fetchBookings} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            No bookings found matching your criteria.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Booking ID</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vendor Business</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium text-xs text-slate-500">
                    {booking.id.split('-')[0].toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{format(new Date(booking.date), 'MMM do, yyyy')}</div>
                    <div className="text-xs text-slate-500">{booking.time}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.customer?.firstName} {booking.customer?.lastName}</div>
                    <div className="text-xs text-slate-500">{booking.customer?.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.business?.businessName}</div>
                    <div className="text-xs text-slate-500">{booking.package?.name || 'Custom Package'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">LKR {Number(booking.totalAmount).toLocaleString()}</div>
                    <div className="text-xs text-slate-500">
                      Commission: LKR {(Number(booking.totalAmount) * 0.1).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          disabled={booking.status === 'CONFIRMED'}
                          onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                        >
                          Force Confirm
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          disabled={booking.status === 'COMPLETED'}
                          onClick={() => updateStatus(booking.id, 'COMPLETED')}
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          disabled={booking.status === 'CANCELLED'}
                          onClick={() => {
                            if(confirm('Are you sure you want to cancel this booking? This action is irreversible.')) {
                              updateStatus(booking.id, 'CANCELLED');
                            }
                          }}
                        >
                          Force Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
