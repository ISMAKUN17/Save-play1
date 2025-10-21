'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

export function NotificationsSettings() {
  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle>Notificaciones y Motivación</CardTitle>
        <CardDescription>
          Configura cómo quieres que te mantengamos motivado y al día.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Label>Notificaciones de Metas 🏆</Label>
          <div className="flex items-center space-x-2">
            <Checkbox id="due-date-alert" />
            <Label htmlFor="due-date-alert">Alertarme cuando una fecha límite esté cerca</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="goal-completed-alert" />
            <Label htmlFor="goal-completed-alert">Celebrar cuando complete una meta</Label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="daily-tips" className="flex-grow">
            Tips de Super Ahorro 🧠💡
            <p className="text-sm text-muted-foreground font-normal">Recibe un consejo de ahorro personalizado cada día.</p>
          </Label>
          <Switch id="daily-tips" />
        </div>
      </CardContent>
    </Card>
  );
}
