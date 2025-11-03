'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Category } from '@/lib/types';

const categorySchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido." }),
  emoji: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  category?: Category | null;
  onSave: (category: Omit<Category, 'id' | 'userId' | 'order'>, id?: string) => Promise<void>;
  children?: React.ReactNode;
  categoryType: 'income' | 'expense';
}

export function CategoryFormDialog({ category, onSave, children, categoryType }: CategoryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEditing = !!category;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name || '',
        emoji: category?.emoji || '',
      });
    }
  }, [open, category, form]);

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    try {
      await onSave({
        name: data.name,
        emoji: data.emoji || '',
      }, category?.id);

      toast({
        title: isEditing ? '¡Categoría Actualizada!' : '¡Categoría Creada!',
        description: `Se ha ${isEditing ? 'actualizado' : 'creado'} la categoría.`,
      });
      setOpen(false);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: isEditing ? 'Error al actualizar' : 'Error al crear',
        description: 'No se pudo guardar la categoría. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const trigger = children ? (
    <DialogTrigger asChild>{children}</DialogTrigger>
  ) : (
    <DialogTrigger asChild>
      <Button className="neumorphic-raised">
        <PlusCircle className="mr-2 h-4 w-4" />
        Añadir Nueva Categoría
      </Button>
    </DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent className="sm:max-w-[425px] glassmorphic">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Categoría' : 'Nueva Categoría de'} {categoryType === 'income' ? 'Ingreso 💰' : 'Gasto ➖💸'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifica los detalles de esta categoría.' : 'Personaliza tus transacciones con nuevas categorías.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Categoría</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Educación 📚" {...field} className="neumorphic-inset" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emoji"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emoji (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 📚" {...field} className="neumorphic-inset" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full neumorphic-raised" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
