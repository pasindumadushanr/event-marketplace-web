'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RefreshCw, Ban, CheckCircle2, Lock, Unlock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VendorCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingDate, setIsUpdatingDate] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, businessRes] = await Promise.all([
        api.get('/bookings/vendor').catch(() => ({ data: [] })),
        api.get('/vendor/business').catch(() => ({ data: null })),
      ]);

      // Only show confirmed and completed bookings on the calendar
      const validBookings = (bookingsRes.data || []).filter(
        (b: any) => b.status === 'CONFIRMED' || b.status === 'COMPLETED'
      );
      setBookings(validBookings);

      if (businessRes.data?.profileSettings?.blockedDates) {
        setBlockedDates(businessRes.data.profileSettings.blockedDates);
      }
    } catch (error) {
      toast.error('Failed to load calendar data');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBlockDate = async (dateStr: string) => {
    setIsUpdatingDate(dateStr);
    const isCurrentlyBlocked = blockedDates.includes(dateStr);
    const nextBlockedDates = isCurrentlyBlocked
      ? blockedDates.filter((d) => d !== dateStr)
      : [...blockedDates, dateStr];

    try {
      await api.patch('/vendor/business', {
        profileSettings: {
          blockedDates: nextBlockedDates,
        },
      });
      setBlockedDates(nextBlockedDates);
      toast.success(
        isCurrentlyBlocked
          ? `Date unblocked: ${dateStr}`
          : `Date blacked out: ${dateStr}`
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update date availability');
    } finally {
      setIsUpdatingDate(null);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 rounded-t-xl">
        {days.map((day, i) => (
          <div key={i} className="py-3 text-center text-sm font-semibold text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const dateStr = format(day, 'yyyy-MM-dd');
        const isBlocked = blockedDates.includes(dateStr);
        const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
        
        // Find bookings for this day
        const dayBookings = bookings.filter(b => isSameDay(parseISO(b.date), cloneDay));

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[130px] p-2 border-r border-b border-slate-100 transition-colors group relative flex flex-col justify-between
              ${!isSameMonth(day, monthStart) ? 'bg-slate-50/50 text-slate-400' : isBlocked ? 'bg-rose-50/40 text-slate-900' : 'bg-white text-slate-900'}
              ${isSameDay(day, new Date()) ? 'ring-2 ring-blue-500/30' : ''}
            `}
          >
            <div>
              <div className="flex justify-between items-start">
                <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full
                  ${isSameDay(day, new Date()) ? 'bg-primary text-white font-bold' : isBlocked ? 'text-rose-600 font-bold' : ''}
                `}>
                  {formattedDate}
                </span>

                <div className="flex items-center gap-1">
                  {dayBookings.length > 0 && (
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-full">
                      {dayBookings.length} {dayBookings.length === 1 ? 'event' : 'events'}
                    </span>
                  )}
                </div>
              </div>

              {/* Blocked Badge */}
              {isBlocked && (
                <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-100/90 border border-rose-200 px-2 py-0.5 rounded-md">
                  <Ban className="w-3 h-3 text-rose-600" />
                  <span>Blacked Out</span>
                </div>
              )}
              
              {/* Bookings List */}
              <div className="mt-1.5 space-y-1">
                {dayBookings.map((b) => (
                  <div 
                    key={b.id} 
                    className={`text-xs px-2 py-1 rounded-md truncate font-medium border
                      ${b.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}
                    `}
                    title={`${b.package?.name || 'Booking'} - ${b.customer.firstName} ${b.customer.lastName}`}
                  >
                    {format(parseISO(b.date), 'h:mm a')} - {b.package?.name || 'Booking'}
                  </div>
                ))}
              </div>
            </div>

            {/* Blackout Toggle Action (Vendor Control) */}
            {isSameMonth(day, monthStart) && (
              <div className="mt-2 pt-1 border-t border-slate-100/70 flex justify-end">
                <button
                  type="button"
                  onClick={() => toggleBlockDate(dateStr)}
                  disabled={isUpdatingDate === dateStr}
                  className={`text-[11px] font-medium transition-opacity px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer
                    ${isBlocked 
                      ? 'text-rose-600 hover:bg-rose-100/60 opacity-90' 
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100'}
                  `}
                >
                  {isBlocked ? (
                    <>
                      <Unlock className="w-2.5 h-2.5" /> Unblock
                    </>
                  ) : (
                    <>
                      <Lock className="w-2.5 h-2.5" /> Block Date
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="border-l border-t border-slate-100">{rows}</div>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Calendar & Blackouts</h2>
          <p className="text-muted-foreground mt-1 text-slate-500">
            Manage your schedule, view confirmed bookings, and blackout unavailable dates.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <Button variant="outline" size="sm" onClick={today} className="cursor-pointer">Today</Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="w-32 text-center font-bold text-slate-900">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 cursor-pointer">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Legend & Stats Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300" />
            <span className="text-slate-600 font-medium">Confirmed Event ({bookings.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-rose-100 border border-rose-300" />
            <span className="text-slate-600 font-medium">Blackout / Blocked ({blockedDates.length})</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Hover over any calendar day and click <strong>Block Date</strong> to prevent new booking requests.</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
}

