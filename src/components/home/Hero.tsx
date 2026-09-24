'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Grid } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const SRI_LANKA_PROVINCES_DISTRICTS = [
  {
    province: 'Western Province',
    districts: ['Colombo', 'Gampaha', 'Kalutara']
  },
  {
    province: 'Central Province',
    districts: ['Kandy', 'Matale', 'Nuwara Eliya']
  },
  {
    province: 'Southern Province',
    districts: ['Galle', 'Matara', 'Hambantota']
  },
  {
    province: 'Northern Province',
    districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu']
  },
  {
    province: 'Eastern Province',
    districts: ['Batticaloa', 'Ampara', 'Trincomalee']
  },
  {
    province: 'North Western Province',
    districts: ['Kurunegala', 'Puttalam']
  },
  {
    province: 'North Central Province',
    districts: ['Anuradhapura', 'Polonnaruwa']
  },
  {
    province: 'Uva Province',
    districts: ['Badulla', 'Monaragala']
  },
  {
    province: 'Sabaragamuwa Province',
    districts: ['Ratnapura', 'Kegalle']
  }
];

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.append('q', query.trim());
    if (city) params.append('city', city);
    if (category) params.append('category', category);
    
    const queryString = params.toString();
    router.push(queryString ? `/search?${queryString}` : '/search');
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop" 
          alt="Luxury Wedding Event" 
          className="w-full h-full object-cover scale-105 transform origin-center animate-out zoom-in duration-[20000ms]"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl leading-tight">
            Everything You Need for Your <span className="text-primary italic">Perfect Event</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 font-light max-w-3xl mx-auto drop-shadow-md">
            Discover and book the finest venues, photographers, and event professionals for weddings and corporate galas across all 25 districts of Sri Lanka.
          </p>
        </motion.div>

        {/* Search Bar Component */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white p-2 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2"
          >
            {/* Keyword Input */}
            <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-colors">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <Input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?" 
                className="border-0 bg-transparent focus-visible:ring-0 shadow-none text-base md:text-lg h-14"
              />
            </div>
            
            {/* Category Select */}
            <div className="w-full md:w-56 flex items-center px-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-colors">
              <Grid className="h-5 w-5 text-slate-400 shrink-0" />
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 text-slate-700 h-14 px-3 outline-none cursor-pointer text-sm font-medium"
              >
                <option value="">All Categories</option>
                <option value="venues">Hotels & Venues</option>
                <option value="photo">Photographers & Video</option>
                <option value="bridal">Bridal & Beauty</option>
                <option value="catering">Catering & Cakes</option>
                <option value="decor">Floral & Decor</option>
                <option value="music">Live Bands & DJs</option>
              </select>
            </div>

            {/* 25 Districts Location Select */}
            <div className="w-full md:w-64 flex items-center px-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-colors">
              <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
              <select 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 text-slate-700 h-14 px-3 outline-none cursor-pointer text-sm font-medium"
              >
                <option value="">Any Location (All 25 Districts)</option>
                {SRI_LANKA_PROVINCES_DISTRICTS.map((group) => (
                  <optgroup key={group.province} label={group.province}>
                    {group.districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="h-14 px-8 text-base md:text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl w-full md:w-auto shadow-md"
            >
              Search
            </Button>
          </form>
        </motion.div>

        {/* Popular Tags */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="pt-4 text-slate-300 text-sm font-medium flex items-center justify-center gap-6 flex-wrap"
        >
          <span>Popular:</span>
          <Link href="/search?q=Cinematic%20Videography" className="hover:text-primary transition-colors underline decoration-white/30 underline-offset-4">
            Cinematic Videography
          </Link>
          <Link href="/search?q=Beach%20Venues" className="hover:text-primary transition-colors underline decoration-white/30 underline-offset-4">
            Beach Venues
          </Link>
          <Link href="/search?q=Bridal%20Makeup" className="hover:text-primary transition-colors underline decoration-white/30 underline-offset-4">
            Bridal Makeup
          </Link>
          <Link href="/locations" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 inline" /> Explore 25 Districts Map &rarr;
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
