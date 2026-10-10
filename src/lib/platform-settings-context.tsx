"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  DEFAULT_PLATFORM,
  isPlatformSettings,
  analyticsId,
  type PlatformSettings,
} from "./platform-settings";
const Context = createContext<PlatformSettings>(DEFAULT_PLATFORM);
const AnalyticsReady = createContext(false);
export function PlatformSettingsProvider({
  initial,
  children,
}: {
  initial: PlatformSettings;
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/admin/cms/public/platform-settings`,
      { cache: "no-store", signal: AbortSignal.timeout(10000) },
    )
      .then(async (res) => (res.ok ? res.json() : null))
      .then((value: unknown) => {
        if (active && isPlatformSettings(value)) setSettings(value);
      })
      .catch(() => {
        /* Retain last server-provided settings. */
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <Context.Provider value={settings}>
      <AnalyticsReady.Provider value={ready}>
        {children}
      </AnalyticsReady.Provider>
    </Context.Provider>
  );
}
export const usePlatformSettings = () => useContext(Context);
export function PlatformAnalytics() {
  const settings = usePlatformSettings();
  const ready = useContext(AnalyticsReady);
  const id = analyticsId(settings, process.env.NEXT_PUBLIC_GA_ID);
  return ready && id ? <GoogleAnalytics key={id} gaId={id} /> : null;
}
