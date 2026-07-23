'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { VendorCard } from '@/components/discovery/VendorCard';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { Button } from '@/components/ui/button';
import { SearchX, SlidersHorizontal, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState('');
  const [sortBy, setSortBy] = useState('NEWEST');
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    fetchResults();
  }, [sortBy]); // Refetch when sort changes. We will manually trigger for text searches.

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (city) params.append('city', city);
      if (sortBy) params.append('sortBy', sortBy);
      
      const res = await api.get(`/discovery/search?${params.toString()}`);
      setBusinesses(res.data.data);
      setMeta(res.data.meta);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      <div className="h-20 bg-slate-900" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Filter Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-28">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
              <SlidersHorizontal className="h-5 w-5" /> Filters
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Keyword</label>
                <Input 
                  placeholder="Wedding, DJ, Floral..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">City / Location</label>
                <Input 
                  placeholder="e.g. Colombo" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-slate-900 hover:bg-primary text-white">
                  Apply Filters
                </Button>
              </div>
            </form>
          </div>
        </aside>

        {/* Search Results Area */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {query ? `Results for "${query}"` : 'Explore Marketplace'}
              </h1>
              <p className="text-slate-500 mt-1">
                {isLoading ? 'Searching...' : `Found ${meta?.total || 0} vendors`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={(val) => val && setSortBy(val)}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEWEST">Newest Additions</SelectItem>
                  <SelectItem value="RATING_DESC">Highest Rated</SelectItem>
                  <SelectItem value="PRICE_ASC">Price: Low to High</SelectItem>
                  <SelectItem value="PRICE_DESC">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[400px] bg-slate-100 animate-pulse rounded-2xl" />)}
            </div>
          ) : businesses.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center flex flex-col items-center">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <SearchX className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No vendors found</h3>
              <p className="text-slate-500 max-w-md mb-8">We couldn't find any vendors matching your current filters. Try adjusting your search terms or location.</p>
              <Button onClick={() => { setQuery(''); setCity(''); fetchResults(); }} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <VendorCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
