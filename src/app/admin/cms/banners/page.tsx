'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Image as ImageIcon, Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    link: '',
    isActive: true,
    sortOrder: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/cms/banners');
      setBanners(res.data);
    } catch (error) {
      toast.error('Failed to fetch banners');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (banner: any = null) => {
    if (banner) {
      setEditingId(banner.id);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        link: banner.link || '',
        isActive: banner.isActive,
        sortOrder: banner.sortOrder
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        subtitle: '',
        link: '',
        isActive: true,
        sortOrder: 0
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('subtitle', formData.subtitle);
    payload.append('link', formData.link);
    payload.append('isActive', formData.isActive.toString());
    payload.append('sortOrder', formData.sortOrder.toString());
    
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      if (editingId) {
        await api.patch(`/admin/cms/banners/${editingId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Banner updated successfully');
      } else {
        if (!imageFile) {
          toast.error('Image is required for new banners');
          setIsSubmitting(false);
          return;
        }
        await api.post('/admin/cms/banners', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Banner created successfully');
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (error) {
      toast.error('Failed to save banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await api.delete(`/admin/cms/banners/${id}`);
      toast.success('Banner deleted');
      fetchBanners();
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/cms/banners/${id}`, { isActive: !currentStatus });
      fetchBanners();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Manage Banners</h2>
        <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-white">
          Add New Banner
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24">Loading...</TableCell></TableRow>
            ) : banners.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24">No banners found.</TableCell></TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="h-16 w-32 bg-slate-100 rounded overflow-hidden">
                      {banner.imageUrl ? (
                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-full w-full p-4 text-slate-300" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-900">{banner.title}</p>
                    <p className="text-xs text-slate-500">{banner.subtitle}</p>
                  </TableCell>
                  <TableCell>{banner.sortOrder}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={banner.isActive}
                        onCheckedChange={() => toggleStatus(banner.id, banner.isActive)}
                      />
                      <span className="text-sm">{banner.isActive ? 'Active' : 'Hidden'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openModal(banner)}>
                      <Edit className="h-4 w-4 text-slate-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(banner.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Banner' : 'Create Banner'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                required 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <Input 
                value={formData.subtitle} 
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link URL (Optional)</label>
              <Input 
                value={formData.link} 
                onChange={(e) => setFormData({...formData, link: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image {editingId ? '(Leave empty to keep current)' : '*'}</label>
              <Input 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
              />
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <span className="text-sm">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort Order:</label>
                <Input 
                  type="number" 
                  className="w-20"
                  value={formData.sortOrder} 
                  onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})} 
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Banner'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
