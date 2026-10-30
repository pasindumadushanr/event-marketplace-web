import type { NextConfig } from "next";
import { SITE_URL } from "./src/lib/site-url";

const nextConfig: NextConfig = {
  async redirects() {
    if (process.env.LEGACY_DOMAIN_REDIRECT === "false") return [];
    if (
      !["nakathata.lk", "www.nakathata.lk"].includes(new URL(SITE_URL).hostname)
    )
      throw new Error(
        "Enable the legacy-domain redirect only after setting the working Nakathata.lk canonical domain",
      );
    return [
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "(www\\.)?luxeevents\\.fun" }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "www.nakathata.lk" }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    const noindex = [
      "admin",
      "vendor",
      "account",
      "checkout",
      "auth",
      "login",
      "register",
      "forgot-password",
      "dashboard",
      "invitation-studio",
      "invitation-review",
      "wedding",
      "invitation-assets",
    ].map((route) => ({
      source: `/${route}/:path*`,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
    return [
      ...noindex,
      {
        source: "/invitation-assets/:path*",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://res.cloudinary.com https://images.unsplash.com; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
