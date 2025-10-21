'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCurrency } from '@/context/currency-context';
import type { Debt } from '@/lib/types';
import { AddDebtPaymentDialog } from './add-debt-payment-dialog';

interface DebtCardProps {
  debt: Debt;
  onAddPayment: (debtId: string, amount: number) => Promise<void>;
}

export function DebtCard({ debt, onAddPayment }: DebtCardProps) {
  const { formatCurrency } = useCurrency();
  const { name, emoji, paidAmount, totalAmount } = debt;

  const progress = useMemo(() => {
    if (totalAmount === 0) return 0;
    return Math.min(Math.round((paidAmount / totalAmount) * 100), 100);
  }, [paidAmount, totalAmount]);
  
  const remainingAmount = useMemo(() => totalAmount - paidAmount, [totalAmount, paidAmount]);

  return (
    <Card className="glassmorphic flex flex-col justify-between border-red-500/20">
      <CardHeader className="text-center pb-4">
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
            {/* Inverse progress: we show how much is "freed" (paid) */}
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
