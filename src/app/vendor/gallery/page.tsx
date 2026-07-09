'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { UploadCloud, Trash2, Star, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GalleryItem {
  id: string;
  url: string;
  type: string;
  isCover: boolean;
}

export default function VendorGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await api.get('/vendor/gallery');
      setItems(res.data);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const files = Array.from(e.target.files);
    
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} exceeds 5MB limit and was skipped.`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        
        await api.post('/vendor/gallery/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      toast.success('Files uploaded successfully!');
      fetchGallery();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload files');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;
    
    try {
      await api.delete(`/vendor/gallery/${id}`);
      toast.success('Deleted successfully');
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleSetCover = async (id: string) => {
    try {
      await api.patch(`/vendor/gallery/${id}/cover`);
      toast.success('Cover image updated');
      fetchGallery();
    } catch (error) {
      toast.error('Failed to set cover image');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Media Gallery</h2>
          <p className="text-muted-foreground mt-1">
            Upload high-quality images and videos for your customers to see.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 p-12 text-center transition-colors hover:bg-slate-100 hover:border-blue-400 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <UploadCloud className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-700">Click to upload or drag and drop</p>
            <p className="text-sm text-slate-500 mt-1">JPEG, PNG, WEBP or MP4 (Max 5MB)</p>
          </div>
          <Button disabled={isUploading} className="mt-4">
            {isUploading ? 'Uploading...' : 'Browse Files'}
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/jpeg,image/png,image/webp,video/mp4" 
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="text-center text-slate-500 py-8">Loading gallery...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-slate-500 py-12 border rounded-xl bg-white">
          <ImageIcon className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <p>No media uploaded yet. Add some photos to attract customers!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-xl border bg-white shadow-sm overflow-hidden aspect-square">
              {item.type === 'VIDEO' ? (
                <video src={'http://localhost:3000' + item.url} className="w-full h-full object-cover" controls />
              ) : (
                <img src={'http://localhost:3000' + item.url} alt="Gallery" className="w-full h-full object-cover" />
              )}
              
              {item.isCover && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-amber-500 hover:bg-amber-600 border-none shadow-md">
                    <Star className="h-3 w-3 mr-1 fill-current" /> Cover
                  </Badge>
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                {!item.isCover && item.type === 'IMAGE' && (
                  <Button size="sm" variant="secondary" onClick={() => handleSetCover(item.id)}>
                    Set Cover
                  </Button>
                )}
                <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
