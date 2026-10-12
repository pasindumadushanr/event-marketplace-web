import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { ClassicHomepage } from "@/components/home/ClassicHomepage";
export const metadata = {
  title: "Previous homepage — design comparison",
  robots: { index: false, follow: false },
};
export default function PreviousHomepage() {
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
