'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, Edit, Trash2, Search, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/api';

interface PageData {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
}

export default function CmsPagesAdmin() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await api.get('/admin/cms/pages');
      setPages(res.data);
    } catch (error) {
      console.error('Failed to fetch pages:', error);
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      await api.delete(`/admin/cms/pages/${id}`);
      toast.success('Page deleted');
      fetchPages();
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pages</h1>
          <p className="text-sm text-zinc-500">Manage dynamic website pages like About Us, Terms, etc.</p>
        </div>
        <Button onClick={() => router.push('/admin/cms/pages/editor')} className="bg-zinc-950 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create Page
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search pages..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50">
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-zinc-500">Loading pages...</TableCell>
              </TableRow>
            ) : filteredPages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-zinc-300 mb-3" />
                  <p className="text-zinc-500 font-medium">No pages found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-zinc-500 text-sm">/{page.slug}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      page.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {page.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {new Date(page.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => window.open(`/${page.slug}`, '_blank')} title="View Live">
                        <ExternalLink className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/cms/pages/editor?slug=${page.slug}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(page.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
