'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Search, 
  Building2, 
  Palmtree, 
  Mountain, 
  Compass, 
  ArrowUpRight,
  SearchX,
  ArrowRight, 
  Truck, 
} from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { DistrictMapItem } from '@/components/locations/SriLankaMap';

// Dynamically import Leaflet Map to avoid SSR window errors
const SriLankaMap = dynamic(() => import('@/components/locations/SriLankaMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-900 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-3 border border-slate-800">
      <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      <p className="text-xs font-semibold tracking-wide uppercase text-slate-400">Loading Sri Lanka Geographic Map...</p>
    </div>
  ),
});

interface DistrictInfo extends DistrictMapItem {
  description: string;
  popularCategories: string[];
  image: string;
}

const PROVINCES = [
  'All Provinces',
  'Western',
  'Central',
  'Southern',
  'Northern',
  'Eastern',
  'North Western',
  'North Central',
  'Uva',
  'Sabaragamuwa'
] as const;

const SRI_LANKA_DISTRICTS: DistrictInfo[] = [
  // --- Western Province ---
  {
    id: 'colombo',
    name: 'Colombo',
    province: 'Western',
    tagline: '5-Star Ballrooms & Elite Creative Studios',
    description: 'The epicenter of luxury events in Sri Lanka. Renowned for oceanfront international hotels, rooftop skyline banquets, high-capacity convention halls, and premier fashion bridal stylists.',
    keyTowns: ['Colombo 01-15', 'Dehiwala', 'Mount Lavinia', 'Battaramulla', 'Kotte'],
    popularCategories: ['Luxury Ballrooms', 'Cinematic Drone Videography', 'Celebrity Bridal Artists', 'Gourmet Catering'],
    vendorCountEstimate: '450+ Vendors',
    lat: 6.9271,
    lng: 79.8612,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'gampaha',
    name: 'Gampaha',
    province: 'Western',
    tagline: 'Negombo Coastal Resorts & Garden Marquees',
    description: 'Sri Lanka’s gateway district boasting expansive lagoon resorts, beach wedding destinations in Negombo, and serene botanical marquee lawns just minutes from Bandaranaike Airport.',
    keyTowns: ['Negombo', 'Wattala', 'Kelaniya', 'Ja-Ela', 'Gampaha Town'],
    popularCategories: ['Lagoonfront Resorts', 'Outdoor Marquee Setups', 'Live Acoustic Bands', 'Floral Installations'],
    vendorCountEstimate: '220+ Vendors',
    lat: 7.0840,
    lng: 79.9943,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'kalutara',
    name: 'Kalutara',
    province: 'Western',
    tagline: 'Golden Beachfronts & Riverfront Estates',
    description: 'Famed for its palm-fringed coastal hotel strip along Wadduwa and Beruwala, pristine river cruise banquets on the Kalu Ganga, and bespoke open-air wedding lawns.',
    keyTowns: ['Wadduwa', 'Kalutara', 'Beruwala', 'Panadura', 'Bentota North'],
    popularCategories: ['Beach Wedding Venues', 'Poruwa Artisans', 'Pyrotechnics & Fireworks', 'Seafood Buffets'],
    vendorCountEstimate: '140+ Vendors',
    lat: 6.5854,
    lng: 79.9607,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
  },

  // --- Central Province ---
  {
    id: 'kandy',
    name: 'Kandy',
    province: 'Central',
    tagline: 'Royal Traditions & Hilltop Mountain Vistas',
    description: 'Surrounded by misty peaks and royal heritage, Kandy is the premier hub for authentic Kandyan poruwa ceremonies, traditional Wes dancers, and scenic highland resort receptions.',
    keyTowns: ['Kandy City', 'Peradeniya', 'Katugastota', 'Kundasale', 'Digana'],
    popularCategories: ['Traditional Poruwa Sets', 'Kandyan Costume & Makeup', 'Scenic Mountain Resorts', 'Cultural Drummers'],
    vendorCountEstimate: '190+ Vendors',
    lat: 7.2906,
    lng: 80.6337,
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'matale',
    name: 'Matale',
    province: 'Central',
    tagline: 'Sigiriya Rock Backdrops & Spice Garden Celebrations',
    description: 'From dramatic celebrations facing the Sigiriya Rock fortress to tranquil spice estate retreats in Dambulla, Matale offers unforgettable heritage outdoor wedding environments.',
    keyTowns: ['Dambulla', 'Sigiriya', 'Matale Town', 'Ukuwela', 'Rattota'],
    popularCategories: ['Heritage Destination Venues', 'Eco-Luxury Banquets', 'Destination Photographers'],
    vendorCountEstimate: '85+ Vendors',
    lat: 7.4675,
    lng: 80.6234,
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    province: 'Central',
    tagline: 'Colonial Manors & Tea Highland Romance',
    description: 'Known as "Little England", this cool climate hill-country paradise offers Tudor-style colonial bungalows, manicured rose gardens, and cozy fireside luxury receptions.',
    keyTowns: ['Nuwara Eliya Town', 'Hatton', 'Nanu Oya', 'Maskeliya', 'Talawakele'],
    popularCategories: ['Colonial Manor Halls', 'Highland Pre-Wedding Shoots', 'Winter Wonderland Decor'],
    vendorCountEstimate: '110+ Vendors',
    lat: 6.9497,
    lng: 80.7891,
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=800&auto=format&fit=crop',
  },

  // --- Southern Province ---
  {
    id: 'galle',
    name: 'Galle',
    province: 'Southern',
    tagline: 'Colonial Dutch Fort & Barefoot Beach Luxury',
    description: 'The crowning jewel of Sri Lanka destination weddings. Celebrate within 17th-century cobblestone ramparts or host breezy sunset barefoot ceremonies on Thalpe and Unawatuna beaches.',
    keyTowns: ['Galle Fort', 'Unawatuna', 'Hikkaduwa', 'Thalpe', 'Bentota South'],
    popularCategories: ['Boutique Fort Villas', 'Sunset Beach Weddings', 'Live Jazz & Saxophonists', 'Fine Dining Catering'],
    vendorCountEstimate: '210+ Vendors',
    lat: 6.0535,
    lng: 80.2210,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'matara',
    name: 'Matara',
    province: 'Southern',
    tagline: 'Mirissa Coastal Cliffs & Tropical Garden Galas',
    description: 'Home to the iconic surf breaks and cliffside luxury villas of Mirissa and Weligama. Unrivaled panoramic Indian Ocean vistas for sunset receptions and oceanfront marquee parties.',
    keyTowns: ['Matara City', 'Mirissa', 'Weligama', 'Dickwella', 'Akuressa'],
    popularCategories: ['Cliffside Villas', 'Coastal Wedding DJs', 'Tropical Floral Arches', 'Cocktail Mixologists'],
    vendorCountEstimate: '130+ Vendors',
    lat: 5.9549,
    lng: 80.5550,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'hambantota',
    name: 'Hambantota',
    province: 'Southern',
    tagline: 'Wilderness Luxury & Untouched Golden Coasts',
    description: 'Offering sprawling 5-star golf resorts along Tangalle, pristine wild coastline, and exclusive luxury safari wedding experiences bordering Yala National Park.',
    keyTowns: ['Tangalle', 'Hambantota Town', 'Tissamaharama', 'Ambalantota', 'Beliatta'],
    popularCategories: ['Golf Resort Ballrooms', 'Wilderness Receptions', 'Luxury Tented Celebrations'],
    vendorCountEstimate: '75+ Vendors',
    lat: 6.1429,
    lng: 81.1212,
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800&auto=format&fit=crop',
  },

  // --- Northern Province ---
  {
    id: 'jaffna',
    name: 'Jaffna',
    province: 'Northern',
    tagline: 'Ancient Temples & Grand Hindu Wedding Traditions',
    description: 'Steeped in vibrant Tamil culture and heritage. Famous for magnificent mandapam decors, authentic Nadaswaram and Thavil classical musical ensembles, and grand vegetarian banquets.',
    keyTowns: ['Jaffna City', 'Nallur', 'Chavakachcheri', 'Point Pedro', 'Chunnakam'],
    popularCategories: ['Traditional Mandapam Decor', 'Carnatic Music Ensembles', 'Authentic South Asian Catering'],
    vendorCountEstimate: '150+ Vendors',
    lat: 9.6615,
    lng: 80.0255,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'kilinochchi',
    name: 'Kilinochchi',
    province: 'Northern',
    tagline: 'Northern Cultural Hub & Expansive Halls',
    description: 'Central northern plains offering wide-open cultural centers, spacious indoor event facilities, and warm community hospitality for large family gatherings.',
    keyTowns: ['Kilinochchi Town', 'Paranthan', 'Poonakary'],
    popularCategories: ['Community Banquet Halls', 'Stage Lighting & Truss', 'Regional Decorators'],
    vendorCountEstimate: '45+ Vendors',
    lat: 9.3803,
    lng: 80.3770,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'mannar',
    name: 'Mannar',
    province: 'Northern',
    tagline: 'Historical Baobab Shores & Coastal Breezes',
    description: 'A charming historic island peninsula featuring ancient churches, calm turquoise lagoons, and intimate waterfront gathering spots off the beaten path.',
    keyTowns: ['Mannar Island', 'Talaimannar', 'Madhu', 'Murunkan'],
    popularCategories: ['Historic Church Weddings', 'Waterfront Intimate Ceremonies', 'Island Photographers'],
    vendorCountEstimate: '40+ Vendors',
    lat: 8.9810,
    lng: 79.9044,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'vavuniya',
    name: 'Vavuniya',
    province: 'Northern',
    tagline: 'Crossroad City & Multi-Cultural Celebrations',
    description: 'The historic link between Northern and Central Sri Lanka, offering modern convention complexes, vibrant multicultural catering, and versatile party venues.',
    keyTowns: ['Vavuniya City', 'Cheddikulam', 'Nedunkeni'],
    popularCategories: ['Modern Convention Centers', 'Fusion Catering Services', 'Sound & Stage Setup'],
    vendorCountEstimate: '60+ Vendors',
    lat: 8.7542,
    lng: 80.4982,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'mullaitivu',
    name: 'Mullaitivu',
    province: 'Northern',
    tagline: 'Serene Coastlines & Untouched Shoreline Events',
    description: 'Pristine eastern-facing beaches ideal for serene outdoor dawn receptions, tropical oceanfront marquees, and peaceful destination celebrations.',
    keyTowns: ['Mullaitivu Town', 'Puthukkudiyiruppu', 'Oddusuddan'],
    popularCategories: ['Beachfront Marquees', 'Outdoor Event Staging', 'Regional Catering'],
    vendorCountEstimate: '35+ Vendors',
    lat: 9.2671,
    lng: 80.8142,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
  },

  // --- Eastern Province ---
  {
    id: 'batticaloa',
    name: 'Batticaloa',
    province: 'Eastern',
    tagline: 'Singing Fish Lagoons & Peaceful Estuary Galas',
    description: 'Renowned for picturesque calm lagoons, historic lighthouse grounds, and scenic beachfront boutique hotels along the celebrated Pasikuda bay.',
    keyTowns: ['Batticaloa City', 'Passikudah', 'Kallady', 'Valachchenai', 'Kattankudy'],
    popularCategories: ['Lagoonfront Receptions', 'Pasikudah Beach Resorts', 'Traditional Eastern Musicians'],
    vendorCountEstimate: '95+ Vendors',
    lat: 7.7310,
    lng: 81.6747,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'ampara',
    name: 'Ampara',
    province: 'Eastern',
    tagline: 'Arugam Bay Surf Chic & Coastal Marquee Galas',
    description: 'The world-famous Arugam Bay coast offers boho-chic destination weddings, sunset beach parties, open-air music festivals, and rustic eco-resort weddings.',
    keyTowns: ['Arugam Bay', 'Ampara Town', 'Kalmunai', 'Pottuvil', 'Sammanthurai'],
    popularCategories: ['Boho Beach Weddings', 'Live DJ Stages', 'Rustic Open-Air Styling'],
    vendorCountEstimate: '80+ Vendors',
    lat: 7.2912,
    lng: 81.6724,
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'trincomalee',
    name: 'Trincomalee',
    province: 'Eastern',
    tagline: 'Nilaveli White Sand Shores & Deep Harbor Views',
    description: 'Boasting the clearest waters and whitest sands in Sri Lanka. Nilaveli and Uppuveli provide dreamy beachfront luxury resorts and intimate island wedding escapes.',
    keyTowns: ['Trincomalee Town', 'Nilaveli', 'Uppuveli', 'Kinniya', 'Kantale'],
    popularCategories: ['White Sand Beach Receptions', 'Snorkeling & Sunset Cruise Parties', 'Tropical Resort Catering'],
    vendorCountEstimate: '90+ Vendors',
    lat: 8.5874,
    lng: 81.2152,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
  },

  // --- North Western Province ---
  {
    id: 'kurunegala',
    name: 'Kurunegala',
    province: 'North Western',
    tagline: 'Rock Fortress Grand Banquets & Coconut Groves',
    description: 'A bustling commercial event hub framed by towering rock monoliths. Known for expansive banquet halls, coconut estate wedding gardens, and high-energy music bands.',
    keyTowns: ['Kurunegala City', 'Kuliyapitiya', 'Wariyapola', 'Narammala', 'Ibbagamuwa'],
    popularCategories: ['Grand Banquet Halls', 'Live Musical Ensembles', 'Traditional Poruwa Masters'],
    vendorCountEstimate: '170+ Vendors',
    lat: 7.4818,
    lng: 80.3609,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'puttalam',
    name: 'Puttalam',
    province: 'North Western',
    tagline: 'Kalpitiya Peninsula & Lagoon Coastal Retreats',
    description: 'Home to the breezy Kalpitiya peninsula, dolphin-watching coastline, and tranquil saltwater lagoons. Ideal for exotic coastal marquees and kite-surf beach parties.',
    keyTowns: ['Chilaw', 'Kalpitiya', 'Puttalam Town', 'Marawila', 'Wennappuwa'],
    popularCategories: ['Lagoonfront Resorts', 'Outdoor Coastal Lighting', 'Seaside Marquees'],
    vendorCountEstimate: '105+ Vendors',
    lat: 8.0408,
    lng: 79.8394,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
  },

  // --- North Central Province ---
  {
    id: 'anuradhapura',
    name: 'Anuradhapura',
    province: 'North Central',
    tagline: 'Ancient Sacred City & Majestic Heritage Splendor',
    description: 'Rich in 2,500 years of royal heritage. Perfect for culturally revered poruwa blessings, vast hotel banquet halls, and timeless lakeside photoshoots.',
    keyTowns: ['Anuradhapura Sacred City', 'Medawachchiya', 'Kekirawa', 'Eppawala', 'Tambuttegama'],
    popularCategories: ['Heritage Hotel Ballrooms', 'Traditional Cultural Decorators', 'Classical Dance Troupes'],
    vendorCountEstimate: '115+ Vendors',
    lat: 8.3114,
    lng: 80.4037,
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'polonnaruwa',
    name: 'Polonnaruwa',
    province: 'North Central',
    tagline: 'Medieval Kingdom Ruins & Parakrama Samudra Shores',
    description: 'Set along the glistening shores of the ancient Parakrama Samudra reservoir. Offering tranquil lakeside luxury hotels, stone temple backdrops, and peaceful gala settings.',
    keyTowns: ['Polonnaruwa City', 'Kaduruwela', 'Minneriya', 'Hingurakgoda', 'Medirigiriya'],
    popularCategories: ['Lakeside Wedding Resorts', 'Safari Gala Packages', 'Nature Photographers'],
    vendorCountEstimate: '70+ Vendors',
    lat: 7.9403,
    lng: 81.0188,
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=800&auto=format&fit=crop',
  },

  // --- Uva Province ---
  {
    id: 'badulla',
    name: 'Badulla',
    province: 'Uva',
    tagline: 'Ella Mountain Vistas & Romantic Misty Ravines',
    description: 'Encompassing the global travel sensation of Ella, Nine Arch Bridge vistas, and rolling emerald tea hills. A dream destination for intimate elopements and highland retreats.',
    keyTowns: ['Ella', 'Badulla City', 'Bandarawela', 'Haputale', 'Welimada'],
    popularCategories: ['Highland Elopement Venues', 'Panoramic Mountain Photographers', 'Boutique Tea Chalets'],
    vendorCountEstimate: '95+ Vendors',
    lat: 6.9934,
    lng: 81.0550,
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'monaragala',
    name: 'Monaragala',
    province: 'Uva',
    tagline: 'Kataragama Spiritual Hub & Wilderness Splendor',
    description: 'Blends the sacred heritage of Kataragama with untouched rural wilderness. Ideal for spiritual blessings, serene eco-resort celebrations, and large festive banquets.',
    keyTowns: ['Kataragama', 'Buttala', 'Monaragala Town', 'Wellawaya', 'Bibile'],
    popularCategories: ['Sacred Blessings Venues', 'Eco-Lodges & Tented Camps', 'Outdoor Firepit Parties'],
    vendorCountEstimate: '50+ Vendors',
    lat: 6.8728,
    lng: 81.3507,
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800&auto=format&fit=crop',
  },

  // --- Sabaragamuwa Province ---
  {
    id: 'ratnapura',
    name: 'Ratnapura',
    province: 'Sabaragamuwa',
    tagline: 'City of Gems & Sinharaja Rainforest Vistas',
    description: 'Surrounded by lush waterfalls, gem-mining valleys, and the UNESCO Sinharaja rainforest. Features rich ballroom facilities and tropical mountain wedding venues.',
    keyTowns: ['Ratnapura City', 'Balangoda', 'Pelmadulla', 'Embilipitiya', 'Kuruwita'],
    popularCategories: ['Tropical Forest Venues', 'Grand Ballrooms', 'Waterfall Pre-Wedding Shoots'],
    vendorCountEstimate: '110+ Vendors',
    lat: 6.7056,
    lng: 80.3847,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'kegalle',
    name: 'Kegalle',
    province: 'Sabaragamuwa',
    tagline: 'Pinnawala Riverside Gardens & Countryside Manors',
    description: 'Conveniently located between Colombo and Kandy along the Maha Oya river. Famous for Pinnawala riverside garden weddings and elegant countryside banquet halls.',
    keyTowns: ['Kegalle Town', 'Mawanella', 'Pinnawala', 'Warakapola', 'Ruwanwella'],
    popularCategories: ['Riverside Garden Venues', 'Traditional Poruwa Teams', 'Countryside Banquet Halls'],
    vendorCountEstimate: '85+ Vendors',
    lat: 7.2513,
    lng: 80.3464,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
  },
];

export default function LocationsPage() {
  const [selectedProvince, setSelectedProvince] = useState<string>('All Provinces');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDistrictId, setActiveDistrictId] = useState('colombo');

  const filteredDistricts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return SRI_LANKA_DISTRICTS.filter((district) =>
      (selectedProvince === 'All Provinces' || district.province === selectedProvince) &&
      (!query || [district.name, ...district.keyTowns, ...district.popularCategories]
        .some((value) => value.toLowerCase().includes(query)))
    );
  }, [selectedProvince, searchQuery]);

  const activeDistrict = SRI_LANKA_DISTRICTS.find((district) => district.id === activeDistrictId) || SRI_LANKA_DISTRICTS[0];
  const featuredDistricts = ['colombo', 'kandy', 'galle'].map((id) => SRI_LANKA_DISTRICTS.find((district) => district.id === id)!);
  const showOnMap = (id: string) => {
    setActiveDistrictId(id);
    document.getElementById('location-map')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="wedding-typography min-h-screen bg-[#faf8f4] font-sans text-slate-900">
      <div className="h-20 bg-slate-900"><Navbar /></div>
      <header className="relative overflow-hidden bg-slate-900 pb-24 pt-14 sm:pb-32 sm:pt-20">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.18),transparent_65%)]" />
        <div aria-hidden="true" className="absolute -right-28 -top-28 h-[560px] w-[560px] rounded-full border border-white/10" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-20 lg:px-8">
          <div>
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#e5c76b]"><Compass className="h-4 w-4" aria-hidden="true" /> Explore Sri Lanka</p>
            <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">Your occasion.<br /><span className="font-serif font-normal italic text-[#e5c76b]">An extraordinary setting.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-300">City lights, ocean breezes, or misty hills. Discover a place that feels like you, then find the people to bring your celebration to life.</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8">
            <label htmlFor="hero-location-search" className="mb-3 block text-sm font-medium text-white">Where are you dreaming of celebrating?</label>
            <form action="#district-directory" className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3.5 top-4 h-4 w-4 text-slate-500" aria-hidden="true" />
                <Input id="hero-location-search" value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setSelectedProvince('All Provinces'); }} placeholder="Try Colombo, Ella, or Galle" className="h-12 rounded-xl border-0 bg-white pl-10 text-slate-900" />
              </div>
              <button type="submit" aria-label="Find districts" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e5c76b] text-slate-900 hover:bg-[#f0d98f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><ArrowRight className="h-5 w-5" /></button>
            </form>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-300"><span>25 districts to explore</span><span>9 provinces</span><span>One memorable occasion</span></div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <section aria-labelledby="destination-inspiration" className="relative -mt-12 mb-16">
          <h2 id="destination-inspiration" className="sr-only">Find your kind of celebration</h2>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {featuredDistricts.map((district, index) => {
              const Icon = [Building2, Mountain, Palmtree][index];
              return (
                <Link key={district.id} href={`/search?city=${encodeURIComponent(district.name)}`} className="group relative isolate flex h-64 items-end overflow-hidden rounded-2xl bg-slate-800 p-6 shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:h-72">
                  <Image src={district.image} alt="" fill unoptimized sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/10" />
                  <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/50 px-3 py-1.5 text-xs text-white backdrop-blur-sm"><Icon className="h-3.5 w-3.5" aria-hidden="true" />{['City celebrations', 'Hill-country moments', 'Coastal occasions'][index]}</span>
                  <span className="relative flex w-full items-end justify-between gap-3">
                    <span><span className="block text-xs text-slate-200">{district.province} Province</span><span className="mt-1 block text-3xl font-semibold tracking-tight text-white">{district.name}</span></span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white group-hover:bg-white group-hover:text-slate-900"><ArrowUpRight className="h-5 w-5" aria-hidden="true" /></span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section id="district-directory" aria-labelledby="directory-heading" className="scroll-mt-28">
          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8c6c19]">Find your place</p><h2 id="directory-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">Every district. A different story.</h2><p className="mt-3 text-sm text-slate-500">Explore the island by province, district, or the town you have in mind.</p></div>
            <a href="#location-map" className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium hover:bg-slate-100"><MapPin className="h-4 w-4" aria-hidden="true" /> Explore the map <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <label htmlFor="district-search" className="sr-only">Search districts, towns, or services</label>
                <Search className="absolute left-4 top-4 h-4 w-4 text-slate-400" aria-hidden="true" />
                <Input id="district-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search district, town, or service…" className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11" />
              </div>
              <p role="status" className="shrink-0 text-sm text-slate-500">{filteredDistricts.length} of 25 districts</p>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Filter by province">
              {PROVINCES.map((province) => (
                <button key={province} type="button" aria-pressed={selectedProvince === province} onClick={() => setSelectedProvince(province)} className={`rounded-full border px-4 py-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${selectedProvince === province ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-[#b49a50] hover:bg-[#faf8f4]'}`}>{province}</button>
              ))}
            </div>
          </div>
          {filteredDistricts.length === 0 ? (
            <div className="mb-16 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <SearchX className="mx-auto mb-4 h-8 w-8 text-[#8c6c19]" aria-hidden="true" /><h3 className="text-xl font-semibold">Let’s try another place.</h3><p className="mt-2 text-sm text-slate-500">No districts match these filters. Try another town or choose a different province.</p><Button variant="outline" className="mt-5" onClick={() => { setSearchQuery(''); setSelectedProvince('All Provinces'); }}>Reset filters</Button>
            </div>
          ) : (
            <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDistricts.map((district) => (
                <article key={district.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-shadow hover:shadow-lg">
                  <Link href={`/search?city=${encodeURIComponent(district.name)}`} aria-label={`Explore vendors in ${district.name}`} className="relative block h-52 overflow-hidden bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-primary">
                    <Image src={district.image} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-slate-900/60 px-3 py-1 text-xs text-white">{district.province} Province</span>
                    <h3 className="absolute bottom-5 left-5 right-5 text-2xl font-semibold tracking-tight text-white">{district.name}</h3>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="mb-4 line-clamp-2 min-h-10 text-sm leading-relaxed text-slate-600">{district.tagline}</p>
                    <div className="mb-5 flex flex-wrap gap-1.5">{district.keyTowns.slice(0, 3).map((town) => <span key={town} className="rounded-md bg-[#f5f3ee] px-2 py-1 text-xs text-slate-600">{town}</span>)}</div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <button type="button" onClick={() => showOnMap(district.id)} className="inline-flex items-center gap-1.5 rounded-md py-1 text-xs font-medium text-slate-500 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-primary" aria-label={`Show ${district.name} on map`}><MapPin className="h-3.5 w-3.5" aria-hidden="true" /> View on map</button>
                      <Link href={`/search?city=${encodeURIComponent(district.name)}`} className="inline-flex items-center gap-2 rounded-md py-1 text-sm font-semibold text-[#80621b] hover:text-slate-900">Explore vendors <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="location-map" aria-labelledby="map-heading" className="relative isolate mb-16 scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
          <div className="mb-8"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8c6c19]">A new perspective</p><h2 id="map-heading" className="text-3xl font-semibold tracking-tight">Let the island inspire you.</h2><p className="mt-3 text-sm text-slate-500">Select a district on the map to discover its towns and celebration ideas.</p></div>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="min-w-0"><SriLankaMap districts={SRI_LANKA_DISTRICTS} activeDistrictId={activeDistrictId} onSelectDistrict={setActiveDistrictId} /></div>
            <div className="overflow-hidden rounded-2xl bg-[#f5f3ee]">
              <div className="relative h-48 bg-slate-200"><Image src={activeDistrict.image} alt="" fill unoptimized sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" /><span className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" /><p className="absolute bottom-5 left-6 text-xs font-medium uppercase tracking-widest text-white">{activeDistrict.province} Province</p></div>
              <div className="p-6 sm:p-8">
                <h3 className="text-3xl font-semibold tracking-tight">{activeDistrict.name}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{activeDistrict.description}</p>
                <h4 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-widest text-[#80621b]">Towns to explore</h4>
                <div className="flex flex-wrap gap-2">{activeDistrict.keyTowns.map((town) => <span key={town} className="rounded-lg bg-white px-3 py-1.5 text-xs text-slate-600">{town}</span>)}</div>
                <Link href={`/search?city=${encodeURIComponent(activeDistrict.name)}`} className="mt-7 flex items-center justify-between gap-3 rounded-xl bg-slate-900 px-5 py-4 text-sm font-medium text-white hover:bg-slate-800">Explore {activeDistrict.name} vendors <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-10 rounded-3xl bg-slate-900 p-7 text-white sm:p-12 lg:grid-cols-[1fr_1.2fr]">
          <div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#e5c76b]">Make it your own</p><h2 className="text-3xl font-semibold leading-tight tracking-tight">The right place.<br /><span className="font-serif font-normal italic text-[#e5c76b]">The right people.</span></h2><p className="mt-4 text-sm leading-relaxed text-slate-300">Start with a setting you love, then speak with vendors about the details that make your day special.</p><Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#e5c76b] hover:underline">Need a little guidance? <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[{ icon: Building2, title: 'Find your setting', text: 'Explore venues by location, then confirm capacity, dates, and facilities directly with the venue.' }, { icon: Truck, title: 'Bring your team', text: 'Many event professionals travel. Ask about service areas, travel fees, and availability before booking.' }].map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6"><Icon className="mb-5 h-6 w-6 text-[#e5c76b]" aria-hidden="true" /><h3 className="mb-3 text-base font-semibold">{title}</h3><p className="text-sm leading-relaxed text-slate-300">{text}</p></div>)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
