'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Search, 
  Building2, 
  Palmtree, 
  Mountain, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface DistrictInfo {
  id: string;
  name: string;
  province: string;
  tagline: string;
  description: string;
  keyTowns: string[];
  popularCategories: string[];
  vendorCountEstimate: string;
  svgCoords: { x: number; y: number }; // SVG map pin coordinates (relative to viewBox 0 0 400 560)
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
    svgCoords: { x: 135, y: 395 },
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
    svgCoords: { x: 140, y: 360 },
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
    svgCoords: { x: 145, y: 430 },
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
    svgCoords: { x: 200, y: 345 },
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
    svgCoords: { x: 205, y: 300 },
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
    svgCoords: { x: 205, y: 395 },
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
    svgCoords: { x: 160, y: 490 },
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
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
    svgCoords: { x: 195, y: 510 },
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
    svgCoords: { x: 250, y: 495 },
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
    svgCoords: { x: 155, y: 80 },
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
    svgCoords: { x: 175, y: 125 },
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
    svgCoords: { x: 125, y: 170 },
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
    svgCoords: { x: 185, y: 185 },
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
    svgCoords: { x: 215, y: 145 },
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
    svgCoords: { x: 290, y: 310 },
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
    svgCoords: { x: 300, y: 385 },
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
    svgCoords: { x: 255, y: 220 },
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
    svgCoords: { x: 165, y: 315 },
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
    svgCoords: { x: 130, y: 285 },
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
    svgCoords: { x: 185, y: 235 },
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
    svgCoords: { x: 240, y: 275 },
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
    svgCoords: { x: 245, y: 400 },
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
    svgCoords: { x: 265, y: 440 },
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
    svgCoords: { x: 180, y: 430 },
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
    svgCoords: { x: 170, y: 370 },
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
  },
];

export default function LocationsPage() {
  const [selectedProvince, setSelectedProvince] = useState<string>('All Provinces');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDistrictId, setActiveDistrictId] = useState<string>('colombo');

  // Filter districts based on search and province
  const filteredDistricts = useMemo(() => {
    const hasSearch = searchQuery.trim().length > 0;
    return SRI_LANKA_DISTRICTS.filter((d) => {
      const matchesProvince = 
        hasSearch || selectedProvince === 'All Provinces' || d.province === selectedProvince;
      const matchesSearch =
        !hasSearch ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.keyTowns.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        d.popularCategories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesProvince && matchesSearch;
    });
  }, [selectedProvince, searchQuery]);

  // Current active district details
  const activeDistrict = useMemo(() => {
    return (
      SRI_LANKA_DISTRICTS.find((d) => d.id === activeDistrictId) ||
      SRI_LANKA_DISTRICTS[0]
    );
  }, [activeDistrictId]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      <div className="h-20 bg-slate-900" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest mb-4">
            <Compass className="h-3.5 w-3.5 mr-1.5 inline" /> Island-Wide Event Coverage
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Service Coverage Across All <span className="text-primary font-serif italic">25 Districts</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            From the bustling 5-star ballrooms of Colombo to coastal beach villas in Galle and cultural poruwas in Kandy, LuxeEvents connects you with top-rated venues and mobile event vendors operating in every corner of Sri Lanka.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200/80">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-primary">25 / 25</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Districts Covered</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">9</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Provinces</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">100%</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Mobile Travel Network</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">1,200+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Vetted Professionals</p>
            </div>
          </div>
        </div>

        {/* Interactive Map & District Spotlight Grid */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" /> Interactive Sri Lanka Coverage Map
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Hover or click on any district pin on the map to explore local specialties and verified vendors.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary inline-block"></span> Active Coverage</span>
              <span className="flex items-center gap-1.5 ml-3"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block"></span> Selected District</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* SVG Interactive Map (Left/Center Col) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-900 rounded-3xl relative overflow-hidden shadow-inner">
              <div className="absolute top-4 left-4 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-primary animate-spin" /> Sri Lanka Geospatial Map
              </div>

              {/* Stylized Island SVG Container */}
              <div className="w-full max-w-[360px] relative aspect-[400/560]">
                <svg
                  viewBox="0 0 400 560"
                  className="w-full h-full drop-shadow-2xl"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Subtle Grid Pattern */}
                  <defs>
                    <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="400" height="560" fill="url(#mapGrid)" />

                  {/* Stylized Sri Lanka Island Silhouette */}
                  <path
                    d="M 160 50 
                       C 180 40, 200 70, 190 100 
                       C 220 120, 245 160, 260 210 
                       C 275 250, 305 310, 310 370 
                       C 315 420, 280 490, 240 520 
                       C 210 535, 175 525, 150 495 
                       C 130 460, 120 410, 125 360 
                       C 115 320, 110 270, 125 210 
                       C 135 160, 135 110, 145 75 Z"
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="2.5"
                    className="transition-colors duration-300"
                  />

                  {/* Jaffna Peninsula Shape */}
                  <path
                    d="M 145 75 
                       C 140 45, 165 40, 185 55 
                       C 170 75, 155 80, 145 75 Z"
                    fill="#334155"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />

                  {/* Mannar Island Bar */}
                  <path
                    d="M 120 160 C 105 170, 95 185, 120 180 Z"
                    fill="#334155"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />

                  {/* Connecting Geographic Region Lines */}
                  <path d="M 135 395 L 200 345 L 245 400 L 160 490" fill="none" stroke="rgba(197, 160, 89, 0.15)" strokeDasharray="3 3" />
                  <path d="M 200 345 L 185 235 L 155 80" fill="none" stroke="rgba(197, 160, 89, 0.15)" strokeDasharray="3 3" />
                  <path d="M 200 345 L 255 220 L 290 310 L 300 385" fill="none" stroke="rgba(197, 160, 89, 0.15)" strokeDasharray="3 3" />

                  {/* District Pins & Interactive Hotspots */}
                  {SRI_LANKA_DISTRICTS.map((district) => {
                    const isSelected = activeDistrictId === district.id;
                    return (
                      <g 
                        key={district.id}
                        className="cursor-pointer group"
                        onClick={() => setActiveDistrictId(district.id)}
                        onMouseEnter={() => setActiveDistrictId(district.id)}
                      >
                        {/* Selected Pulse Ring */}
                        {isSelected && (
                          <circle
                            cx={district.svgCoords.x}
                            cy={district.svgCoords.y}
                            r="14"
                            className="fill-emerald-500/20 stroke-emerald-400 stroke-[1.5] animate-ping"
                          />
                        )}

                        {/* Outer Pin Circle */}
                        <circle
                          cx={district.svgCoords.x}
                          cy={district.svgCoords.y}
                          r={isSelected ? 7 : 4.5}
                          className={`transition-all duration-300 ${
                            isSelected
                              ? 'fill-emerald-400 stroke-white stroke-2 shadow-lg'
                              : 'fill-primary hover:fill-amber-300 stroke-slate-900 stroke-1'
                          }`}
                        />

                        {/* District Name Label */}
                        <text
                          x={district.svgCoords.x}
                          y={district.svgCoords.y - 8}
                          textAnchor="middle"
                          className={`text-[9px] font-sans font-bold tracking-tight select-none pointer-events-none transition-all ${
                            isSelected
                              ? 'fill-emerald-300 font-extrabold text-[11px]'
                              : 'fill-slate-300/80 group-hover:fill-white'
                          }`}
                        >
                          {district.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Click any of the 25 district nodes above to reveal detailed wedding & event services.
              </p>
            </div>

            {/* District Detail Spotlight (Right Col) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
                
                {/* Header with image banner */}
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="w-full sm:w-28 h-28 rounded-2xl overflow-hidden shrink-0 shadow-md">
                    <img
                      src={activeDistrict.image}
                      alt={activeDistrict.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-slate-900 text-white font-semibold text-xs">
                        {activeDistrict.province} Province
                      </Badge>
                      <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-xs font-bold">
                        <CheckCircle2 className="h-3 w-3 mr-1 inline" /> 100% Active Coverage
                      </Badge>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 pt-1">{activeDistrict.name}</h3>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {activeDistrict.tagline}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed">
                  {activeDistrict.description}
                </p>

                {/* Major Towns Served */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Key Towns & Areas Covered:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDistrict.keyTowns.map((town, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium bg-white text-slate-800 border border-slate-200 px-2.5 py-1 rounded-lg"
                      >
                        {town}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Top Categories */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Popular Event Services in {activeDistrict.name}:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDistrict.popularCategories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-lg"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Action */}
                <div className="pt-2">
                  <Link href={`/search?city=${encodeURIComponent(activeDistrict.name)}`} className="block">
                    <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                      Browse All {activeDistrict.name} Vendors & Venues <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Directory Search & Filter Controls */}
        <div className="space-y-6 mb-10">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Directory of All 25 Districts</h2>
              <p className="text-slate-500 text-sm mt-0.5">Filter by province or search for your event town</p>
            </div>

            {/* Search Input */}
            <div className="w-full sm:w-80 relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              <Input
                placeholder="Search district, town, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Province Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
            {PROVINCES.map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvince(prov)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedProvince === prov
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>

        {/* District Cards Grid (All 25) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredDistricts.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500 text-base mb-2">No districts found matching "{searchQuery}".</p>
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedProvince('All Provinces'); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredDistricts.map((district) => (
              <div
                key={district.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={district.image}
                    alt={district.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        {district.province} Province
                      </span>
                      <h3 className="text-xl font-bold text-white leading-tight">{district.name}</h3>
                    </div>
                    <Badge className="bg-white/20 backdrop-blur-md text-white border-0 text-[10px]">
                      {district.vendorCountEstimate}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{district.tagline}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{district.description}</p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1">
                      {district.keyTowns.slice(0, 3).map((town, tIdx) => (
                        <span key={tIdx} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {town}
                        </span>
                      ))}
                      {district.keyTowns.length > 3 && (
                        <span className="text-[11px] font-medium text-slate-400 px-1 py-0.5">
                          +{district.keyTowns.length - 3} more
                        </span>
                      )}
                    </div>

                    <Link href={`/search?city=${encodeURIComponent(district.name)}`} className="block">
                      <Button className="w-full h-10 bg-slate-900 hover:bg-primary text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5">
                        Explore {district.name} Vendors <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Island-Wide Mobile Service Guarantee Info Card */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-6">
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase text-xs tracking-wider">
              <Truck className="h-3.5 w-3.5 mr-1.5 inline" /> Nationwide Logistics
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              How Island-Wide Service Works on LuxeEvents
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              While banquet halls and luxury hotels are anchored to specific districts, <strong>over 80% of our creative service vendors</strong> (including Wedding Photographers, Cinematographers, Live Bands, DJs, Hair & Makeup Artists, and Poruwa Decorators) offer <strong>cross-district mobile dispatch</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Fixed Venues</h4>
                <p className="text-xs text-slate-400">Search banquet halls, ballroom hotels, and villas situated strictly within your chosen district.</p>
              </div>

              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-primary">
                  <Truck className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Mobile Service Teams</h4>
                <p className="text-xs text-slate-400">Elite Colombo or Kandy photographers readily travel to Galle, Ella, Trincomalee, or Jaffna for your event.</p>
              </div>

              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Guaranteed Dates</h4>
                <p className="text-xs text-slate-400">Lock in your dates with verified advance deposits held safely until milestone completion.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Vendor Onboarding Callout */}
        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 sm:p-10 text-center max-w-3xl mx-auto space-y-4">
          <Sparkles className="h-8 w-8 text-primary mx-auto" />
          <h3 className="text-2xl font-bold text-slate-900">Are You an Event Professional in Any of These 25 Districts?</h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Whether you own a luxury beach villa in Mirissa, a photo studio in Colombo, or a traditional musical ensemble in Jaffna, connect with premium clients across Sri Lanka and abroad.
          </p>
          <div className="pt-2">
            <Link href="/vendor/register">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20">
                Join as a Verified Vendor
              </Button>
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
