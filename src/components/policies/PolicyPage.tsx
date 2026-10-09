import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { policyDefaults, PolicyPage as PageData } from "@/data/policies";
import { PolicyContent } from "./PolicyContent";

export async function loadPublishedPolicy(slug: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/admin/cms/public/pages/${slug}`,
    { next: { revalidate: 60 }, signal: AbortSignal.timeout(15000) },
  );
  // Non-404 failures fail ISR regeneration, preserving the last successful page.
  let page: PageData = policyDefaults[slug];
  if (response.ok) {
    const data = await response.json();
    if (
      data.slug !== slug ||
      typeof data.content !== "string" ||
      typeof data.title !== "string" ||
      !Number.isFinite(Date.parse(data.updatedAt))
    )
      throw new Error("Invalid published policy");
    page = data;
  } else if (response.status !== 404)
    throw new Error("Published policy is temporarily unavailable");
  return page;
}

export async function PolicyPage({ slug }: { slug: string }) {
  const page = await loadPublishedPolicy(slug);
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      <Navbar solid />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-36 lg:pt-32 pb-12 sm:pb-16">
        <PolicyContent initial={page} />
      </main>
      <Footer />
    </div>
  );
}
