import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Terms of Service | Nakathata.lk",
  "Read the terms for using Nakathata.lk, vendor listings, inquiries and bookings.",
  "/terms",
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
