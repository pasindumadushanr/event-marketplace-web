'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useBusinessProfile } from '@/contexts/BusinessProfileContext';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function FeaturesSettingsPage() {
  const { business, updateBusinessLocally } = useBusinessProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [featureGroups, setFeatureGroups] = useState<{ id: string, groupName: string, features: string[] }[]>([]);

  useEffect(() => {
    if (business) {
      if (business.profileSettings?.features && Array.isArray(business.profileSettings.features)) {
        setFeatureGroups(business.profileSettings.features);
      } else {
        // Fallback to empty if not set
        setFeatureGroups([
          {
            id: '1',
            groupName: 'Venue Amenities',
            features: ['']
          }
        ]);
      }
    }
  }, [business]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up empty features before saving
    const cleanedGroups = featureGroups.map(group => ({
      ...group,
      features: group.features.filter(f => f.trim() !== '')
    })).filter(group => group.groupName.trim() !== '' || group.features.length > 0);

    setIsLoading(true);
    try {
      const payload = {
        profileSettings: {
          features: cleanedGroups
        }
      };
      
      await api.patch('/vendor/business', payload);
      updateBusinessLocally(payload);
      toast.success('Features saved successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save features');
    } finally {
      setIsLoading(false);
    }
  };

  const addGroup = () => {
    setFeatureGroups([...featureGroups, { id: Math.random().toString(), groupName: '', features: [''] }]);
  };

  if (!business) return null;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Business Features</h2>
          <p className="text-slate-500 mt-1">Define the amenities and services your business offers.</p>
        </div>
        <Button type="button" onClick={addGroup} variant="outline" className="border-slate-200">
          <Plus className="h-4 w-4 mr-2" /> Add Feature Group
        </Button>
      </div>

      <div className="space-y-8">
        {featureGroups.map((group, gIndex) => (
          <div key={group.id} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-100/50 p-4 border-b border-slate-200 flex items-center gap-4">
              <Input 
                value={group.groupName}
                onChange={(e) => {
                  const newGroups = [...featureGroups];
                  newGroups[gIndex].groupName = e.target.value;
                  setFeatureGroups(newGroups);
                }}
                placeholder="Group Name (e.g., Equipment, Amenities)" 
                className="font-bold bg-white"
                required
              />
              <Button type="button" variant="ghost" onClick={() => {
                const newGroups = featureGroups.filter((_, idx) => idx !== gIndex);
                setFeatureGroups(newGroups);
              }} className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-3">
              {group.features.map((feature, fIndex) => (
                <div key={fIndex} className="flex items-center gap-2">
                  <Input 
                    value={feature}
                    onChange={(e) => {
                      const newGroups = [...featureGroups];
                      newGroups[gIndex].features[fIndex] = e.target.value;
                      setFeatureGroups(newGroups);
                    }}
                    placeholder="Feature (e.g., Drone Coverage)" 
                    className="bg-white"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => {
                    const newGroups = [...featureGroups];
                    newGroups[gIndex].features = newGroups[gIndex].features.filter((_, idx) => idx !== fIndex);
                    setFeatureGroups(newGroups);
                  }} className="text-slate-400 hover:text-red-500 shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                className="text-primary hover:bg-primary/10 mt-2"
                onClick={() => {
                  const newGroups = [...featureGroups];
                  newGroups[gIndex].features.push('');
                  setFeatureGroups(newGroups);
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Feature
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white min-w-[150px]">
          {isLoading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
        </Button>
      </div>
    </form>
  );
}
