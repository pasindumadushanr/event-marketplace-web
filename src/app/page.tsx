import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { Statistics } from "@/components/home/Statistics";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { FeaturedVendors } from "@/components/home/FeaturedVendors";
import { FeaturedPackages } from "@/components/home/FeaturedPackages";
import { LocationGrid } from "@/components/home/LocationGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { VendorCTA } from "@/components/home/VendorCTA";
import { Footer } from "@/components/home/Footer";
import { pageMetadata, BRAND_DESCRIPTION } from "@/lib/seo";
import { getPlatformSettings } from "@/lib/platform-settings-server";

export async function generateMetadata() {
  const { seo, general } = await getPlatformSettings();
  const result = pageMetadata(
    seo.metaTitle,
    seo.metaDescription || BRAND_DESCRIPTION,
    "/",
  );
  return {
    ...result,
    openGraph: { ...result.openGraph, siteName: general.siteName },
  };
}

const brandStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://nakathata.lk/#website",
      name: "Nakathata.lk",
      alternateName: "Nakathata",
      url: "https://nakathata.lk/",
      publisher: { "@id": "https://nakathata.lk/#organization" },
    },
  ],
};

export default async function HomePage() {
  const settings = await getPlatformSettings();
  return (
    <div className="min-h-screen bg-background font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...brandStructuredData,
            "@graph": brandStructuredData["@graph"].map((item) => ({
              ...item,
              name: settings.general.siteName,
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="wedding-typography">
        <Hero />
        <Statistics />
        <CategoryCarousel />
        <FeaturedVendors />
        <WhyChooseUs />
        <FeaturedPackages />
        <LocationGrid />
        <HowItWorks />
        <VendorCTA />
      </main>
      <Footer />
    </div>
  );
}
