'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/context/currency-context";
import type { Debt, DebtPayment } from "@/lib/types";
import { AlertTriangle, CalendarClock, ChevronsDown } from 'lucide-react';
import { isSameMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface DebtSummaryProps {
  debts: Debt[];
  debtPayments: DebtPayment[];
}

export function DebtSummary({ debts, debtPayments }: DebtSummaryProps) {
  const { formatCurrency } = useCurrency();
  const now = new Date();

  const { totalDebtLoad, nextDuePayment, monthlyCommitted } = useMemo(() => {
    const totalDebtLoad = debts.reduce((acc, debt) => acc + (debt.totalAmount - debt.paidAmount), 0);
    
    const paymentsDoneThisMonth = debtPayments.filter(p => isSameMonth(parseISO(p.date), now));
    const debtIdsPaidThisMonth = new Set(paymentsDoneThisMonth.map(p => p.debtId));

    const upcomingDebts = debts
      .filter(d => d.dueDate >= now.getDate() && !debtIdsPaidThisMonth.has(d.id))
      .sort((a, b) => a.dueDate - b.dueDate);
      
    const nextDuePayment = upcomingDebts[0] || null;

    const monthlyCommitted = debts.reduce((acc, debt) => {
        if (!debtIdsPaidThisMonth.has(debt.id)) {
            return acc + debt.monthlyPayment;
        }
        return acc;
    }, 0);

    return { totalDebtLoad, nextDuePayment, monthlyCommitted };
  }, [debts, debtPayments, now]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="glassmorphic bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Carga Total de Deudas</CardTitle>
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalDebtLoad)}</div>
          <p className="text-xs text-muted-foreground">🚨 Pendiente por pagar en total</p>
        </CardContent>
      </Card>
      <Card className="glassmorphic bg-orange-50/50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Próximo Pago Vence</CardTitle>
          <CalendarClock className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          {nextDuePayment ? (
            <>
              <div className="text-2xl font-bold">{formatCurrency(nextDuePayment.monthlyPayment)}</div>
              <p className="text-xs text-muted-foreground">🗓️ {nextDuePayment.name} - vence el día {nextDuePayment.dueDate}</p>
            </>
          ) : (
             <>
              <div className="text-2xl font-bold">--</div>
               <p className="text-xs text-muted-foreground">🎉 No hay pagos próximos este mes</p>
             </>
          )}
        </CardContent>
      </Card>
      <Card className="glassmorphic bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pagos Comprometidos (Mes)</CardTitle>
          <ChevronsDown className="h-5 w-5 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(monthlyCommitted)}</div>
          <p className="text-xs text-muted-foreground">💸⬇️ A deducir del balance este mes</p>
        </CardContent>
      </Card>
    </div>
  );
}
