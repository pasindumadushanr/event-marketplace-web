'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Globe } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

export default function PageEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('slug');

  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(!!slugParam);

  useEffect(() => {
    if (slugParam) {
      fetchPage(slugParam);
    }
  }, [slugParam]);

  const fetchPage = async (pageSlug: string) => {
    try {
      const res = await api.get(`/admin/cms/pages/${pageSlug}`);
      const data = res.data;
      setId(data.id);
      setTitle(data.title);
      setSlug(data.slug);
      setContent(data.content || '');
      setMetaTitle(data.metaTitle || '');
      setMetaDescription(data.metaDescription || '');
    } catch (error) {
      toast.error('Page not found');
      router.push('/admin/cms/pages');
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
      const payload = { title, slug, content, metaTitle, metaDescription, status };
      
      if (id) {
        await api.patch(`/admin/cms/pages/${id}`, payload);
      } else {
        await api.post('/admin/cms/pages', payload);
      }

      toast.success(`Page ${status.toLowerCase()} successfully`);
      router.push('/admin/cms/pages');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save page');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!id) {
      // Auto-generate slug for new pages
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
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
            <h1 className="text-2xl font-bold tracking-tight">{id ? 'Edit Page' : 'Create Page'}</h1>
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
              <label className="block text-sm font-medium text-zinc-700 mb-1">Page Title</label>
              <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. About Us" className="text-lg font-medium" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Page Content</label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <h3 className="font-semibold border-b pb-2">Page Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">URL Slug</label>
              <div className="flex items-center">
                <span className="bg-zinc-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-zinc-500">/</span>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-l-none" placeholder="about-us" />
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
