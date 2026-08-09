'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { Bell, Calendar, FileText, Info, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface AppNotification {
  id: string;
  type: 'BOOKING' | 'DOCUMENT' | 'SYSTEM';
  title: string;
  message: string;
  date: Date;
  isUnread: boolean;
  link: string;
}

export default function VendorNotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDataToGenerateNotifications();
  }, []);

  const fetchDataToGenerateNotifications = async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, docsRes] = await Promise.all([
        api.get('/bookings/vendor').catch(() => ({ data: [] })),
        api.get('/vendor/documents').catch(() => ({ data: [] }))
      ]);

      const generated: AppNotification[] = [];

      // 1. Booking Notifications
      const bookings = bookingsRes.data || [];
      bookings.forEach((b: any) => {
        if (b.status === 'PENDING') {
          generated.push({
            id: `booking-${b.id}`,
            type: 'BOOKING',
            title: 'New Booking Request',
            message: `${b.customer.firstName} requested to book ${b.package?.name || 'a package'} on ${format(new Date(b.date), 'MMM do, yyyy')}. Action required.`,
            date: new Date(b.createdAt),
            isUnread: true,
            link: '/vendor/bookings'
          });
        }
      });

      // 2. Document Notifications
      const docs = docsRes.data || [];
      docs.forEach((d: any) => {
        if (d.status === 'REJECTED') {
          generated.push({
            id: `doc-${d.id}`,
            type: 'DOCUMENT',
            title: 'Document Rejected',
            message: `Your ${d.type.replace(/_/g, ' ')} was rejected by the admin team. Please re-upload.`,
            date: new Date(d.updatedAt),
            isUnread: true,
            link: '/vendor/documents'
          });
        }
      });

      // 3. System Welcome / Standard Alerts
      generated.push({
        id: 'sys-1',
        type: 'SYSTEM',
        title: 'Welcome to EventMarketplace',
        message: 'Your vendor dashboard is ready. Make sure to fully set up your business profile to start receiving bookings!',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        isUnread: false,
        link: '/vendor/business'
      });

      // Sort by date descending
      generated.sort((a, b) => b.date.getTime() - a.date.getTime());
      
      setNotifications(generated);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
    toast.success('All notifications marked as read');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'BOOKING': return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'DOCUMENT': return <FileText className="h-5 w-5 text-red-600" />;
      case 'SYSTEM': return <Info className="h-5 w-5 text-emerald-600" />;
      default: return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'BOOKING': return 'bg-blue-100';
      case 'DOCUMENT': return 'bg-red-100';
      case 'SYSTEM': return 'bg-emerald-100';
      default: return 'bg-slate-100';
    }
  };

  const unreadCount = notifications.filter(n => n.isUnread).length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center justify-center">
                {unreadCount} New
              </span>
            )}
          </h2>
          <p className="text-muted-foreground mt-1 text-slate-500">
            Stay updated on your bookings and account activity.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <CheckCircle2 className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
          <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">You're all caught up!</h3>
          <p className="text-slate-500 mt-1">Check back later for new alerts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Link key={notif.id} href={notif.link} className="block group">
              <div className={`p-4 rounded-xl border transition-all duration-200 flex gap-4 
                ${notif.isUnread ? 'bg-white border-blue-100 shadow-sm shadow-blue-100/50' : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:shadow-sm'}
              `}>
                
                <div className={`mt-1 h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${getIconBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-semibold ${notif.isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap ml-4">
                      {formatDistanceToNow(notif.date, { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${notif.isUnread ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                    {notif.message}
                  </p>
                </div>
                
                {notif.isUnread && (
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 bg-blue-600 rounded-full"></div>
                  </div>
                )}
                
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
