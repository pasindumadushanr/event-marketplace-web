import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { SimpleHomepage } from "@/components/home/SimpleHomepage";
import { SITE_URL } from "@/lib/site-url";
export const metadata = {
  title: "Home V2 — Simple design | Nakathata.lk",
  robots: { index: false, follow: true },
  alternates: { canonical: SITE_URL },
};
export default function HomeV2() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar solid simple />
      <main className="wedding-typography pt-11 xl:pt-0">
        <SimpleHomepage />
      </main>
      <Footer />
    </div>
  );
}
