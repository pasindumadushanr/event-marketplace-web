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
    return [
      "admin",
      "vendor",
      "account",
      "checkout",
      "auth",
      "login",
      "register",
      "forgot-password",
      "dashboard",
    ].map((route) => ({
      source: `/${route}/:path*`,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
  },
};

export default nextConfig;
