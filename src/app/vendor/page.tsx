import Link from 'next/link';
import { 
  Building2, 
  ImageIcon, 
  Package, 
  MapPin, 
  CheckCircle2, 
  CircleDashed,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VendorDashboardPage() {
  // Mock completion data
  const completionTasks = [
    { name: 'General Information', isComplete: true, href: '/vendor/business/general' },
    { name: 'Contact Details', isComplete: true, href: '/vendor/business/contact' },
    { name: 'Location Details', isComplete: false, href: '/vendor/business/location' },
    { name: 'Features & Amenities', isComplete: false, href: '/vendor/business/features' },
    { name: 'Business Hours', isComplete: false, href: '/vendor/business/hours' },
    { name: 'Booking Settings', isComplete: true, href: '/vendor/business/booking' },
    { name: 'Policies & FAQ', isComplete: false, href: '/vendor/business/policies' },
    { name: 'SEO Optimization', isComplete: false, href: '/vendor/business/seo' },
  ];

  const completedCount = completionTasks.filter(t => t.isComplete).length;
  const progressPercentage = Math.round((completedCount / completionTasks.length) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back!</h2>
        <p className="text-slate-500 mt-1">Here is what is happening with your business today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Completion Widget */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Profile Setup</h3>
              <p className="text-sm text-slate-500 mt-1">Complete your profile to go live on the marketplace.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-extrabold text-primary">{progressPercentage}%</p>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Completed</p>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-primary"
                    strokeDasharray={`${progressPercentage}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completionTasks.map((task, idx) => (
              <Link key={idx} href={task.href}>
                <div className={`p-4 rounded-xl border transition-all flex items-center justify-between group ${
                  task.isComplete 
                    ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50' 
                    : 'border-slate-200 bg-white hover:border-primary/50 hover:shadow-sm'
                }`}>
                  <div className="flex items-center gap-3">
                    {task.isComplete ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    ) : (
                      <CircleDashed className="h-5 w-5 text-slate-300 shrink-0 group-hover:text-primary transition-colors" />
                    )}
                    <span className={`font-medium ${task.isComplete ? 'text-emerald-900' : 'text-slate-700'}`}>
                      {task.name}
                    </span>
                  </div>
                  {!task.isComplete && (
                    <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats Placeholder */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="font-semibold text-slate-300 mb-6">Profile Views</h3>
            <p className="text-5xl font-bold mb-2">0</p>
            <p className="text-sm text-emerald-400 font-medium">Your profile is currently hidden.</p>
            <Button className="w-full mt-6 bg-white text-slate-900 hover:bg-slate-100 font-bold">
              Complete Setup to Publish
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
