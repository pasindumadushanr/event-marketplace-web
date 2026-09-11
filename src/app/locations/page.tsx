import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { MapPin, Building2, Palmtree, Mountain, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Event Locations & Destinations | LuxeEvents',
  description: 'Explore premier event destinations across Sri Lanka. Find top wedding venues, photographers, and event vendors in Colombo, Kandy, Galle, Bentota, and more.',
};

export default function LocationsPage() {
  const destinations = [
    {
      city: 'Colombo',
      tagline: 'Urban Glamour & Five-Star Grand Ballrooms',
      description: 'The epicenter of luxury events in Sri Lanka. Renowned for international hotel ballrooms, rooftop skyline receptions, and high-capacity corporate convention spaces.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
      popular: ['Grand Ballrooms', 'Luxury Catering', 'High-End Bridal Studios'],
      icon: Building2,
    },
    {
      city: 'Galle',
      tagline: 'Colonial Heritage & Coastal Elegance',
      description: 'Ideal for romantic seaside nuptials, historic Dutch fort boutique hotels, and breezy outdoor garden celebrations steeped in centuries of charm.',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
      popular: ['Fort Boutiques', 'Sunset Beach Weddings', 'Acoustic Bands'],
      icon: Palmtree,
    },
    {
      city: 'Kandy',
      tagline: 'Royal Traditions & Lush Hilltop Views',
      description: 'Surrounded by misty mountain ranges and cultural heritage, Kandy offers majestic Kandyan wedding traditions, botanical garden shoots, and scenic hilltop resorts.',
      image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=1200&auto=format&fit=crop',
      popular: ['Traditional Poruwa Ceremonies', 'Scenic Mountain Resorts', 'Cultural Dancers'],
      icon: Mountain,
    },
    {
      city: 'Bentota',
      tagline: 'Golden Sands & Waterfront Receptions',
      description: 'Sri Lanka’s premier beach resort destination. Perfect for barefoot beach ceremonies, riverfront luxury lawns, and tropical open-air galas.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      popular: ['Beachfront Marquees', 'Destination Weddings', 'DJ & Pyrotechnics'],
      icon: Palmtree,
    },
    {
      city: 'Nuwara Eliya',
      tagline: 'Vintage Tea Country & Cool Climate Receptions',
      description: 'Known as "Little England", Nuwara Eliya offers colonial manor houses, manicured rose gardens, and crisp highland weather for cozy luxury weddings.',
      image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1200&auto=format&fit=crop',
      popular: ['Heritage Bungalows', 'Fireside Receptions', 'Highland Photography'],
      icon: Mountain,
    },
    {
      city: 'Negombo',
      tagline: 'Lagoon Luxury & Airport Proximity',
      description: 'The preferred choice for international destination weddings. Close to Bandaranaike International Airport, featuring expansive lagoon-side luxury resorts.',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
      popular: ['Lagoonfront Lawns', 'Destination Wedding Planners', 'Grand Buffets'],
      icon: Building2,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Destination Guide
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-4 mb-4">
            Curated Event Destinations
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            From golden oceanfront shores to mist-shrouded mountain sanctuaries, discover top-rated event vendors and extraordinary venues in Sri Lanka&apos;s most celebrated locations.
          </p>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {destinations.map((dest, i) => {
            const Icon = dest.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1 mb-1">
                        <MapPin className="h-3.5 w-3.5" /> Destination
                      </span>
                      <h2 className="text-2xl font-black text-white">{dest.city}</h2>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">{dest.tagline}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{dest.description}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {dest.popular.map((item, idx) => (
                        <span key={idx} className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                          {item}
                        </span>
                      ))}
                    </div>

                    <Link href={`/search?city=${encodeURIComponent(dest.city)}`} className="block">
                      <Button className="w-full h-11 bg-slate-900 hover:bg-primary text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5">
                        Browse {dest.city} Vendors <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout */}
        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 sm:p-10 text-center max-w-3xl mx-auto space-y-4">
          <Sparkles className="h-8 w-8 text-primary mx-auto" />
          <h3 className="text-2xl font-bold text-slate-900">Are You an Event Professional in These Cities?</h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Showcase your services to discerning clients searching for high-end talent across Sri Lanka. Join our vetted community today.
          </p>
          <div className="pt-2">
            <Link href="/sell">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20">
                Become a Vendor
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
