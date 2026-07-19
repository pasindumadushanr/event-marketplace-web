'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { useBusinessProfile } from '@/contexts/BusinessProfileContext';
import { toast } from 'sonner';
import api from '@/lib/api';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type DaySchedule = {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export default function BusinessHoursPage() {
  const { business, updateBusinessLocally } = useBusinessProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);

  useEffect(() => {
    if (business) {
      if (business.profileSettings?.hours && Array.isArray(business.profileSettings.hours) && business.profileSettings.hours.length === 7) {
        setSchedule(business.profileSettings.hours);
      } else {
        // Default schedule
        setSchedule(days.map(day => ({
          day,
          openTime: '09:00',
          closeTime: '18:00',
          isClosed: day === 'Sunday'
        })));
      }
    }
  }, [business]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        profileSettings: {
          hours: schedule
        }
      };
      await api.patch('/vendor/business', payload);
      updateBusinessLocally(payload);
      toast.success('Business hours saved!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save hours');
    } finally {
      setIsLoading(false);
    }
  };

  const updateDay = (index: number, updates: Partial<DaySchedule>) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], ...updates };
    setSchedule(newSchedule);
  };

  if (!business || schedule.length === 0) return null;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Business Hours</h2>
        <p className="text-slate-500 mt-1">Set your weekly operating schedule.</p>
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-slate-700 border-b border-slate-200 bg-slate-100/50 text-sm">
          <div className="col-span-3">Day</div>
          <div className="col-span-3">Opening Time</div>
          <div className="col-span-3">Closing Time</div>
          <div className="col-span-3 text-center">Status</div>
        </div>

        <div className="divide-y divide-slate-100">
          {schedule.map((dayData, idx) => (
            <div key={dayData.day} className="grid grid-cols-12 gap-4 p-4 items-center bg-white hover:bg-slate-50 transition-colors">
              <div className="col-span-3 font-medium text-slate-900">{dayData.day}</div>
              <div className="col-span-3">
                <Input 
                  type="time" 
                  value={dayData.openTime} 
                  onChange={(e) => updateDay(idx, { openTime: e.target.value })}
                  disabled={dayData.isClosed}
                  className="h-10" 
                />
              </div>
              <div className="col-span-3">
                <Input 
                  type="time" 
                  value={dayData.closeTime} 
                  onChange={(e) => updateDay(idx, { closeTime: e.target.value })}
                  disabled={dayData.isClosed}
                  className="h-10" 
                />
              </div>
              <div className="col-span-3 flex justify-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={!dayData.isClosed} 
                    onChange={(e) => updateDay(idx, { isClosed: !e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white min-w-[150px]">
          {isLoading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
        </Button>
      </div>
    </form>
  );
}
