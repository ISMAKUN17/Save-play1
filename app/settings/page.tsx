'use client';

import { AppShell } from '@/components/dashboard/app-shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataSettings } from '@/components/settings/data-settings';
import { AppearanceSettings } from '@/components/settings/appearance-settings';
import { NotificationsSettings } from '@/components/settings/notifications-settings';
import { AccountSettings } from '@/components/settings/account-settings';
import { Database, Palette, Bell, User, Tags } from 'lucide-react';
import { CategorySettings } from '@/components/settings/category-settings';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Configuración ⚙️</h1>
        <p className="text-muted-foreground">
          Personaliza tu experiencia y gestiona tu cuenta.
        </p>
      </div>

      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto neumorphic-inset p-2 mb-8">
          <TabsTrigger value="data" className="py-2">
            <Database className="w-5 h-5 mr-2" />
            Datos Clave
          </TabsTrigger>
          <TabsTrigger value="appearance" className="py-2">
            <Palette className="w-5 h-5 mr-2" />
            Apariencia
          </TabsTrigger>
          <TabsTrigger value="notifications" className="py-2">
            <Bell className="w-5 h-5 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="categories" className="py-2">
            <Tags className="w-5 h-5 mr-2" />
            Categorías
          </TabsTrigger>
          <TabsTrigger value="account" className="py-2">
            <User className="w-5 h-5 mr-2" />
            Cuenta
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="data">
          <DataSettings />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsSettings />
        </TabsContent>
        <TabsContent value="categories">
            <CategorySettings />
        </TabsContent>
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
