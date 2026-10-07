import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Wedding Vendors by District in Sri Lanka | Nakathata.lk",
  "Explore all 25 Sri Lankan districts to find wedding venues and event professionals near your celebration, from Colombo and Kandy to Galle and Jaffna.",
  "/locations",
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
