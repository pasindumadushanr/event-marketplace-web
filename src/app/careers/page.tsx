import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { Briefcase, Heart, Sparkles, Globe, Laptop, Coffee, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Careers | Join the LuxeEvents Team',
  description: 'Help us redefine the future of luxury event planning and vendor discovery. Explore career opportunities, company values, and open roles at LuxeEvents.',
};

export default function CareersPage() {
  const perks = [
    {
      icon: Laptop,
      title: 'Flexible & Hybrid',
      description: 'Work from our modern collaborative spaces or remote with flexible schedules that respect your life.',
    },
    {
      icon: Sparkles,
      title: 'Luxury Brand Impact',
      description: 'Shape the technology and design that powers once-in-a-lifetime celebrations and luxury galas.',
    },
    {
      icon: Globe,
      title: 'Global Growth',
      description: 'Expand with us as we build regional and international destination wedding marketplaces.',
    },
    {
      icon: Coffee,
      title: 'Health & Wellness',
      description: 'Comprehensive health coverage, learning stipends, and generous paid time off.',
    },
  ];

  const jobs = [
    {
      title: 'Senior Full-Stack Engineer',
      department: 'Engineering',
      location: 'Colombo / Remote',
      type: 'Full-time',
      description: 'Lead architecture on our Next.js 15 frontend, NestJS backend, real-time WebSockets, and escrow payment systems.',
    },
    {
      title: 'Vendor Partnerships & Onboarding Lead',
      department: 'Operations',
      location: 'Colombo (Hybrid)',
      type: 'Full-time',
      description: 'Curate, vet, and onboard premier photographers, venues, and luxury decor specialists to maintain five-star network standards.',
    },
    {
      title: 'Event Success Specialist',
      department: 'Customer Experience',
      location: 'Remote',
      type: 'Full-time',
      description: 'Guide couples and corporate clients from booking inquiries through to seamless advance payment deposit confirmations.',
    },
    {
      title: 'Growth & Social Media Strategist',
      department: 'Marketing',
      location: 'Colombo (Hybrid)',
      type: 'Full-time',
      description: 'Craft viral editorial campaigns, vendor spotlights, and luxury wedding trend reports across Instagram, YouTube, and TikTok.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            We Are Hiring
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-4 mb-4">
            Build the Future of Celebrations
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            At LuxeEvents, we are reimagining how weddings, corporate galas, and landmark celebrations are discovered, planned, and secured. Join an ambitious, design-led team building a world-class platform.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-base font-bold text-slate-900">{perk.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{perk.description}</p>
              </div>
            );
          })}
        </div>

        {/* Open Roles Section */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Open Positions</h2>
              <p className="text-slate-500 text-sm mt-1">Explore our current opportunities across engineering, product, and operations.</p>
            </div>
          </div>

          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      {job.department}
                    </span>
                    <span className="text-xs text-slate-400">• {job.location} • {job.type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{job.description}</p>
                </div>

                <a
                  href={`mailto:careers@luxeevents.fun?subject=${encodeURIComponent(`Application for ${job.title}`)}`}
                  className="shrink-0"
                >
                  <Button className="w-full sm:w-auto h-11 bg-slate-900 hover:bg-primary text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5">
                    Apply Now <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Spontaneous Application */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4 shadow-xl">
          <Briefcase className="h-10 w-10 text-primary mx-auto" />
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Don&apos;t See Your Dream Role?</h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            We are always eager to connect with extraordinary engineers, designers, and luxury event specialists. Send your portfolio or CV our way.
          </p>
          <div className="pt-2">
            <a href="mailto:careers@luxeevents.fun?subject=Spontaneous%20Application%20-%20LuxeEvents">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 mx-auto">
                <Mail className="h-4 w-4" /> Email Us at careers@luxeevents.fun
              </Button>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
