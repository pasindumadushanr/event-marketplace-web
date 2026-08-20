'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function VendorSubscriptionPage() {
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subRes, plansRes] = await Promise.all([
        api.get('/subscriptions/my-subscription'),
        api.get('/subscriptions/plans')
      ]);
      setCurrentSub(subRes.data);
      setPlans(plansRes.data.filter((p: any) => p.isActive));
    } catch (error) {
      toast.error('Failed to load subscription details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    try {
      await api.post('/subscriptions/subscribe', { planId });
      toast.success('Successfully subscribed to plan!');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const daysRemaining = currentSub 
    ? differenceInDays(new Date(currentSub.endDate), new Date())
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Membership Plan</h1>
        <p className="text-muted-foreground">Manage your subscription to list services on the platform.</p>
      </div>

      {currentSub ? (
        <Card className={daysRemaining < 5 ? 'border-amber-400' : 'border-primary'}>
          <CardHeader className={daysRemaining < 5 ? 'bg-amber-50' : 'bg-primary/5'}>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {currentSub.plan.name}
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  Active until {format(new Date(currentSub.endDate), 'MMMM dd, yyyy')}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${daysRemaining < 5 ? 'text-amber-600' : 'text-primary'}`}>
                  {daysRemaining}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Days Remaining</div>
              </div>
            </div>
          </CardHeader>
          {daysRemaining < 5 && (
            <CardContent className="pt-6">
              <Alert variant="destructive" className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Expiring Soon!</AlertTitle>
                <AlertDescription>
                  Your membership will expire in {daysRemaining} days. Please renew your plan below to ensure your business remains visible in search results.
                </AlertDescription>
              </Alert>
            </CardContent>
          )}
        </Card>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Active Plan</AlertTitle>
          <AlertDescription>
            You currently do not have an active membership plan. Your business will not appear in search results until you subscribe.
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Upgrade or Renew</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <Card key={plan.id} className={`flex flex-col ${currentSub?.planId === plan.id ? 'border-primary shadow-md relative' : ''}`}>
              {currentSub?.planId === plan.id && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  CURRENT
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.durationDays} Days</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-4xl font-bold mb-6">
                  {Number(plan.price) === 0 ? 'Free' : `LKR ${Number(plan.price).toLocaleString()}`}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={currentSub?.planId === plan.id ? "outline" : "default"}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {currentSub?.planId === plan.id ? 'Renew Plan' : 'Subscribe Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
