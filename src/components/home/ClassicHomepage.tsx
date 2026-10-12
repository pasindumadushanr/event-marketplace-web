import { Hero } from "./Hero";
import { Statistics } from "./Statistics";
import { WhyChooseUs } from "./WhyChooseUs";
import { CategoryCarousel } from "./CategoryCarousel";
import { FeaturedVendors } from "./FeaturedVendors";
import { FeaturedPackages } from "./FeaturedPackages";
import { LocationGrid } from "./LocationGrid";
import { HowItWorks } from "./HowItWorks";
import { VendorCTA } from "./VendorCTA";

// Preserve the previous composition for comparison and one-setting rollback.
export function ClassicHomepage() {
  return (
    <>
      <Hero />
      <Statistics />
      <CategoryCarousel />
      <FeaturedVendors />
      <WhyChooseUs />
      <FeaturedPackages />
      <LocationGrid />
      <HowItWorks />
      <VendorCTA />
    </>
  );
}
