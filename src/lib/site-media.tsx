"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

export type SiteMedia = {
  heroImage?: string;
  logoImage?: string;
  packageFallbackImage?: string;
  locationColombo?: string;
  locationKandy?: string;
  locationGalle?: string;
  locationNegombo?: string;
  categoryImages?: Record<string, string>;
};

const MediaContext = createContext<{
  media: SiteMedia;
  updateMedia: (media: SiteMedia) => void;
}>({ media: {}, updateMedia: () => {} });

export function SiteMediaProvider({ children }: { children: React.ReactNode }) {
  const [media, setMedia] = useState<SiteMedia>({});
  useEffect(() => {
    let active = true;
    api
      .get("/admin/cms/public/settings/SITE_MEDIA")
      .then(({ data }) => {
        if (active && data && typeof data === "object") setMedia(data);
      })
      .catch(() => {
        /* Keep the original artwork if settings are unavailable. */
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <MediaContext.Provider value={{ media, updateMedia: setMedia }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useSiteMedia() {
  return useContext(MediaContext);
}

export function fallbackImage(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback: string,
) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied !== "true") {
    image.dataset.fallbackApplied = "true";
    image.src = fallback;
  }
}
