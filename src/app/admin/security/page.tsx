'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SecurityPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Security</CardTitle>
          <CardDescription>This module is planned for Phase 2</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-zinc-500">
            <p>Coming Soon 🚀</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
