import { notFound } from 'next/navigation';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

async function getBlogPost(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/cms/public/blog/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: `${post.metaTitle || post.title} | Event Marketplace`,
    description: post.metaDescription || post.excerpt || 'Read this article on Event Marketplace',
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
          </Link>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center text-sm text-zinc-500 gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author ? `${post.author.firstName} ${post.author.lastName}` : 'System'}</span>
              </div>
            </div>
          </div>

          {post.coverImage && (
            <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-md">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Render Rich HTML Content */}
          <div 
            className="prose prose-zinc lg:prose-lg mx-auto prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
