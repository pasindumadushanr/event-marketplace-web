import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

async function getBlogPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/cms/public/blog`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export const metadata = {
  title: 'Blog | Event Marketplace',
  description: 'Read our latest articles, news, and event planning tips.',
};

export default async function BlogListingPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">Our Blog</h1>
            <p className="mt-4 text-xl text-zinc-500">
              Insights, news, and tips for event planning and vendor success.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              No blog posts found. Check back later!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200">
                  <div className="aspect-[16/9] w-full bg-zinc-100 overflow-hidden relative">
                    {post.coverImage ? (
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
                    )}
                  </div>
                  
                  <div className="flex-1 p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-zinc-500 text-sm mb-6 line-clamp-3 flex-1">
                      {post.excerpt || 'Read more about this topic...'}
                    </p>
                    
                    <div className="flex items-center text-xs text-zinc-400 gap-4 mt-auto pt-4 border-t border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{post.author ? `${post.author.firstName} ${post.author.lastName}` : 'System'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
