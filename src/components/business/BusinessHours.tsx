'use client';

import { BusinessHours as BusinessHoursType } from '@/types/business-profile';
import { Clock } from 'lucide-react';

interface BusinessHoursProps {
  hours: BusinessHoursType;
}

export function BusinessHours({ hours }: BusinessHoursProps) {
  if (!hours) return null;

  const schedule = [
    { day: 'Monday', time: hours.monday },
    { day: 'Tuesday', time: hours.tuesday },
    { day: 'Wednesday', time: hours.wednesday },
    { day: 'Thursday', time: hours.thursday },
    { day: 'Friday', time: hours.friday },
    { day: 'Saturday', time: hours.saturday },
    { day: 'Sunday', time: hours.sunday },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" /> Operating Hours
      </h3>
      
      <div className="space-y-3">
        {schedule.map(({ day, time }) => {
          const isClosed = time.toLowerCase().includes('closed');
          return (
            <div key={day} className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-500">{day}</span>
              <span className={`font-semibold ${isClosed ? 'text-red-500' : 'text-slate-900'}`}>
                {time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
