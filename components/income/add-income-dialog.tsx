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
import { Loader2, PlusCircle } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from '@/context/currency-context';
import type { Income, Category } from '@/lib/types';
import { Textarea } from '../ui/textarea';
import { useCategories } from '@/hooks/use-categories';

const incomeSchema = z.object({
  type: z.string().min(1, { message: "El tipo es requerido." }),
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive({ message: "El monto debe ser mayor a cero." })
  ),
  currency: z.enum(['USD', 'DOP']),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "La fecha no es válida." }),
  description: z.string().optional(),
});

export type IncomeFormValues = z.infer<typeof incomeSchema>;

export const getDefaultIncomeFormValues = (currency: 'USD' | 'DOP', income?: Income | null, defaultCategory?: string) => {
    if (income) {
        return {
            type: income.type,
            amount: income.originalAmount as unknown as number,
            currency: income.currency,
            date: new Date(income.date).toISOString().split('T')[0],
            description: income.description || '',
        };
    }
    return {
        type: defaultCategory || '',
        amount: '' as unknown as number,
        currency: currency,
        date: new Date().toISOString().split('T')[0],
        description: '',
    };
};

interface AddIncomeDialogProps {
  income?: Income | null;
  onSave: (income: Omit<Income, 'id'>, id?: string) => Promise<void>;
  children?: React.ReactNode;
}

export function AddIncomeDialog({ income, onSave, children }: AddIncomeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currency, convertToUSD } = useCurrency();
  const { incomeCategories, isLoading: isLoadingCategories } = useCategories();
  const isEditing = !!income;

  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeSchema),
  });
  
  useEffect(() => {
    if (open) {
      const defaultCategory = incomeCategories.length > 0 ? incomeCategories[0].name : '';
      form.reset(getDefaultIncomeFormValues(currency, income, defaultCategory));
    }
  }, [currency, form, open, income, incomeCategories]);


  const onSubmit = async (data: IncomeFormValues) => {
    setIsLoading(true);
    try {
      const amountInUSD = convertToUSD(data.amount, data.currency);
      
      await onSave({
        type: data.type,
        amount: amountInUSD,
        originalAmount: data.amount,
        currency: data.currency,
        date: new Date(data.date).toISOString(),
        description: data.description,
      }, income?.id);

      toast({
        title: isEditing ? '¡Ingreso Actualizado! 🤑' : '¡Ingreso Registrado! 🤑',
        description: `Se ha ${isEditing ? 'actualizado' : 'añadido'} el ingreso.`,
      });
      setOpen(false);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: isEditing ? 'Error al actualizar' : 'Error al registrar',
        description: 'No se pudo guardar el ingreso. Inténtalo de nuevo.',
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
          {isEditing ? 'Editar Ingreso' : 'Registrar Ingreso'}
        </Button>
      </DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent className="sm:max-w-[425px] glassmorphic">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Ingreso' : 'Registrar Nuevo Ingreso'} 💰</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifica los detalles de este ingreso.' : 'Añade tus ganancias para asignarlas a tus metas.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
             <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Ingreso</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="neumorphic-inset">
                            <SelectValue placeholder="Selecciona un tipo..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {isLoadingCategories ? (
                                <SelectItem value="loading" disabled>Cargando categorías...</SelectItem>
                            ) : (
                                incomeCategories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.name}>
                                        {cat.emoji} {cat.name}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej: 50000" {...field} onFocus={(e) => e.target.select()} className="neumorphic-inset" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="self-end">
                     <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="neumorphic-inset">
                            <SelectValue placeholder="Moneda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="DOP">DOP</SelectItem>
                        </SelectContent>
                      </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="neumorphic-inset" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej: Pago de freelance" {...field} className="neumorphic-inset" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full neumorphic-raised" disabled={isLoading}>
                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 {isLoading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar Ingreso'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
