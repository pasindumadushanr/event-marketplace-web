'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { SortableBlock } from './SortableBlock';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

// Simple dynamic import for React Quill to avoid SSR issues
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function ContentBuilderPage() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<any>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [position, setPosition] = useState('AFTER_ABOUT');
  const [status, setStatus] = useState('DRAFT');
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const res = await api.get('/vendor/business/content');
      setBlocks(res.data);
    } catch (error) {
      toast.error('Failed to load content blocks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    
    const newBlocks = arrayMove(blocks, oldIndex, newIndex);
    setBlocks(newBlocks);

    try {
      await api.patch('/vendor/business/content/reorder', {
        blockIds: newBlocks.map((b) => b.id)
      });
      toast.success('Blocks reordered successfully');
    } catch (error) {
      toast.error('Failed to save new order');
      fetchBlocks(); // Revert on failure
    }
  };

  const handleCreateNew = () => {
    if (blocks.length >= 10) {
      toast.error('You have reached the maximum limit of 10 custom blocks.');
      return;
    }
    setEditingBlock(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setPosition('AFTER_ABOUT');
    setStatus('DRAFT');
    setIsModalOpen(true);
  };

  const handleEdit = (block: any) => {
    setEditingBlock(block);
    setTitle(block.title || '');
    setDescription(block.description || '');
    setImageUrl(block.imageUrl || '');
    setPosition(block.position || 'AFTER_ABOUT');
    setStatus(block.status || 'DRAFT');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        title,
        description,
        imageUrl,
        position,
        status,
        type: 'TEXT' // MVP defaults to TEXT block
      };

      if (editingBlock) {
        await api.patch(`/vendor/business/content/${editingBlock.id}`, payload);
        toast.success('Block updated successfully!');
      } else {
        await api.post('/vendor/business/content', payload);
        toast.success('Block created successfully!');
      }
      setIsModalOpen(false);
      fetchBlocks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save block');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom section?')) return;
    try {
      await api.delete(`/vendor/business/content/${id}`);
      toast.success('Block deleted successfully');
      fetchBlocks();
    } catch (error) {
      toast.error('Failed to delete block');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Content Builder</h2>
          <p className="text-slate-500 mt-1">Add custom sections to your public profile. Drag to reorder.</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-slate-900 hover:bg-slate-800 text-white" disabled={blocks.length >= 10}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section ({blocks.length}/10)
        </Button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 min-h-[400px]">
        {blocks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 pt-20">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Plus className="h-8 w-8 text-slate-300" />
            </div>
            <p>No custom sections added yet.</p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={blocks.map(b => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {blocks.map((block) => (
                  <SortableBlock 
                    key={block.id} 
                    block={block} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Editor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBlock ? 'Edit Section' : 'Create Custom Section'}</DialogTitle>
            <DialogDescription>
              Build a custom section to display on your profile.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Section Title</label>
              <Input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g. Our Awards & Recognition" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Display Position</label>
                <select 
                  className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                >
                  <option value="BEFORE_ABOUT">Before About Section</option>
                  <option value="AFTER_ABOUT">After About Section</option>
                  <option value="BEFORE_GALLERY">Before Gallery</option>
                  <option value="AFTER_PACKAGES">After Packages</option>
                  <option value="AT_BOTTOM">At the Bottom</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Publish Status</label>
                <select 
                  className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="DRAFT">Draft (Hidden)</option>
                  <option value="PUBLISHED">Published (Live)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Description (Rich Text)</label>
              <div className="border rounded-md bg-white">
                <ReactQuill 
                  theme="snow" 
                  value={description} 
                  onChange={setDescription} 
                  className="h-48 mb-12"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Optional Image URL</label>
              <Input 
                value={imageUrl} 
                onChange={e => setImageUrl(e.target.value)} 
                placeholder="https://..." 
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSaving ? 'Saving...' : 'Save Section'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
