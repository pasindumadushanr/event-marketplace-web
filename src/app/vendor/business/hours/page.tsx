'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function BusinessHoursPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Saved Business Hours');
    }, 1000);
  };

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
          {days.map((day) => (
            <div key={day} className="grid grid-cols-12 gap-4 p-4 items-center bg-white hover:bg-slate-50 transition-colors">
              <div className="col-span-3 font-medium text-slate-900">{day}</div>
              <div className="col-span-3">
                <Input type="time" defaultValue="09:00" className="h-10" />
              </div>
              <div className="col-span-3">
                <Input type="time" defaultValue="18:00" className="h-10" />
              </div>
              <div className="col-span-3 flex justify-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={day !== 'Sunday'} />
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
