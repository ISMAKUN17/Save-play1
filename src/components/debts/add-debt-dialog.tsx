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
import { PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from '@/context/currency-context';
import type { Debt } from '@/lib/types';

const debtSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido." }),
  emoji: z.string().min(1, { message: "El emoji es requerido." }),
  totalAmount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive({ message: "El monto total debe ser mayor a cero." })
  ),
  monthlyPayment: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive({ message: "El pago mensual debe ser mayor a cero." })
  ),
  dueDate: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(1).max(31, { message: "Debe ser un día válido del mes (1-31)." })
  ),
  currency: z.enum(['USD', 'DOP']),
});

type DebtFormValues = z.infer<typeof debtSchema>;

interface AddDebtDialogProps {
  debt?: Debt | null;
  onSave: (debt: Omit<Debt, 'id' | 'paidAmount' | 'userId'>, id?: string) => Promise<void>;
  children?: React.ReactNode;
}

export function AddDebtDialog({ debt, onSave, children }: AddDebtDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { currency, convertToUSD } = useCurrency();
  const isEditing = !!debt;

  const form = useForm<DebtFormValues>({
    resolver: zodResolver(debtSchema),
  });

  useEffect(() => {
    if (open) {
      if (isEditing && debt) {
         form.reset({
          name: debt.name,
          emoji: debt.emoji,
          totalAmount: debt.totalAmount as unknown as number,
          monthlyPayment: debt.monthlyPayment as unknown as number,
          dueDate: debt.dueDate,
          currency: 'USD', // amounts in edit mode are already in USD
        });
      } else {
        form.reset({
          name: '',
          emoji: '',
          totalAmount: 0,
          monthlyPayment: 0,
          dueDate: 1,
          currency: currency,
        });
      }
    }
  }, [open, debt, isEditing, currency, form]);


  const onSubmit = async (data: DebtFormValues) => {
    try {
      const totalAmountInUSD = isEditing ? data.totalAmount : convertToUSD(data.totalAmount, data.currency);
      const monthlyPaymentInUSD = isEditing ? data.monthlyPayment : convertToUSD(data.monthlyPayment, data.currency);
      
      await onSave({
        name: data.name,
        emoji: data.emoji,
        totalAmount: totalAmountInUSD,
        monthlyPayment: monthlyPaymentInUSD,
        dueDate: data.dueDate,
      }, debt?.id);

      toast({
        title: isEditing ? '¡Deuda Actualizada! ⛓️' : '¡Deuda Registrada! ⛓️',
        description: `Tu deuda "${data.name}" ha sido ${isEditing ? 'actualizada' : 'registrada'}.`,
      });
      setOpen(false);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error al guardar la deuda',
        description: 'No se pudo guardar la deuda. Inténtalo de nuevo.',
      });
    }
  };
  
  const trigger = children ? (
    <DialogTrigger asChild>{children}</DialogTrigger>
  ) : (
     <DialogTrigger asChild>
        <Button className="neumorphic-raised">
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Deuda
        </Button>
      </DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent className="sm:max-w-[425px] glassmorphic">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar "Cadena"' : 'Registrar Nueva "Cadena"'} ⛓️</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifica los detalles de tu deuda.' : 'Añade una deuda para empezar a romper tus cadenas financieras.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Deuda</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Préstamo del carro 🚗" {...field} className="neumorphic-inset" />
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
                  <FormLabel>Emoji Representativo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 🚗, 💳, 🏡" {...field} className="neumorphic-inset" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Monto Total</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej: 300000" {...field} onFocus={(e) => e.target.select()} className="neumorphic-inset" />
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
                     <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
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
              name="monthlyPayment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pago Mensual</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 10000" {...field} onFocus={(e) => e.target.select()} className="neumorphic-inset" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Día de Vencimiento Mensual</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 15" {...field} className="neumorphic-inset" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full neumorphic-raised">
                {isEditing ? 'Guardar Cambios' : 'Añadir Cadena'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
