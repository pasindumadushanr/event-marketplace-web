'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface Category {
  id: string;
  name: string;
  slug: string;
  status: string;
  sortOrder: number;
  _count: {
    businesses: number;
  };
}

export default function BusinessCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // New Category State
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/business-categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/business-categories/${id}/status`, { status: newStatus });
      toast.success(`Category marked as ${newStatus}`);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/business-categories/${id}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleCreate = async () => {
    if (!newName || !newSlug) {
      toast.error('Name and slug are required');
      return;
    }
    
    try {
      await api.post('/business-categories', {
        name: newName,
        slug: newSlug,
        sortOrder: categories.length + 1
      });
      toast.success('Category created successfully');
      setIsAdding(false);
      setNewName('');
      setNewSlug('');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Business Categories</h2>
          <p className="text-muted-foreground mt-1">Manage vendor categories dynamically</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="mr-2 h-4 w-4" />
          {isAdding ? 'Cancel' : 'Add Category'}
        </Button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-md border shadow-sm flex items-end gap-4 mb-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Category Name</label>
            <Input 
              placeholder="e.g. Fine Dining" 
              value={newName} 
              onChange={(e) => {
                setNewName(e.target.value);
                setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
              }} 
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <Input 
              placeholder="e.g. fine-dining" 
              value={newSlug} 
              onChange={(e) => setNewSlug(e.target.value)} 
            />
          </div>
          <Button onClick={handleCreate}>Save Category</Button>
        </div>
      )}

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Businesses Attached</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading categories...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-zinc-500 font-mono text-sm">{category.slug}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={category.status === 'ACTIVE' ? 'default' : 'secondary'}
                      className={category.status === 'ACTIVE' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      {category.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {category._count.businesses}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-zinc-100 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <div className="px-2 py-1.5 text-sm font-semibold">Actions</div>
                        {category.status === 'ACTIVE' ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(category.id, 'INACTIVE')}>
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusChange(category.id, 'ACTIVE')}>
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(category.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
