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
import type { Goal } from '@/lib/types';


const goalSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido." }),
  emoji: z.string().min(1, { message: "El emoji es requerido." }),
  totalAmount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive({ message: "El monto debe ser mayor a cero." })
  ),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "La fecha no es válida." }),
  currency: z.enum(['USD', 'DOP']),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface AddGoalDialogProps {
  onAddGoal: (goal: Omit<Goal, 'id' | 'savedAmount' | 'status'>) => Promise<void>;
}

export function AddGoalDialog({ onAddGoal }: AddGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { currency, convertToUSD } = useCurrency();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: '',
      emoji: '',
      totalAmount: 0,
      deadline: '',
      currency: currency,
    },
  });
  
  React.useEffect(() => {
    if (!form.formState.isDirty) {
      form.reset({
        name: '',
        emoji: '',
        totalAmount: 0,
        deadline: '',
        currency: currency,
      });
    }
  }, [currency, form]);


  const onSubmit = async (data: GoalFormValues) => {
    try {
      const amountInUSD = convertToUSD(data.totalAmount, data.currency);
      
      await onAddGoal({
        name: data.name,
        emoji: data.emoji,
        totalAmount: amountInUSD,
        deadline: data.deadline,
      });

      toast({
        title: '¡Meta Creada! 🚀',
        description: `Tu nueva meta "${data.name}" ha sido creada. ¡A por ello!`,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error al crear la meta',
        description: 'No se pudo crear la meta. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="neumorphic-raised">
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Meta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glassmorphic">
        <DialogHeader>
          <DialogTitle>Crear Nueva Meta 🎯</DialogTitle>
          <DialogDescription>
            Define tu próximo objetivo de ahorro. ¡Hazlo emocionante!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Meta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Viaje a Japón 🗼" {...field} className="neumorphic-inset" />
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
                    <Input placeholder="Ej: 🚗, 🏝️, 🏡" {...field} className="neumorphic-inset" />
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
                      <Input type="number" placeholder="Ej: 150000" {...field} onFocus={(e) => e.target.select()} className="neumorphic-inset" />
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
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha Límite</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="neumorphic-inset" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full neumorphic-raised">
                Crear y Jugar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
