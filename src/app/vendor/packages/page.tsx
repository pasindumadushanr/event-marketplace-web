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
  Sparkles,
  Car,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const SAMPLE_PRESETS = [
  { label: '🚗 White Mercedes-Benz', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80' },
  { label: '🚘 Vintage Rolls-Royce', url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80' },
  { label: '🚐 Luxury Wedding Van', url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80' },
  { label: '🏰 Banquet Hall Room', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80' },
  { label: '🌸 Floral Mandap Setup', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80' },
];

const QUICK_SPECS = [
  'Uniformed Chauffeur Included',
  'Full Air Conditioned',
  'Silk Ribbon & Flower Bonnet Deco',
  '100km / 8 Hours Included',
  'Fuel & Driver Allowance Covered',
  'Luxury Leather Interior',
  'Backup Vehicle on Standby',
];

const DURATION_PRESETS = [
  '8 Hours / 100km',
  'Full Day Rental',
  'Per Day',
  'Per Event'
];

const packageSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  duration: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).default('ACTIVE'),
  features: z.array(z.object({ value: z.string() })).optional().default([])
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
      price: '' as any,
      duration: '',
      status: 'ACTIVE',
      features: [{ value: '' }]
    }
  });

  const currentImage = watch('image');
  const currentDuration = watch('duration');

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
      price: '' as any,
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
      
      let uploadUrl = '';
      try {
        const res = await api.post('/vendor/packages/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadUrl = res.data.url;
      } catch (err: any) {
        // Fallback to /vendor/business/upload which is active on production Render backend
        const fallbackRes = await api.post('/vendor/business/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadUrl = fallbackRes.data.url;
      }

      if (uploadUrl) {
        setValue('image', uploadUrl, { shouldValidate: true, shouldDirty: true });
        toast.success('Photo uploaded successfully');
      } else {
        throw new Error('Failed to retrieve photo URL');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload photo. You can also paste an image URL directly.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddQuickSpec = (spec: string) => {
    // If the only field is empty, populate it; otherwise append
    if (fields.length === 1 && !watch('features.0.value')) {
      setValue('features.0.value', spec, { shouldValidate: true, shouldDirty: true });
    } else {
      append({ value: spec });
    }
  };

  const onSubmit = async (data: PackageFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        price: Number(data.price) || 0,
        features: (data.features || []).map(f => f.value.trim()).filter(Boolean)
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
    <div className="space-y-8 max-w-6xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Packages, Fleet & Services</h2>
          <p className="text-muted-foreground mt-1 text-slate-500 text-sm">
            Showcase your cars, packages, rooms, or service tiers with photos and pricing. Customers can view item cards and book directly.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm font-semibold rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Add Item / Package Card
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-slate-500 py-12">Loading packages...</div>
      ) : packages.length === 0 ? (
        <div className="text-center text-slate-500 py-16 border-2 border-dashed rounded-3xl bg-white shadow-xs p-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Car className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No cars or service items added yet</h3>
          <p className="mb-6 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Add vehicle cards, rental items, or service packages with photos so customers can view and book them directly from your storefront.
          </p>
          <Button onClick={handleCreateNew} className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md px-6">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Item Card
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`flex flex-col relative overflow-hidden transition-all hover:shadow-xl border-slate-200 rounded-3xl ${pkg.status === 'INACTIVE' ? 'opacity-70 bg-slate-50 grayscale-[20%]' : ''}`}>
              
              {/* Image Banner */}
              {pkg.image ? (
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={pkg.image} 
                    alt={pkg.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className={pkg.status === 'ACTIVE' ? 'text-emerald-700 border-emerald-300 bg-white/95 backdrop-blur-md font-bold text-xs' : 'text-slate-500 bg-white/90 text-xs'}>
                      {pkg.status === 'ACTIVE' ? '🟢 Active' : '⚪ Draft'}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white font-black text-xl drop-shadow">
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
                  <CardTitle className="text-lg font-bold text-slate-900 leading-snug">{pkg.name}</CardTitle>
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
                  variant="outline" 
                  size="sm" 
                  className={`w-full text-xs font-semibold rounded-xl ${pkg.status === 'ACTIVE' ? 'border-amber-200 text-amber-700 hover:bg-amber-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}
                  onClick={() => toggleStatus(pkg)}
                >
                  {pkg.status === 'ACTIVE' ? <EyeOff className="h-3.5 w-3.5 mr-1.5" /> : <Eye className="h-3.5 w-3.5 mr-1.5" />}
                  {pkg.status === 'ACTIVE' ? 'Deactivate (Hide from Store)' : 'Activate (Show on Store)'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border-slate-200 shadow-2xl">
          <DialogHeader className="pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  {editingId ? 'Edit Item / Package Card' : 'Create Item / Package Card'}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Add photos and pricing for your cars, banquet rooms, decor packages, or equipment.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 my-2">
            
            {/* STEP 1: PHOTO */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                    Item Photo (Car, Venue, Room, or Setup)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload from your device or paste a web photo link.
                  </p>
                </div>
                {currentImage && (
                  <button 
                    type="button" 
                    onClick={() => setValue('image', '')} 
                    className="text-xs text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <X className="h-3.5 w-3.5" /> Remove Photo
                  </button>
                )}
              </div>

              {/* Live Preview Box */}
              {currentImage ? (
                <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm group">
                  <img src={currentImage} alt="Item Preview" className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                    <Check className="h-3 w-3" /> Photo Ready
                  </div>
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold shadow rounded-xl"
                    >
                      <Upload className="h-3.5 w-3.5 mr-1.5" /> Replace Photo
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="destructive"
                      onClick={() => setValue('image', '')}
                      className="text-xs font-bold shadow rounded-xl"
                    >
                      <X className="h-3.5 w-3.5 mr-1.5" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-white hover:border-slate-400 transition-colors">
                  <ImageIcon className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-800 mb-1">
                    Upload photo from your computer or phone
                  </p>
                  <p className="text-xs text-slate-400 mb-4">
                    Supports JPG, PNG, WEBP files up to 10MB
                  </p>
                  <Button 
                    type="button" 
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow rounded-xl px-5"
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading to Cloud...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" /> Select File from Device
                      </>
                    )}
                  </Button>
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
              <div className="pt-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Or paste an image web link (URL):
                </label>
                <Input 
                  placeholder="https://images.unsplash.com/..." 
                  className="text-xs bg-white h-9 rounded-xl border-slate-200"
                  {...register('image')} 
                />
              </div>

              {/* Quick sample demo presets for instant testing */}
              <div className="pt-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Or pick a sample photo for quick testing:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setValue('image', preset.url, { shouldValidate: true, shouldDirty: true })}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 font-medium transition-all shadow-2xs"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 2: TITLE & PRICE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                  Item / Package Title <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="e.g. White Mercedes-Benz E-Class Wedding Car" 
                  className="rounded-xl border-slate-200" 
                  {...register('name')} 
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">3</span>
                  Price in Rupees (LKR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-slate-400">
                    LKR
                  </div>
                  <Input 
                    type="number" 
                    placeholder="45000" 
                    className="pl-12 rounded-xl border-slate-200 font-semibold" 
                    {...register('price')} 
                  />
                </div>
                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
              </div>
            </div>

            {/* STEP 3: DURATION & VISIBILITY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">
                  Rental Duration or Terms (Optional)
                </label>
                <Input 
                  placeholder="e.g. 8 Hours / 100km, Full Day, Per Event" 
                  className="rounded-xl border-slate-200" 
                  {...register('duration')} 
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {DURATION_PRESETS.map((dur, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setValue('duration', dur, { shouldValidate: true, shouldDirty: true })}
                      className={`text-[11px] px-2 py-0.5 rounded-md border font-medium transition-colors ${currentDuration === dur ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">
                  Storefront Visibility
                </label>
                <select 
                  className="w-full flex h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium"
                  {...register('status')}
                >
                  <option value="ACTIVE">🟢 Active (Visible to Customers)</option>
                  <option value="INACTIVE">⚪ Draft (Hidden from Storefront)</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  You can toggle this on or off anytime.
                </p>
              </div>
            </div>

            {/* STEP 4: DESCRIPTION */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">
                Description & Inclusions (Optional)
              </label>
              <Textarea 
                placeholder="Describe the vehicle condition, chauffeur attire, decorations, fuel policy, or terms..." 
                className="resize-none h-20 rounded-xl border-slate-200 text-sm leading-relaxed" 
                {...register('description')} 
              />
            </div>

            {/* STEP 5: SPECIFICATIONS CHECKLIST */}
            <div className="space-y-2.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Key Features / Inclusions Checklist
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Add bullet points so customers know exactly what is included.
                  </p>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ value: '' })} 
                  className="text-xs font-bold rounded-lg bg-white shadow-2xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Custom
                </Button>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {QUICK_SPECS.map((spec, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddQuickSpec(spec)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-amber-400 hover:bg-amber-50 font-medium transition-colors shadow-2xs"
                  >
                    + {spec}
                  </button>
                ))}
              </div>
              
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <Input 
                      placeholder="e.g. Uniformed Chauffeur, Fuel Included, AC..." 
                      className="bg-white text-xs rounded-xl border-slate-200"
                      {...register(`features.${index}.value` as const)} 
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-400 hover:text-red-500 shrink-0 h-8 w-8 rounded-lg"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-between sm:justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving || isUploadingImage} 
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6 shadow-md"
              >
                {isSaving ? 'Saving...' : (editingId ? 'Update Card' : 'Save & Publish Card')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
