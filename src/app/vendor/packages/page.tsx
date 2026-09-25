'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Package as PackageIcon, 
  CheckCircle2,
  Clock,
  Banknote,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  ExternalLink
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const packageSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  duration: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).default('ACTIVE'),
  features: z.array(z.object({ value: z.string().min(1, 'Feature cannot be empty') }))
});

type PackageFormValues = z.infer<typeof packageSchema>;

export default function VendorPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      image: '',
      price: 0,
      duration: '',
      status: 'ACTIVE',
      features: [{ value: '' }]
    }
  });

  const currentImage = watch('image');

  const { fields, append, remove } = useFieldArray({
    name: "features",
    control
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/vendor/packages');
      setPackages(res.data);
    } catch (error) {
      toast.error('Failed to load packages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingId(null);
    reset({
      name: '',
      description: '',
      image: '',
      price: 0,
      duration: '',
      status: 'ACTIVE',
      features: [{ value: '' }]
    });
    setIsModalOpen(true);
  };

  const handleEdit = (pkg: any) => {
    setEditingId(pkg.id);
    reset({
      name: pkg.name,
      description: pkg.description || '',
      image: pkg.image || '',
      price: Number(pkg.price),
      duration: pkg.duration || '',
      status: pkg.status,
      features: pkg.features?.length > 0 ? pkg.features.map((f: string) => ({ value: f })) : [{ value: '' }]
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files (JPG, PNG, WEBP) are allowed');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/vendor/packages/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setValue('image', res.data.url, { shouldValidate: true, shouldDirty: true });
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: PackageFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        features: data.features.map(f => f.value).filter(Boolean)
      };

      if (editingId) {
        await api.patch(`/vendor/packages/${editingId}`, payload);
        toast.success('Package updated successfully');
      } else {
        await api.post('/vendor/packages', payload);
        toast.success('Package created successfully');
      }
      setIsModalOpen(false);
      fetchPackages();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save package');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.delete(`/vendor/packages/${id}`);
      toast.success('Package deleted successfully');
      fetchPackages();
    } catch (error) {
      toast.error('Failed to delete package');
    }
  };

  const toggleStatus = async (pkg: any) => {
    try {
      const newStatus = pkg.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await api.patch(`/vendor/packages/${pkg.id}`, { status: newStatus });
      toast.success(`Package is now ${newStatus.toLowerCase()}`);
      fetchPackages();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Packages, Fleet & Services</h2>
          <p className="text-muted-foreground mt-1 text-slate-500 text-sm">
            Showcase your cars, packages, rooms, or service tiers with photos and pricing. Customers can view item cards and book directly.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm font-semibold">
          <Plus className="h-4 w-4 mr-2" />
          Add Item / Package Card
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-slate-500 py-12">Loading packages...</div>
      ) : packages.length === 0 ? (
        <div className="text-center text-slate-500 py-16 border-2 border-dashed rounded-2xl bg-white shadow-xs">
          <PackageIcon className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No items or packages yet</h3>
          <p className="mb-4 text-sm text-slate-500 max-w-md mx-auto">
            Add vehicle cards, rental items, or service packages with photos so customers can view and book them directly.
          </p>
          <Button onClick={handleCreateNew} variant="outline" className="font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Card
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`flex flex-col relative overflow-hidden transition-all hover:shadow-xl border-slate-200 rounded-2xl ${pkg.status === 'INACTIVE' ? 'opacity-70 bg-slate-50 grayscale-[20%]' : ''}`}>
              
              {/* Image Banner */}
              {pkg.image ? (
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={pkg.image} 
                    alt={pkg.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className={pkg.status === 'ACTIVE' ? 'text-emerald-700 border-emerald-300 bg-white/95 backdrop-blur-md font-bold text-xs' : 'text-slate-500 bg-white/90 text-xs'}>
                      {pkg.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white font-bold text-lg drop-shadow">
                    LKR {Number(pkg.price).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="relative h-32 w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
                  <ImageIcon className="h-10 w-10 text-slate-300" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className={pkg.status === 'ACTIVE' ? 'text-emerald-700 border-emerald-300 bg-white/95 font-bold text-xs' : 'text-slate-500 bg-white/90 text-xs'}>
                      {pkg.status}
                    </Badge>
                  </div>
                </div>
              )}
              
              <CardHeader className="pb-3 pt-4">
                <div className="flex justify-between items-start mb-1">
                  <CardTitle className="text-xl font-black text-slate-900 leading-snug">{pkg.name}</CardTitle>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 rounded-lg" onClick={() => handleEdit(pkg)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 rounded-lg" onClick={() => handleDelete(pkg.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {!pkg.image && (
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-slate-900 font-black text-lg">
                      <Banknote className="h-4 w-4 text-slate-400" />
                      LKR {Number(pkg.price).toLocaleString()}
                    </span>
                  </div>
                )}

                {pkg.duration && (
                  <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {pkg.duration}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="flex-1 pb-4">
                {pkg.description && (
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">{pkg.description}</p>
                )}
                
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Included Features / Specs</h4>
                  {pkg.features?.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feature}</span>
                    </div>
                  ))}
                  {(!pkg.features || pkg.features.length === 0) && (
                    <p className="text-xs text-slate-400 italic">No features listed.</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-3 pb-4 border-t bg-slate-50/70">
                <Button 
                  variant={pkg.status === 'ACTIVE' ? "secondary" : "outline"} 
                  className="w-full text-xs font-bold rounded-xl"
                  onClick={() => toggleStatus(pkg)}
                >
                  {pkg.status === 'ACTIVE' ? 'Deactivate' : 'Activate (Make Visible)'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingId ? 'Edit Item / Package Card' : 'Create Item / Package Card'}
            </DialogTitle>
            <DialogDescription>
              Add a photo, title, pricing, and features. Perfect for car rentals, room bookings, decor themes, or service tiers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 my-4">
            
            {/* Image Upload & Preview Section */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                <span>Item Photo / Image Card (e.g. Car, Venue, Setup)</span>
                {currentImage && (
                  <button 
                    type="button" 
                    onClick={() => setValue('image', '')} 
                    className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <X className="h-3.5 w-3.5" /> Remove Image
                  </button>
                )}
              </label>

              {/* Live Preview Box */}
              {currentImage ? (
                <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-inner">
                  <img src={currentImage} alt="Item Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold shadow"
                    >
                      <Upload className="h-3.5 w-3.5 mr-1.5" /> Replace Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <ImageIcon className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-700 mb-1">
                    Upload a photo of your car, room, or service item
                  </p>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Supports JPG, PNG, WEBP up to 10MB
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-xs font-bold shadow-xs"
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5 mr-1.5" /> Select File from Device
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />

              {/* Direct Image URL input */}
              <div className="pt-1">
                <Input 
                  placeholder="Or paste an image URL (e.g. https://...)" 
                  className="text-xs bg-slate-50/50 h-9"
                  {...register('image')} 
                />
              </div>
            </div>

            {/* Title & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                  Item / Package Title <span className="text-red-500">*</span>
                </label>
                <Input placeholder="e.g. White Mercedes-Benz E-Class Wedding Car" {...register('name')} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                  Price (LKR) <span className="text-red-500">*</span>
                </label>
                <Input type="number" placeholder="45000" {...register('price')} />
                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
              </div>
            </div>

            {/* Duration & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">Rental Duration / Term (Optional)</label>
                <Input placeholder="e.g. 8 Hours / 100km, Per Day, 1 Event" {...register('duration')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">Visibility Status</label>
                <select 
                  className="w-full flex h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  {...register('status')}
                >
                  <option value="ACTIVE">Active (Visible on Storefront)</option>
                  <option value="INACTIVE">Inactive (Hidden Draft)</option>
                </select>
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Description & Details</label>
              <Textarea 
                placeholder="Describe the vehicle condition, chauffeur details, inclusions, terms..." 
                className="resize-none h-24 rounded-xl"
                {...register('description')} 
              />
            </div>

            {/* Features & Specs List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800">Inclusions / Features / Specifications</label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })} className="text-xs font-bold">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Specification
                </Button>
              </div>
              
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <Input 
                      placeholder="e.g. Formal Suit Chauffeur Included, Full AC, White Floral Ribbon" 
                      className="bg-white text-xs"
                      {...register(`features.${index}.value` as const)} 
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-400 hover:text-red-500 shrink-0 h-8 w-8"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {errors.features && <p className="text-xs text-red-500 mt-2">All specification fields must be filled out.</p>}
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving || isUploadingImage} className="bg-slate-900 hover:bg-slate-800 text-white font-bold">
                {isSaving ? 'Saving...' : (editingId ? 'Update Card' : 'Save & Publish Card')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
