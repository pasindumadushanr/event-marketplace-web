'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Globe, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

export default function BlogEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('slug');

  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(!!slugParam);

  useEffect(() => {
    if (slugParam) {
      fetchPost(slugParam);
    }
  }, [slugParam]);

  const fetchPost = async (postSlug: string) => {
    try {
      const res = await api.get(`/admin/cms/blog/${postSlug}`);
      const data = res.data;
      setId(data.id);
      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt || '');
      setContent(data.content || '');
      setMetaTitle(data.metaTitle || '');
      setMetaDescription(data.metaDescription || '');
      setCoverImageUrl(data.coverImage || '');
    } catch (error) {
      toast.error('Blog post not found');
      router.push('/admin/cms/blog');
    } finally {
      setInitialLoad(false);
    }
  };

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!title || !slug) {
      toast.error('Title and slug are required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('excerpt', excerpt);
      formData.append('content', content);
      formData.append('metaTitle', metaTitle);
      formData.append('metaDescription', metaDescription);
      formData.append('status', status);
      
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }
      
      // Note: axios handles FormData implicitly by setting multipart/form-data
      if (id) {
        await api.patch(`/admin/cms/blog/${id}`, formData);
      } else {
        await api.post('/admin/cms/blog', formData);
      }

      toast.success(`Blog post ${status.toLowerCase()} successfully`);
      router.push('/admin/cms/blog');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!id) {
      // Auto-generate slug
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (initialLoad) {
    return <div className="p-8 text-center text-zinc-500">Loading editor...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{id ? 'Edit Post' : 'Create Post'}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleSave('DRAFT')} disabled={loading}>
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button onClick={() => handleSave('PUBLISHED')} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
            <Globe className="mr-2 h-4 w-4" /> Publish Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Post Title</label>
              <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Enter an engaging title..." className="text-lg font-medium" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Excerpt (Short Summary)</label>
              <textarea 
                className="w-full min-h-[80px] rounded-md border border-zinc-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary that appears on the blog listing..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Post Content</label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <h3 className="font-semibold border-b pb-2">Cover Image</h3>
            <div className="space-y-4">
              {coverImageUrl ? (
                <div className="relative rounded-md overflow-hidden border aspect-video bg-zinc-100 flex items-center justify-center">
                  <img src={coverImageUrl} alt="Cover" className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="aspect-video bg-zinc-50 border border-dashed rounded-md flex flex-col items-center justify-center text-zinc-400">
                  <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                  <span className="text-xs">No image uploaded</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <h3 className="font-semibold border-b pb-2">Post Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">URL Slug</label>
              <div className="flex items-center">
                <span className="bg-zinc-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-zinc-500">/blog/</span>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-l-none" placeholder="awesome-post" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <h3 className="font-semibold border-b pb-2">SEO Metadata</h3>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Meta Title</label>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Title for search engines" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Meta Description</label>
              <textarea 
                className="w-full min-h-[100px] rounded-md border border-zinc-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Brief description for search results..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
