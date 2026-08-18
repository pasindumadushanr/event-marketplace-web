import { notFound } from 'next/navigation';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

async function getPage(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/cms/public/pages/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
  if (!page) return { title: 'Page Not Found' };
  
  return {
    title: `${page.metaTitle || page.title} | Event Marketplace`,
    description: page.metaDescription || 'Event Marketplace',
  };
}

export default async function DynamicCmsPage({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
  
  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900">
              {page.title}
            </h1>
          </div>

          {/* Render Rich HTML Content */}
          <div 
            className="prose prose-zinc lg:prose-lg mx-auto prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
