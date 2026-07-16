'use client';

import { CalendarDays } from 'lucide-react';

export function BusinessAvailability() {
  // Mock calendar structure for visualization
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  
  // Mock booked dates
  const bookedDates = [5, 12, 19, 20, 26];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" /> Availability
      </h3>
      
      <div className="mb-4 text-center">
        <span className="font-semibold text-slate-700">October 2024</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {days.map(day => (
          <div key={day} className="text-xs font-bold text-slate-400 py-1">{day}</div>
        ))}
        
        {/* Empty slots for start of month offset */}
        <div /><div /><div />
        
        {dates.map(date => (
          <div 
            key={date}
            className={`
              h-8 w-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium
              ${bookedDates.includes(date) 
                ? 'bg-red-50 text-red-500 line-through cursor-not-allowed' 
                : 'bg-white hover:bg-slate-100 text-slate-700 cursor-pointer'}
            `}
          >
            {date}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs font-medium px-4">
        <div className="flex items-center gap-1 text-slate-600">
          <div className="h-3 w-3 rounded-full bg-slate-100 border border-slate-200" /> Available
        </div>
        <div className="flex items-center gap-1 text-red-500">
          <div className="h-3 w-3 rounded-full bg-red-100" /> Booked
        </div>
      </div>
    </div>
  );
}
