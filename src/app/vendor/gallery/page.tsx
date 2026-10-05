"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UploadCloud, Camera, Image as ImageIcon } from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableGalleryItem } from "./SortableGalleryItem";

interface GalleryItem {
  id: string;
  url: string;
  type: string;
  isCover: boolean;
  sortOrder: number;
}

export default function VendorGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await api.get("/vendor/gallery");
      // Sort items by sortOrder to respect custom drag-and-drop order
      const sortedItems = (res.data || []).sort(
        (a: any, b: any) => a.sortOrder - b.sortOrder,
      );
      setItems(sortedItems);
    } catch (error) {
      toast.error("Failed to load gallery");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading || !e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const files = Array.from(e.target.files);
    let uploaded = 0;
    const errors: string[] = [];
    setUploadErrors([]);
    try {
      for (const [index, file] of files.entries()) {
        setUploadStatus(
          `Uploading ${index + 1} of ${files.length}: ${file.name}`,
        );
        if (
          !["image/jpeg", "image/png", "image/webp", "video/mp4"].includes(
            file.type,
          ) ||
          file.size > 5 * 1024 * 1024
        ) {
          errors.push(
            `${file.name}: choose a JPG, PNG, WEBP or MP4 file up to 5MB.`,
          );
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          await api.post("/vendor/gallery/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          uploaded++;
        } catch {
          errors.push(
            `${file.name}: upload failed. Select this file again to retry.`,
          );
        }
      }
      setUploadErrors(errors);
      setUploadStatus(
        `${uploaded} of ${files.length} files uploaded${errors.length ? ` · ${errors.length} need attention` : ""}.`,
      );
      if (uploaded) {
        toast.success(
          `${uploaded} ${uploaded === 1 ? "file" : "files"} uploaded`,
        );
        await fetchGallery();
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      await api.delete(`/vendor/gallery/${id}`);
      toast.success("Deleted successfully");
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const handleSetCover = async (id: string) => {
    try {
      await api.patch(`/vendor/gallery/${id}/cover`);
      toast.success("Cover image updated");
      fetchGallery();
    } catch (error) {
      toast.error("Failed to set cover image");
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    try {
      await api.patch("/vendor/gallery/reorder", {
        itemIds: newItems.map((item) => item.id),
      });
      toast.success("Gallery reordered successfully");
    } catch (error) {
      toast.error("Failed to save new order");
      fetchGallery(); // Revert on failure
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Media Gallery
          </h2>
          <p className="text-muted-foreground mt-1 text-slate-500">
            Choose photos from your phone or take a new photo. Use Set Cover to
            choose your profile cover; drag the handle to reorder your gallery.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-slate-300 rounded-xl bg-white p-5 sm:p-10 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <UploadCloud className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-700">
              Add photos from your phone
            </p>
            <p className="text-sm text-slate-500 mt-1">
              JPEG, PNG, WEBP or MP4 (Max 5MB)
            </p>
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-center gap-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="min-h-12 bg-slate-900 hover:bg-slate-800 text-white"
            >
              <UploadCloud className="h-4 w-4 mr-2" /> Choose photos or videos
            </Button>
            <Button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isUploading}
              variant="outline"
              className="min-h-12"
            >
              <Camera className="h-4 w-4 mr-2" /> Take a photo
            </Button>
          </div>
          <p className="text-sm text-slate-500">
            You can select several files. On supported phones, Take a photo
            opens your camera. Convert HEIC photos to JPG first.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            disabled={isUploading}
            aria-label="Choose gallery files"
            accept="image/jpeg,image/png,image/webp,video/mp4"
            onChange={handleFileUpload}
          />
          <input
            type="file"
            ref={cameraInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            disabled={isUploading}
            aria-label="Take gallery photo"
            onChange={handleFileUpload}
          />
          {uploadStatus && (
            <p
              role="status"
              className="text-sm font-medium text-slate-700 break-all"
            >
              {uploadStatus}
            </p>
          )}
          {uploadErrors.length > 0 && (
            <ul
              role="alert"
              className="text-sm text-red-700 text-left space-y-2"
            >
              {uploadErrors.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="text-center text-slate-500 py-8">
          Loading gallery...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-slate-500 py-12 border rounded-xl bg-white shadow-sm">
          <ImageIcon className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <p>No media uploaded yet. Add some photos to attract customers!</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {items.map((item) => (
                <SortableGalleryItem
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onSetCover={handleSetCover}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
