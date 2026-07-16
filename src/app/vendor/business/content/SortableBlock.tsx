'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SortableBlockProps {
  block: any;
  onEdit: (block: any) => void;
  onDelete: (id: string) => void;
}

export function SortableBlock({ block, onEdit, onDelete }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm transition-all ${
        isDragging ? 'border-primary/50 ring-2 ring-primary/20' : 'border-slate-200 hover:border-primary/30 hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab hover:bg-slate-100 p-2 rounded text-slate-400 active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        
        {block.imageUrl && (
          <img src={block.imageUrl} alt={block.title || 'Block Image'} className="w-16 h-16 object-cover rounded-md border bg-slate-50" />
        )}
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{block.title || 'Untitled Section'}</span>
            <Badge variant="outline" className="text-xs px-2 py-0">
              {block.type}
            </Badge>
            {block.status === 'PUBLISHED' ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-2 py-0 text-[10px] flex gap-1">
                <Eye className="h-3 w-3" /> Published
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 px-2 py-0 text-[10px] flex gap-1">
                <EyeOff className="h-3 w-3" /> Draft
              </Badge>
            )}
          </div>
          <span className="text-sm text-slate-500 mt-1">
            Position: <span className="font-medium text-slate-700">{block.position.replace('_', ' ')}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <Button variant="ghost" size="sm" onClick={() => onEdit(block)} className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">
          <Edit2 className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(block.id)} className="text-slate-600 hover:text-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
