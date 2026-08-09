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
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VendorCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/bookings/vendor');
      // Only show confirmed and completed bookings on the calendar
      const validBookings = res.data.filter((b: any) => b.status === 'CONFIRMED' || b.status === 'COMPLETED');
      setBookings(validBookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
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
        
        // Find bookings for this day
        const dayBookings = bookings.filter(b => isSameDay(parseISO(b.date), cloneDay));

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[120px] p-2 border-r border-b border-slate-100 transition-colors
              ${!isSameMonth(day, monthStart) ? 'bg-slate-50/50 text-slate-400' : 'bg-white text-slate-900'}
              ${isSameDay(day, new Date()) ? 'bg-blue-50/30' : 'hover:bg-slate-50'}
            `}
          >
            <div className="flex justify-between items-start">
              <span className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full
                ${isSameDay(day, new Date()) ? 'bg-primary text-white' : ''}
              `}>
                {formattedDate}
              </span>
              {dayBookings.length > 0 && (
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {dayBookings.length}
                </span>
              )}
            </div>
            
            <div className="mt-2 space-y-1">
              {dayBookings.map((b) => (
                <div 
                  key={b.id} 
                  className={`text-xs px-2 py-1.5 rounded-md truncate font-medium border
                    ${b.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}
                  `}
                  title={`${b.package?.name || 'Booking'} - ${b.customer.firstName}`}
                >
                  {format(parseISO(b.date), 'h:mm a')} - {b.package?.name || 'Booking'}
                </div>
              ))}
            </div>
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
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Calendar</h2>
          <p className="text-muted-foreground mt-1 text-slate-500">
            View your confirmed and completed bookings by date.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <Button variant="outline" size="sm" onClick={today}>Today</Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="w-32 text-center font-bold text-slate-900">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
}
