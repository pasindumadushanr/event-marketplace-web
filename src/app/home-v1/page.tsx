import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { ClassicHomepage } from "@/components/home/ClassicHomepage";
import { SITE_URL } from "@/lib/site-url";
export const metadata = {
  title: "Home V1 — Original design | Nakathata.lk",
  robots: { index: false, follow: true },
  alternates: { canonical: SITE_URL },
};
export default function HomeV1() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="wedding-typography">
        <ClassicHomepage />
      </main>
      <Footer />
    </div>
  );
}
