import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/vendor/",
        "/vendor$",
        "/account",
        "/checkout",
        "/auth",
        "/login",
        "/register",
        "/forgot-password",
        "/dashboard",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
