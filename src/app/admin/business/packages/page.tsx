'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    features: '',
    isActive: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/package-templates');
      setPackages(res.data);
    } catch (error) {
      toast.error('Failed to load package templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (pkg?: any) => {
    if (pkg) {
      setEditingId(pkg.id);
      setFormData({
        name: pkg.name,
        description: pkg.description || '',
        price: pkg.price.toString(),
        features: pkg.features.join('\n'),
        isActive: pkg.isActive
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        features: '',
        isActive: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        features: formData.features.split('\n').filter(f => f.trim() !== '')
      };

      if (editingId) {
        await api.patch(`/package-templates/${editingId}`, payload);
        toast.success('Package template updated');
      } else {
        await api.post('/package-templates', payload);
        toast.success('Package template created');
      }
      setIsDialogOpen(false);
      fetchPackages();
    } catch (error) {
      toast.error('Failed to save package template');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await api.delete(`/package-templates/${id}`);
      toast.success('Template deleted');
      fetchPackages();
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Global Package Templates</h2>
          <p className="text-muted-foreground">Manage predefined package structures for vendors.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Template
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price (LKR)</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                    Loading templates...
                  </TableCell>
                </TableRow>
              ) : packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                    No package templates found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">
                      {pkg.name}
                      <p className="text-xs text-muted-foreground line-clamp-1">{pkg.description}</p>
                    </TableCell>
                    <TableCell>{Number(pkg.price).toLocaleString()}</TableCell>
                    <TableCell>{pkg.features.length} items</TableCell>
                    <TableCell>
                      <Badge variant={pkg.isActive ? 'default' : 'secondary'}>
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(pkg)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(pkg.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Package Template' : 'Create Package Template'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Suggested Price (LKR)</Label>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Features (One per line)</Label>
                <Textarea 
                  value={formData.features}
                  onChange={e => setFormData({...formData, features: e.target.value})}
                  rows={5}
                  placeholder="Photography&#10;Videography&#10;Drone shots"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({...formData, isActive: e.target.checked})}
                />
                <Label htmlFor="isActive">Active (Visible to vendors)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Save Changes' : 'Create Template'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
