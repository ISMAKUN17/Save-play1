'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

const timezones = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney', 'America/Santo_Domingo'
];

export function DataSettings() {
  const [useAutoRate, setUseAutoRate] = useState(true);

  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle>Datos Clave</CardTitle>
        <CardDescription>
          Gestiona la configuración fundamental de tus datos financieros.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="base-currency">Moneda Base 💲</Label>
          <Select defaultValue="USD">
            <SelectTrigger id="base-currency" className="w-full md:w-1/2 neumorphic-inset">
              <SelectValue placeholder="Selecciona una moneda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
              <SelectItem value="DOP">DOP - Peso Dominicano</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
            </SelectContent>
          </Select>
          <Alert variant="destructive" className="bg-amber-100/50 dark:bg-amber-900/30 border-amber-300/50 text-amber-800 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 !text-amber-500" />
            <AlertTitle>Advertencia</AlertTitle>
            <AlertDescription>
              Cambiar la moneda base recalculará todos los totales y balances.
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-4">
          <Label>Tasa de Conversión</Label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch id="conversion-rate" checked={useAutoRate} onCheckedChange={setUseAutoRate} />
              <Label htmlFor="conversion-rate">Automática 🤖</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="manual-rate-switch" checked={!useAutoRate} onCheckedChange={(checked) => setUseAutoRate(!checked)} />
              <Label htmlFor="manual-rate-switch">Manual ✍️</Label>
            </div>
          </div>
          {!useAutoRate && (
            <div className="flex items-center space-x-2 pt-2">
              <Input type="number" placeholder="1" disabled className="w-16 neumorphic-inset" />
              <span className="font-bold">USD</span>
              <span>=</span>
              <Input type="number" placeholder="59.00" className="w-24 neumorphic-inset" />
              <span className="font-bold">DOP</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Zona Horaria ⏰</Label>
          <Select defaultValue="America/Santo_Domingo">
            <SelectTrigger id="timezone" className="w-full md:w-1/2 neumorphic-inset">
              <SelectValue placeholder="Selecciona una zona horaria" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map(tz => (
                <SelectItem key={tz} value={tz}>{tz.replace(/_/g, ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
