'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function AdminSubscriptionPlansPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role?.name === 'SUPER_ADMIN';

  const [plans, setPlans] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>({
    name: '',
    description: '',
    price: 0,
    durationDays: 30,
    features: [''],
    isActive: true
  });

  const fetchPlans = async () => {
    try {
      const res = await api.get('/subscriptions/plans');
      setPlans(res.data);
    } catch (error) {
      toast.error('Failed to load subscription plans');
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSave = async () => {
    try {
      if (currentPlan.id) {
        await api.put(`/subscriptions/plans/${currentPlan.id}`, currentPlan);
        toast.success('Plan updated successfully');
      } else {
        await api.post('/subscriptions/plans', currentPlan);
        toast.success('Plan created successfully');
      }
      setIsEditing(false);
      fetchPlans();
    } catch (error) {
      toast.error('Failed to save plan');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground">Manage the membership packages available to vendors.</p>
        </div>
        {isSuperAdmin && (
          <Button onClick={() => {
            setCurrentPlan({ name: '', description: '', price: 0, durationDays: 30, features: [''], isActive: true });
            setIsEditing(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> Add Plan
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{currentPlan.id ? 'Edit Plan' : 'Create New Plan'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan Name</Label>
                <Input value={currentPlan.name} onChange={(e) => setCurrentPlan({...currentPlan, name: e.target.value})} placeholder="e.g. Free Trial" />
              </div>
              <div className="space-y-2">
                <Label>Price (LKR)</Label>
                <Input type="number" value={currentPlan.price} onChange={(e) => setCurrentPlan({...currentPlan, price: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Duration (Days)</Label>
                <Input type="number" value={currentPlan.durationDays} onChange={(e) => setCurrentPlan({...currentPlan, durationDays: Number(e.target.value)})} />
              </div>
              <div className="space-y-2 flex flex-col justify-center">
                <Label className="mb-2">Status (Active)</Label>
                <Switch checked={currentPlan.isActive} onCheckedChange={(c) => setCurrentPlan({...currentPlan, isActive: c})} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={currentPlan.description} onChange={(e) => setCurrentPlan({...currentPlan, description: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label>Features (Comma separated)</Label>
              <Textarea 
                value={currentPlan.features.join(', ')} 
                onChange={(e) => setCurrentPlan({...currentPlan, features: e.target.value.split(',').map(f => f.trim())})} 
                placeholder="e.g. 5 Listings, Priority Support"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Plan</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <Card key={plan.id} className={!plan.isActive ? 'opacity-60' : ''}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {plan.name}
                  {isSuperAdmin && (
                    <Button variant="ghost" size="icon" onClick={() => { setCurrentPlan(plan); setIsEditing(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>{plan.durationDays} Days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">LKR {Number(plan.price).toLocaleString()}</div>
                <ul className="space-y-2 mb-4 text-sm text-slate-600">
                  {plan.features.map((f: string, i: number) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
                {!plan.isActive && <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs font-bold">INACTIVE</span>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
