'use client';

import { useState, useEffect } from 'react';
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
  Banknote
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';

const packageSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
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

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      duration: '',
      status: 'ACTIVE',
      features: [{ value: '' }]
    }
  });

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
      price: Number(pkg.price),
      duration: pkg.duration || '',
      status: pkg.status,
      features: pkg.features?.length > 0 ? pkg.features.map((f: string) => ({ value: f })) : [{ value: '' }]
    });
    setIsModalOpen(true);
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
      setPackages(packages.filter(p => p.id !== id));
    } catch (error) {
      toast.error('Failed to delete package');
    }
  };

  const toggleStatus = async (pkg: any) => {
    const newStatus = pkg.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`/vendor/packages/${pkg.id}`, { status: newStatus });
      toast.success(`Package is now ${newStatus.toLowerCase()}`);
      fetchPackages();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Packages & Pricing</h2>
          <p className="text-muted-foreground mt-1 text-slate-500">
            Create structured pricing tiers for your services. Customers can book these directly.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-slate-900 hover:bg-slate-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Package
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-slate-500 py-12">Loading packages...</div>
      ) : packages.length === 0 ? (
        <div className="text-center text-slate-500 py-16 border-2 border-dashed rounded-xl bg-white shadow-sm">
          <PackageIcon className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No packages yet</h3>
          <p className="mb-4">You haven't created any pricing packages for your customers.</p>
          <Button onClick={handleCreateNew} variant="outline">Create Your First Package</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`flex flex-col relative overflow-hidden transition-all hover:shadow-md border-slate-200 ${pkg.status === 'INACTIVE' ? 'opacity-70 bg-slate-50 grayscale-[20%]' : ''}`}>
              <div className={`absolute top-0 left-0 w-full h-1 ${pkg.status === 'ACTIVE' ? 'bg-blue-600' : 'bg-slate-300'}`} />
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={pkg.status === 'ACTIVE' ? 'text-green-600 border-green-200 bg-green-50' : 'text-slate-500'}>
                    {pkg.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => handleEdit(pkg)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(pkg.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-slate-900 font-bold text-lg">
                    <Banknote className="h-4 w-4 text-slate-400" />
                    ${Number(pkg.price).toLocaleString()}
                  </span>
                  {pkg.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {pkg.duration}
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 pb-6">
                {pkg.description && (
                  <p className="text-sm text-slate-600 mb-6">{pkg.description}</p>
                )}
                
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Included Features</h4>
                  {pkg.features?.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {(!pkg.features || pkg.features.length === 0) && (
                    <p className="text-sm text-slate-400 italic">No features listed.</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 border-t bg-slate-50/50">
                <Button 
                  variant={pkg.status === 'ACTIVE' ? "secondary" : "outline"} 
                  className="w-full text-sm font-medium"
                  onClick={() => toggleStatus(pkg)}
                >
                  {pkg.status === 'ACTIVE' ? 'Deactivate Package' : 'Activate Package'}
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
            <DialogTitle>{editingId ? 'Edit Package' : 'Create New Package'}</DialogTitle>
            <DialogDescription>
              Define the price and features for this service package.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 my-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Package Name <span className="text-red-500">*</span></label>
                <Input placeholder="e.g. Gold Photography Tier" {...register('name')} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (USD) <span className="text-red-500">*</span></label>
                <Input type="number" placeholder="500" {...register('price')} />
                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (Optional)</label>
                <Input placeholder="e.g. 4 Hours, 1 Day" {...register('duration')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register('status')}
                >
                  <option value="ACTIVE">Active (Visible)</option>
                  <option value="INACTIVE">Inactive (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Short Description</label>
              <Textarea 
                placeholder="A brief overview of who this package is for..." 
                className="resize-none h-20"
                {...register('description')} 
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Features</label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })}>
                  <Plus className="h-4 w-4 mr-1" /> Add Feature
                </Button>
              </div>
              
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0" />
                    <Input 
                      placeholder="e.g. 500 High-Resolution Photos" 
                      className="bg-white"
                      {...register(`features.${index}.value` as const)} 
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-400 hover:text-red-500 shrink-0"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {errors.features && <p className="text-xs text-red-500 mt-2">All feature fields must be filled out.</p>}
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSaving ? 'Saving...' : 'Save Package'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
