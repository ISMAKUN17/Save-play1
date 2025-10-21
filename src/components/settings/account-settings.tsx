'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { KeyRound, Download, Trash2, LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function AccountSettings() {
  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle>Gestión de Cuenta y Seguridad</CardTitle>
        <CardDescription>
          Administra tu información personal y la seguridad de tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="username">Nombre de Usuario</Label>
          <Input id="username" defaultValue="Ahorrador Estrella" className="neumorphic-inset"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input id="email" type="email" defaultValue="user@example.com" disabled className="neumorphic-inset"/>
        </div>

        <Button className="w-full md:w-auto neumorphic-raised">
          <KeyRound className="mr-2 h-4 w-4" />
          Cambiar Contraseña 🔐
        </Button>

        <Separator />

        <div className="space-y-4">
            <h3 className="font-semibold">Zona de Peligro</h3>
             <div className="flex flex-col md:flex-row gap-4">
                <Button variant="outline" className="w-full md:w-auto neumorphic-raised">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Todos mis Datos (Backup) 💾
                </Button>
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full md:w-auto neumorphic-raised">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar Cuenta
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glassmorphic">
                        <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos tus datos de nuestros servidores.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction>Sí, eliminar cuenta</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
             </div>
        </div>

         <Separator />

         <Button variant="ghost" className="w-full md:w-auto text-muted-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
        </Button>
      </CardContent>
    </Card>
  );
}
