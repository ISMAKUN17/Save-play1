'use client';

import { AppShell } from '@/components/dashboard/app-shell';
import { AddDebtDialog } from '@/components/debts/add-debt-dialog';
import { DebtCard } from '@/components/debts/debt-card';
import { DebtSummary } from '@/components/debts/debt-summary';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebts } from '@/hooks/use-debts';

export default function DebtsPage() {
  const { debts, addDebt, addDebtPayment, debtPayments, isLoading } = useDebts();

  return (
    <AppShell>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Tus Cadenas Financieras ⛓️</h1>
        <AddDebtDialog onAddDebt={addDebt} />
      </div>
      <div className="space-y-8">
        <DebtSummary debts={debts} debtPayments={debtPayments} />
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
          </div>
        ) : debts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {debts.map((debt) => (
              <DebtCard key={debt.id} debt={debt} onAddPayment={addDebtPayment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card/60 rounded-lg glassmorphic">
            <h2 className="text-2xl font-bold mb-4">¡Estás libre de deudas! 🎉</h2>
            <p className="text-muted-foreground mb-6">No tienes ninguna "cadena" registrada. ¡Felicidades!</p>
            <AddDebtDialog onAddDebt={addDebt} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
