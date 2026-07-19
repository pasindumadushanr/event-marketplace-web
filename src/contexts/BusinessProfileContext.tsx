'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

interface BusinessProfileContextType {
  business: any;
  isLoading: boolean;
  error: string | null;
  refreshBusiness: () => Promise<void>;
  updateBusinessLocally: (data: any) => void;
}

const BusinessProfileContext = createContext<BusinessProfileContextType | undefined>(undefined);

export function BusinessProfileProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/vendor/business');
      setBusiness(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load business profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, []);

  const updateBusinessLocally = (data: any) => {
    setBusiness((prev: any) => ({ ...prev, ...data }));
  };

  return (
    <BusinessProfileContext.Provider value={{ business, isLoading, error, refreshBusiness: fetchBusiness, updateBusinessLocally }}>
      {children}
    </BusinessProfileContext.Provider>
  );
}

export function useBusinessProfile() {
  const context = useContext(BusinessProfileContext);
  if (context === undefined) {
    throw new Error('useBusinessProfile must be used within a BusinessProfileProvider');
  }
  return context;
}
