import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { FeaturedPackages } from "@/components/home/FeaturedPackages";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Wedding & Event Packages | Nakathata.lk",
  "Explore service packages from Sri Lankan wedding and event vendors.",
  "/packages",
);
export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar solid />
      <main className="wedding-typography pt-28">
        <FeaturedPackages />
      </main>
      <Footer />
    </div>
  );
}
