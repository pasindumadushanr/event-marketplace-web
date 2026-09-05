'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  role: {
    name: string;
  };
  createdAt: string;
  vendorSubscriptions?: { status: string }[];
}

interface UserTableProps {
  roles?: string[]; // E.g., ['CUSTOMER'] or ['ADMIN', 'SUPER_ADMIN']
}

export function UserTable({ roles }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const query = roles && roles.length > 0 ? `?roles=${roles.join(',')}` : '';
      const [usersRes, plansRes] = await Promise.all([
        api.get(`/users${query}`),
        roles?.includes('VENDOR') ? api.get('/subscriptions/plans') : Promise.resolve({ data: [] })
      ]);
      setUsers(usersRes.data);
      if (plansRes.data) setPlans(plansRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roles]);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      toast.success(`User status updated to ${newStatus}`);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleGrantSubscription = async (userId: string, planId: string) => {
    try {
      await api.post(`/subscriptions/vendors/${userId}/grant-free`, { planId });
      toast.success('Granted free subscription to vendor!');
      fetchData();
    } catch (error: any) {
      toast.error(`Failed to grant subscription: ${error?.response?.data?.message || error.message}`);
    }
  };

  const isVendorTable = roles?.includes('VENDOR');

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            {isVendorTable && <TableHead>Subscription</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={isVendorTable ? 7 : 6} className="h-24 text-center">
                Loading users...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isVendorTable ? 7 : 6} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const latestSub = user.vendorSubscriptions?.[0];
              const isSubActive = latestSub?.status === 'ACTIVE';
              
              return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-zinc-100 text-zinc-800">
                    {user.role?.name || 'UNKNOWN'}
                  </Badge>
                </TableCell>
                {isVendorTable && (
                  <TableCell>
                    {latestSub ? (
                       <Badge variant={isSubActive ? 'default' : 'secondary'} className={isSubActive ? 'bg-primary' : ''}>
                         {latestSub.status}
                       </Badge>
                    ) : (
                      <Badge variant="secondary">NONE</Badge>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <Badge 
                    variant={user.status === 'ACTIVE' ? 'default' : 'destructive'}
                    className={user.status === 'ACTIVE' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {new Intl.DateTimeFormat('en-US', {
                    timeZone: 'Asia/Colombo',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }).format(new Date(user.createdAt))}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-zinc-100 transition-colors">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="px-2 py-1.5 text-sm font-semibold">Actions</div>
                      {isVendorTable && (
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Grant Free Sub</DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {plans.length === 0 ? (
                                <DropdownMenuItem disabled>No plans available</DropdownMenuItem>
                              ) : (
                                plans.map(plan => (
                                  <DropdownMenuItem 
                                    key={plan.id}
                                    onClick={() => handleGrantSubscription(user.id, plan.id)}
                                  >
                                    {plan.name} ({plan.durationDays} days)
                                  </DropdownMenuItem>
                                ))
                              )}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      )}
                      {user.status === 'ACTIVE' ? (
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(user.id, 'SUSPENDED')}
                          className="text-red-600 focus:text-red-600"
                        >
                          Suspend User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                          className="text-green-600 focus:text-green-600"
                        >
                          Activate User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})
          )}
        </TableBody>
      </Table>
    </div>
  );
}
