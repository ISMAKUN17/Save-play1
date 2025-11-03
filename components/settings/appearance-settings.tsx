'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useSettings } from '@/context/settings-context';
import { Moon, Sun } from 'lucide-react';

const accentColors = [
  { name: 'primary', label: 'Naranja', color: 'hsl(39, 100%, 50%)' },
  { name: 'blue', label: 'Azul', color: 'hsl(217, 91%, 60%)' },
  { name: 'purple', label: 'Morado', color: 'hsl(262, 84%, 60%)' },
  { name: 'green', label: 'Verde', color: 'hsl(142, 71%, 45%)' },
  { name: 'rose', label: 'Rosa', color: 'hsl(330, 80%, 65%)' },
];

export function AppearanceSettings() {
  const { theme, setTheme, accentColor, setAccentColor } = useSettings();

  const handleThemeChange = (isDark: boolean) => {
    setTheme(isDark ? 'dark' : 'light');
  };

  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle>Apariencia y Personalización</CardTitle>
        <CardDescription>
          Haz que la aplicación se sienta tuya. ¡Dale tu toque personal!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode" className="flex items-center gap-2">
            <Sun className="h-5 w-5" /> / <Moon className="h-5 w-5" />
            Tema de Color
          </Label>
          <Switch
            id="dark-mode"
            checked={theme === 'dark'}
            onCheckedChange={handleThemeChange}
          />
        </div>

        <div className="space-y-4">
          <Label>Selector de Acento</Label>
          <div className="flex items-center gap-4">
            {accentColors.map((color) => (
              <button
                key={color.name}
                aria-label={`Select ${color.label} accent`}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  accentColor === color.name ? 'border-foreground scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.color }}
                onClick={() => setAccentColor(color.name)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emoji-density">Densidad de Emojis</Label>
          <div className="flex items-center gap-4">
            <span className="text-xl">😑</span>
            <Slider
              id="emoji-density"
              defaultValue={[50]}
              max={100}
              step={50}
              className="w-full"
            />
            <span className="text-xl">🎉</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">Bajo / Medio / Alto</p>
        </div>
      </CardContent>
    </Card>
  );
}
