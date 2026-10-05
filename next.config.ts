import type { NextConfig } from "next";
import { SITE_URL } from "./src/lib/site-url";

const nextConfig: NextConfig = {
  async redirects() {
    if (process.env.LEGACY_DOMAIN_REDIRECT !== "true") return [];
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
    ];
  },
};

export default nextConfig;
