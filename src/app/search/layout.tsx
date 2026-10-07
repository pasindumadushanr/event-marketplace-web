import { pageMetadata } from "@/lib/seo";
export const metadata = {
  ...pageMetadata(
    "Find Wedding Vendors in Sri Lanka | Nakathata.lk",
    "Search wedding and event vendors by category and location. Compare services and contact businesses on Nakathata.lk.",
    "/search",
  ),
  robots: { index: false, follow: true },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
