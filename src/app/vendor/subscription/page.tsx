"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Subscription {
  endDate: string;
  plan: { name: string };
}

export default function VendorSubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  async function load() {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get("/subscriptions/my-subscription");
      setSubscription(response.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    api
      .get("/subscriptions/my-subscription")
      .then((response) => {
        if (active) setSubscription(response.data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">Membership</h1>
      <Card>
        <CardHeader>
          <CardTitle>Paid subscriptions are not available yet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Continue managing your profile, services, and customer inquiries.
            Approved, active vendor profiles can appear in search without
            purchasing a plan during launch.
          </p>
          <p>
            Contact support if you need help with membership or launch access.
          </p>
          <Link
            href="/vendor/support"
            className="inline-flex min-h-12 items-center rounded-xl bg-slate-900 px-5 font-semibold text-white"
          >
            Contact support
          </Link>
        </CardContent>
      </Card>
      {loading ? (
        <p>Loading membership details...</p>
      ) : error ? (
        <div role="alert">
          <p>Could not load your current membership.</p>
          <Button onClick={() => void load()} variant="outline">
            Try again
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Current membership</CardTitle>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <>
                <p>{subscription.plan.name}</p>
                <p className="text-sm text-slate-500">
                  Active until{" "}
                  {new Date(subscription.endDate).toLocaleDateString("en-GB")}
                </p>
              </>
            ) : (
              <p>
                No active membership. This does not prevent an approved, active
                profile from being discovered during launch.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
