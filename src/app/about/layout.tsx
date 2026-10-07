import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "About Nakathata.lk | Sri Lanka Wedding & Event Marketplace",
  "Learn about Nakathata.lk, connecting customers with wedding venues and event service providers across Sri Lanka.",
  "/about",
);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
