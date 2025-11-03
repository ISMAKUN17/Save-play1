'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCurrency } from '@/context/currency-context';
import type { Debt } from '@/lib/types';
import { AddDebtPaymentDialog } from './add-debt-payment-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
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
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { AddDebtDialog } from './add-debt-dialog';

interface DebtCardProps {
  debt: Debt;
  onAddPayment: (debtId: string, amount: number) => Promise<void>;
  onUpdate: (debt: Omit<Debt, 'id' | 'paidAmount' | 'userId'>, id: string) => Promise<void>;
  onDelete: (debtId: string) => Promise<void>;
}

export function DebtCard({ debt, onAddPayment, onUpdate, onDelete }: DebtCardProps) {
  const { formatCurrency } = useCurrency();
  const { name, emoji, paidAmount, totalAmount } = debt;
  const { toast } = useToast();
  
  const handleDelete = async () => {
    try {
      await onDelete(debt.id);
      toast({
        title: '¡Deuda Eliminada!',
        description: `La deuda "${debt.name}" ha sido eliminada.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al eliminar',
        description: 'No se pudo eliminar la deuda. Inténtalo de nuevo.',
      });
    }
  };

  const progress = useMemo(() => {
    if (totalAmount === 0) return 0;
    return Math.min(Math.round((paidAmount / totalAmount) * 100), 100);
  }, [paidAmount, totalAmount]);
  
  const remainingAmount = useMemo(() => totalAmount - paidAmount, [totalAmount, paidAmount]);

  return (
    <Card className="glassmorphic flex flex-col justify-between border-red-500/20 relative">
       <div className="absolute top-2 right-2 flex gap-1">
            <AddDebtDialog debt={debt} onSave={onUpdate}>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Edit className="h-4 w-4" />
              </Button>
            </AddDebtDialog>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glassmorphic">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de que quieres eliminar esta deuda?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la deuda y sus pagos asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Sí, eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>

      <CardHeader className="text-center pb-4 pt-12">
        <div className="text-5xl mb-2">{emoji}</div>
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Vence el día {debt.dueDate} de cada mes
        </p>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>Pagado: {formatCurrency(paidAmount)}</span>
                <span>Falta: {formatCurrency(remainingAmount)}</span>
            </div>
            <Progress value={progress} className="h-3 neumorphic-inset" />
            <div className="text-right text-sm font-bold text-primary">{progress}% Pagado</div>
        </div>

        <div className="text-center bg-card/50 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Pago Mensual</div>
            <div className="font-bold text-lg">{formatCurrency(debt.monthlyPayment)}</div>
        </div>
      </CardContent>
      <CardFooter>
        <AddDebtPaymentDialog debt={debt} onAddPayment={onAddPayment} />
      </CardFooter>
    </Card>
  );
}
