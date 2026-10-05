"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import api from "./api";
import { useAuth } from "./auth-context";

export interface ShortlistedVendor {
  id: string;
  name: string;
  coverImage?: string;
  logo?: string;
  city?: string;
  district?: string;
  category?: { name: string };
  isVerified: boolean;
  available: boolean;
  services: string[];
  startingPrice: number;
  hasQuoteOnlyServices?: boolean;
  rating: number;
  reviewCount: number;
}
export interface SavedVendor {
  id: string;
  business: ShortlistedVendor;
}
interface ShortlistState {
  favorites: SavedVendor[];
  loading: boolean;
  error: string;
  pending: string[];
  refresh: () => Promise<void>;
  toggle: (id: string) => Promise<void>;
}
const Context = createContext<ShortlistState | null>(null);

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [favorites, setFavorites] = useState<SavedVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<string[]>([]);
  const currentUser = useRef(user?.id);
  currentUser.current = user?.id;
  const busy = useRef(new Set<string>());
  const refresh = useCallback(async () => {
    const owner = user?.id;
    if (!owner) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get<SavedVendor[]>(
        "/customer/account/favorites",
      );
      if (currentUser.current === owner) setFavorites(data);
    } catch {
      if (currentUser.current === owner)
        setError("We couldn’t load your shortlist. Please try again.");
    } finally {
      if (currentUser.current === owner) setLoading(false);
    }
  }, [user?.id]);
  useEffect(() => {
    setFavorites([]);
    setError("");
    if (user) void refresh();
    else setLoading(isLoading);
  }, [user?.id, isLoading, refresh]);

  async function toggle(id: string) {
    const owner = user?.id;
    if (!owner || busy.current.has(id)) return;
    if (loading || error)
      throw new Error("Please reload your shortlist before saving changes.");
    busy.current.add(id);
    setPending([...busy.current]);
    try {
      if (favorites.some((item) => item.business.id === id)) {
        await api.delete(`/customer/account/favorites/${id}`);
        if (currentUser.current === owner)
          setFavorites((items) =>
            items.filter((item) => item.business.id !== id),
          );
      } else {
        await api.post(`/customer/account/favorites/${id}`);
        await refresh();
      }
    } finally {
      busy.current.delete(id);
      setPending([...busy.current]);
    }
  }
  return (
    <Context.Provider
      value={{ favorites, loading, error, pending, refresh, toggle }}
    >
      {children}
    </Context.Provider>
  );
}
export function useShortlist() {
  const value = useContext(Context);
  if (!value) throw new Error("ShortlistProvider is required");
  return value;
}
