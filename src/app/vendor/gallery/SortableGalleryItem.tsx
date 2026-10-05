"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, Star, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SortableGalleryItemProps {
  item: any;
  onDelete: (id: string) => void;
  onSetCover: (id: string) => void;
}

export function SortableGalleryItem({
  item,
  onDelete,
  onSetCover,
}: SortableGalleryItemProps) {
  const mediaUrl = /^https?:\/\//i.test(item.url)
    ? item.url
    : `${process.env.NEXT_PUBLIC_API_URL || "https://event-marketplace-api.onrender.com"}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border bg-white shadow-sm overflow-hidden aspect-square ${
        isDragging ? "ring-4 ring-primary/50" : ""
      }`}
    >
      {item.type === "VIDEO" ? (
        <video
          src={mediaUrl}
          className="w-full h-full object-cover"
          controls={false}
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          src={mediaUrl}
          alt="Uploaded gallery photo"
          className="w-full h-full object-cover"
        />
      )}

      {item.isCover && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-amber-500 hover:bg-amber-600 border-none shadow-md text-white">
            <Star className="h-3 w-3 mr-1 fill-current" /> Cover
          </Badge>
        </div>
      )}

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity flex flex-col justify-between p-2 ${isDragging ? "opacity-0" : "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"}`}
      >
        {/* Top bar: Drag Handle */}
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Drag to reorder photo"
            {...attributes}
            {...listeners}
            className="touch-none min-h-11 min-w-11 cursor-grab active:cursor-grabbing bg-black/50 text-white p-2 rounded-lg hover:bg-black/80 transition-colors"
          >
            <GripHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Bottom bar: Actions */}
        <div className="flex items-center justify-between gap-2">
          {!item.isCover && item.type === "IMAGE" ? (
            <Button
              size="sm"
              variant="secondary"
              className="min-h-11 w-full font-medium"
              onClick={() => onSetCover(item.id)}
            >
              Set Cover
            </Button>
          ) : (
            <div className="flex-1"></div>
          )}
          <Button
            size="icon"
            variant="destructive"
            aria-label="Delete photo"
            className="min-h-11 min-w-11 shrink-0"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
