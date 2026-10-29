import { Navbar } from "@/components/home/Navbar";
import { SimpleHomepage } from "@/components/home/SimpleHomepage";
import { ClassicHomepage } from "@/components/home/ClassicHomepage";
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
  const classic = settings.general.homepageVersion === "v1";
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
      <Navbar solid={!classic} simple={!classic} />
      <main className="wedding-typography">
        {classic ? <ClassicHomepage /> : <SimpleHomepage />}
      </main>
      <Footer />
    </div>
  );
}
