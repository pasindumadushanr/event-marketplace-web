'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, RotateCcw, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface DistrictMapItem {
  id: string;
  name: string;
  province: string;
  tagline: string;
  keyTowns: string[];
  vendorCountEstimate: string;
  lat: number;
  lng: number;
}

interface SriLankaMapProps {
  districts: DistrictMapItem[];
  activeDistrictId: string;
  onSelectDistrict: (id: string) => void;
}

const SRI_LANKA_CENTER: [number, number] = [7.8731, 80.7718];
const DEFAULT_ZOOM = 7.3;

const TILE_PROVIDERS = {
  voyager: {
    name: 'Modern Street',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    subdomains: 'abc',
    maxZoom: 18,
  },
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19,
  }
};

export default function SriLankaMap({
  districts,
  activeDistrictId,
  onSelectDistrict,
}: SriLankaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [activeTile, setActiveTile] = useState<'voyager' | 'satellite' | 'osm'>('voyager');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: SRI_LANKA_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 6.5,
      maxZoom: 16,
      zoomControl: false, // We render custom stylish controls
      maxBounds: [
        [5.2, 78.5],
        [10.5, 82.8],
      ],
      maxBoundsViscosity: 0.8,
    });

    const currentProvider = TILE_PROVIDERS[activeTile];
    const tileLayer = L.tileLayer(currentProvider.url, {
      attribution: currentProvider.attribution,
      subdomains: currentProvider.subdomains,
      maxZoom: currentProvider.maxZoom,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    // Render Markers for all 25 districts
    const newMarkers: { [id: string]: L.Marker } = {};

    districts.forEach((d) => {
      const isSelected = d.id === activeDistrictId;

      const markerIcon = createMarkerIcon(d.name, isSelected);

      const marker = L.marker([d.lat, d.lng], {
        icon: markerIcon,
        zIndexOffset: isSelected ? 1000 : 100,
        title: `${d.name} (${d.province} Province)`,
      }).addTo(map);

      // Bind popup
      const popupHtml = `
        <div style="font-family: inherit; min-width: 170px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 2px;">
            <strong style="font-size: 15px; color: #0f172a;">${d.name}</strong>
            <span style="font-size: 10px; font-weight: 700; background: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 9999px;">${d.province}</span>
          </div>
          <div style="font-size: 11px; color: #059669; font-weight: 600; margin-bottom: 6px;">${d.vendorCountEstimate}</div>
          <div style="font-size: 11px; color: #64748b; line-height: 1.3; margin-bottom: 8px;">Key towns: ${d.keyTowns.slice(0, 3).join(', ')}</div>
          <a href="/search?city=${encodeURIComponent(d.name)}" style="display: block; text-align: center; background: #0f172a; color: #ffffff; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 8px; text-decoration: none;">
            Explore Vendors in ${d.name} &rarr;
          </a>
        </div>
      `;
      marker.bindPopup(popupHtml, {
        offset: [0, -18],
        closeButton: true,
      });

      marker.on('click', () => {
        onSelectDistrict(d.id);
      });

      newMarkers[d.id] = marker;
    });

    markersRef.current = newMarkers;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile provider if changed
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const provider = TILE_PROVIDERS[activeTile];
    tileLayerRef.current.setUrl(provider.url);
    tileLayerRef.current.options.attribution = provider.attribution;
    tileLayerRef.current.options.subdomains = provider.subdomains;
    tileLayerRef.current.redraw();
  }, [activeTile]);

  // Update Active Marker state & smoothly center
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    districts.forEach((d) => {
      const marker = markersRef.current[d.id];
      if (!marker) return;

      const isSelected = d.id === activeDistrictId;
      marker.setIcon(createMarkerIcon(d.name, isSelected));
      marker.setZIndexOffset(isSelected ? 1000 : 100);

      if (isSelected) {
        // Fly gently to active district
        map.flyTo([d.lat, d.lng], Math.max(map.getZoom(), 8.8), {
          duration: 0.9,
          easeLinearity: 0.25,
        });
      }
    });
  }, [activeDistrictId, districts]);

  // Helper to build custom HTML pin icons
  function createMarkerIcon(name: string, isSelected: boolean) {
    const html = isSelected
      ? `
        <div class="relative flex flex-col items-center cursor-pointer group">
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping"></span>
            <span class="relative flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 text-white shadow-xl ring-2 ring-white border-2 border-emerald-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </span>
          </div>
          <span class="mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-950 text-emerald-400 shadow-xl border border-emerald-500/40 whitespace-nowrap tracking-wide">
            ${name}
          </span>
        </div>
      `
      : `
        <div class="relative flex flex-col items-center cursor-pointer group transition-transform duration-200 hover:scale-110">
          <div class="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-md group-hover:bg-amber-400"></div>
          <span class="mt-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/85 text-slate-100 shadow border border-slate-700/60 whitespace-nowrap backdrop-blur-sm group-hover:bg-slate-950 group-hover:text-amber-300">
            ${name}
          </span>
        </div>
      `;

    return L.divIcon({
      className: 'sri-lanka-custom-marker',
      html: html,
      iconSize: isSelected ? [90, 52] : [70, 36],
      iconAnchor: isSelected ? [45, 14] : [35, 7],
      popupAnchor: [0, -14],
    });
  }

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(SRI_LANKA_CENTER, DEFAULT_ZOOM, {
        duration: 0.8,
      });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900">
      {/* Map Target Canvas */}
      <div 
        ref={mapContainerRef} 
        id="sri-lanka-leaflet-map"
        className="w-full h-full z-0" 
      />

      {/* Floating Top Controls Header */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700/60 text-white shadow-lg pointer-events-auto">
        <div className="flex items-center gap-2 text-xs font-semibold pr-2 border-r border-slate-700">
          <Compass className="h-4 w-4 text-emerald-400 animate-spin-slow" />
          <span>Real Sri Lanka GIS Map</span>
        </div>

        {/* Tile Provider Switcher */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTile('voyager')}
            className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-all ${
              activeTile === 'voyager'
                ? 'bg-emerald-500 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Street Map
          </button>
          <button
            onClick={() => setActiveTile('satellite')}
            className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-all ${
              activeTile === 'satellite'
                ? 'bg-emerald-500 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setActiveTile('osm')}
            className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-all ${
              activeTile === 'osm'
                ? 'bg-emerald-500 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Terrain
          </button>
        </div>
      </div>

      {/* Floating Map Navigation Tools (Reset Island & Zoom) */}
      <div className="absolute bottom-5 right-5 z-[400] flex flex-col gap-2 pointer-events-auto">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleResetView}
          className="bg-white/95 text-slate-800 hover:bg-white text-xs font-bold shadow-lg border border-slate-200/80 rounded-xl flex items-center gap-1.5 backdrop-blur-md"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-600" />
          Island View
        </Button>
        <div className="flex flex-col bg-white/95 rounded-xl shadow-lg border border-slate-200/80 overflow-hidden divide-y divide-slate-200 backdrop-blur-md">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="p-2 text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="p-2 text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Floating Hint Overlay */}
      <div className="absolute bottom-5 left-5 z-[400] hidden sm:flex items-center gap-2 bg-slate-950/75 backdrop-blur-md text-[11px] text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800/80 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Click any district pin or use controls to zoom & pan across Sri Lanka</span>
      </div>
    </div>
  );
}
