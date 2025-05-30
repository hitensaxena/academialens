'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TestImports() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Imports</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Test Button</Button>
      </CardContent>
    </Card>
  );
}
