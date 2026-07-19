'use client';

import Link from 'next/link';
import { 
  Building2, 
  ImageIcon, 
  Package, 
  MapPin, 
  CheckCircle2, 
  CircleDashed,
  ArrowRight,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBusinessProfile } from '@/contexts/BusinessProfileContext';

export default function VendorDashboardPage() {
  const { business, isLoading } = useBusinessProfile();

  if (isLoading || !business) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-slate-200 rounded-lg"></div>
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  // Dynamic completion logic based on business object
  const hasFeatures = business.profileSettings?.features?.length > 0 && business.profileSettings.features[0].groupName;
  const hasHours = business.profileSettings?.hours?.length === 7;
  const hasPolicies = business.profileSettings?.policies?.bookingPolicy;
  const hasSeo = business.profileSettings?.seo?.metaTitle;
  
  // Note: /vendor/business/booking is in the UI but backend doesn't have it yet, we just tie it to a default false.
  
  const completionTasks = [
    { 
      name: 'General Information', 
      isComplete: !!(business.name && business.description && business.logo && business.coverImage), 
      href: '/vendor/business/general' 
    },
    { 
      name: 'Contact Details', 
      isComplete: !!(business.phone && business.email), 
      href: '/vendor/business/contact' 
    },
    { 
      name: 'Location Details', 
      isComplete: !!(business.address && business.city), 
      href: '/vendor/business/location' 
    },
    { 
      name: 'Features & Amenities', 
      isComplete: !!hasFeatures, 
      href: '/vendor/business/features' 
    },
    { 
      name: 'Business Hours', 
      isComplete: !!hasHours, 
      href: '/vendor/business/hours' 
    },
    { 
      name: 'Policies & FAQ', 
      isComplete: !!hasPolicies, 
      href: '/vendor/business/policies' 
    },
    { 
      name: 'SEO Optimization', 
      isComplete: !!hasSeo, 
      href: '/vendor/business/seo' 
    },
  ];

  const completedCount = completionTasks.filter(t => t.isComplete).length;
  const progressPercentage = Math.round((completedCount / completionTasks.length) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold tracking-tight text-secondary">Welcome back, {business.name || 'Vendor'}!</h2>
        <p className="text-slate-500 mt-1 text-lg">Here is what is happening with your business today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Completion Widget */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className="text-xl font-serif font-bold text-secondary">Profile Setup</h3>
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
                <div className={`p-4 rounded-xl border transition-all flex items-center justify-between group h-full ${
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
          <div className="bg-secondary rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <h3 className="font-serif font-semibold text-primary mb-6">Profile Status</h3>
            {progressPercentage === 100 ? (
              <>
                <p className="text-2xl font-bold text-emerald-400 mb-2">Ready to Publish</p>
                <p className="text-sm text-slate-400 font-medium mb-6">Your profile is 100% complete.</p>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold border-0">
                  Publish Business
                </Button>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-slate-400 mb-2">Incomplete</p>
                <p className="text-sm text-amber-400 font-medium mb-6">Your profile is currently hidden from customers.</p>
                <Button disabled className="w-full bg-slate-800 text-slate-500 font-bold border-0">
                  Complete Setup to Publish
                </Button>
              </>
            )}
          </div>
          
          <Link href={`/business/${business.profileSettings?.seo?.slug || business.id}`}>
            <Button variant="outline" className="w-full h-14 rounded-2xl bg-white hover:bg-slate-50 text-secondary font-semibold shadow-sm border-slate-200 mt-4">
              <Eye className="w-4 h-4 mr-2" /> View Public Profile
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
