'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { VendorCard } from '@/components/discovery/VendorCard';

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
    loadRecentlyViewed();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/customer/account/favorites');
      setFavorites(res.data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentlyViewed = () => {
    const recent = localStorage.getItem('recentlyViewedBusinesses');
    if (recent) {
      try {
        setRecentlyViewed(JSON.parse(recent));
      } catch (e) {}
    }
  };

  const handleFavoriteChange = (businessId: string, isNowFavorite: boolean) => {
    if (!isNowFavorite) {
      setFavorites(favorites.filter(f => f.business.id !== businessId));
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* Favorites Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
            <Heart className="h-5 w-5 text-red-500 fill-current" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Saved Favorites</h2>
            <p className="text-slate-500 text-sm mt-0.5">Vendors you've saved for later planning.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-2xl" />)}
          </div>
        ) : favorites.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center bg-white/50">
            <Heart className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No saved vendors</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-6">Click the heart icon on any vendor profile to save them to your favorites list.</p>
            <Link href="/search">
              <Button variant="outline">Browse Vendors</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(fav => (
              <VendorCard 
                key={fav.id} 
                business={fav.business} 
                initialIsFavorite={true}
                onFavoriteChange={(isFav) => handleFavoriteChange(fav.business.id, isFav)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recently Viewed Section */}
      <section className="pt-8 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Eye className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recently Viewed</h2>
            <p className="text-slate-500 text-sm mt-0.5">Vendors you've looked at recently.</p>
          </div>
        </div>

        {recentlyViewed.length === 0 ? (
          <p className="text-slate-500 italic text-sm">You haven't viewed any vendors recently.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentlyViewed.slice(0, 4).map(business => (
              <VendorCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </section>
      
    </div>
  );
}
