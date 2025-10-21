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
import { TrendingDown } from 'lucide-react';
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
import type { Expense, Category } from '@/lib/types';
import { Textarea } from '../ui/textarea';
import { useCategories } from '@/hooks/use-categories';

const expenseSchema = z.object({
  type: z.string().min(1, { message: "El tipo es requerido." }),
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive({ message: "El monto debe ser mayor a cero." })
  ),
  currency: z.enum(['USD', 'DOP']),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "La fecha no es válida." }),
  description: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;


const getDefaultFormValues = (currency: 'USD' | 'DOP', expense?: Expense | null, defaultCategory?: string) => {
    if (expense) {
        return {
            type: expense.type,
            amount: expense.originalAmount as unknown as number,
            currency: expense.currency,
            date: new Date(expense.date).toISOString().split('T')[0],
            description: expense.description || '',
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

interface AddExpenseDialogProps {
  expense?: Expense | null;
  onSave: (expense: Omit<Expense, 'id' | 'userId'>, id?: string) => Promise<void>;
  children?: React.ReactNode;
}


export function AddExpenseDialog({ expense, onSave, children }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { currency, convertToUSD } = useCurrency();
  const { expenseCategories, isLoading: isLoadingCategories } = useCategories();
  const isEditing = !!expense;

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
  });
  
  useEffect(() => {
    if (open) {
      const defaultCategory = expenseCategories.length > 0 ? expenseCategories[0].name : '';
      form.reset(getDefaultFormValues(currency, expense, defaultCategory));
    }
  }, [currency, form, open, expense, expenseCategories]);


  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      const amountInUSD = convertToUSD(data.amount, data.currency);
      
      await onSave({
        type: data.type,
        amount: amountInUSD,
        originalAmount: data.amount,
        currency: data.currency,
        date: new Date(data.date).toISOString(),
        description: data.description,
      }, expense?.id);

      toast({
        title: isEditing ? '¡Gasto Actualizado! 💸' : '¡Gasto Registrado! 💸',
        description: `Se ha ${isEditing ? 'actualizado' : 'añadido'} el gasto.`,
      });
      setOpen(false);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: isEditing ? 'Error al actualizar' : 'Error al registrar',
        description: 'No se pudo guardar el gasto. Inténtalo de nuevo.',
      });
    }
  };
  
  const trigger = children ? (
    <DialogTrigger asChild>{children}</DialogTrigger>
  ) : (
     <DialogTrigger asChild>
        <Button variant="destructive" className="neumorphic-raised">
          <TrendingDown className="mr-2 h-4 w-4" />
          {isEditing ? 'Editar Gasto' : 'Registrar Gasto'}
        </Button>
      </DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent className="sm:max-w-[425px] glassmorphic">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Gasto' : 'Registrar Nuevo Gasto'} ➖💸</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifica los detalles de este gasto.' : 'Añade tus gastos para tener un control financiero completo.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
             <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Gasto</FormLabel>
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
                                expenseCategories.map(cat => (
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
                      <Input type="number" placeholder="Ej: 1500" {...field} onFocus={(e) => e.target.select()} className="neumorphic-inset" />
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
                    <Textarea placeholder="Ej: Compra semanal del supermercado" {...field} className="neumorphic-inset" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full neumorphic-raised">
                {isEditing ? 'Guardar Cambios' : 'Registrar Gasto'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
