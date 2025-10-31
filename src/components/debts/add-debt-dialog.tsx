'use client';

import React, { useState } from 'react';
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
  paymentAmount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive({ message: "El pago debe ser mayor a cero." })
  ),
  paymentFrequency: z.enum(['Mensual', 'Quincenal', 'Semanal', 'Bimestral', 'Trimestral']),
  dueDate: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(1).max(31, { message: "Debe ser un día válido del mes (1-31)." })
  ),
  dueDate2: z.preprocess(
    (a) => a ? parseInt(z.string().parse(a), 10) : undefined,
    z.number().min(1).max(31, { message: "Debe ser un día válido del mes (1-31)." }).optional().nullable()
  ),
  currency: z.enum(['USD', 'DOP']),
});

type DebtFormValues = z.infer<typeof debtSchema>;

interface AddDebtDialogProps {
  onAddDebt: (debt: Omit<Debt, 'id' | 'paidAmount'>) => Promise<void>;
}

export function AddDebtDialog({ onAddDebt }: AddDebtDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { currency, convertToUSD } = useCurrency();

  const form = useForm<DebtFormValues>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      name: '',
      emoji: '',
      totalAmount: 0,
      paymentAmount: 0,
      paymentFrequency: 'Mensual',
      dueDate: 1,
      dueDate2: null,
      currency: currency,
    },
  });

  const paymentFrequency = form.watch('paymentFrequency');

  React.useEffect(() => {
    if (!form.formState.isDirty) {
      form.reset({
        name: '',
        emoji: '',
        totalAmount: 0,
        paymentAmount: 0,
        paymentFrequency: 'Mensual',
        dueDate: 1,
        dueDate2: null,
        currency: currency,
      });
    }
  }, [currency, form]);

  const onSubmit = async (data: DebtFormValues) => {
    try {
      const totalAmountInUSD = convertToUSD(data.totalAmount, data.currency);
      const paymentAmountInUSD = convertToUSD(data.paymentAmount, data.currency);
      
      await onAddDebt({
        name: data.name,
        emoji: data.emoji,
        totalAmount: totalAmountInUSD,
        paymentAmount: paymentAmountInUSD,
        paymentFrequency: data.paymentFrequency,
        dueDate: data.dueDate,
        dueDate2: data.dueDate2,
      });

      toast({
        title: '¡Deuda Registrada! ⛓️',
        description: `Tu nueva deuda "${data.name}" ha sido registrada.`
      });
      setOpen(false);
      form.reset();
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error al registrar la deuda',
        description: 'No se pudo crear la deuda. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="neumorphic-raised">
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Deuda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glassmorphic">
        <DialogHeader>
          <DialogTitle>Registrar Nueva "Cadena" ⛓️</DialogTitle>
          <DialogDescription>
            Añade una deuda para empezar a romper tus cadenas financieras.
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
              name="paymentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto del Pago</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 10000" {...field} onFocus={(e) => e.target.select()} className="neumorphic-inset" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia de Pago 📅</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="neumorphic-inset">
                        <SelectValue placeholder="Selecciona la frecuencia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mensual">Mensual</SelectItem>
                      <SelectItem value="Quincenal">Quincenal</SelectItem>
                      <SelectItem value="Semanal">Semanal</SelectItem>
                      <SelectItem value="Bimestral">Bimestral</SelectItem>
                      <SelectItem value="Trimestral">Trimestral</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Día de Vencimiento</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej: 15" {...field} className="neumorphic-inset" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {paymentFrequency === 'Quincenal' && (
                <FormField
                  control={form.control}
                  name="dueDate2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segundo Vencimiento</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ej: 30" {...field} value={field.value ?? ''} className="neumorphic-inset" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full neumorphic-raised">
                Añadir Cadena
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
