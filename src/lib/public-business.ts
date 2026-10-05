import "server-only";
import { cache } from "react";
import { PUBLIC_API_URL } from "./site-url";
export const getPublicBusiness = cache(async (slug: string) => {
  const response = await fetch(
    `${PUBLIC_API_URL}/discovery/vendors/${encodeURIComponent(slug)}`,
    { cache: "no-store", signal: AbortSignal.timeout(10000) },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Business profile API unavailable");
  return response.json();
});
