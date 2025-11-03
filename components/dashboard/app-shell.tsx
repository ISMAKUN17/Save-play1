'use client';

import { AppHeader } from './app-header';
import { Nav } from './nav';
import { 
  Sidebar, 
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { useIncome } from '@/hooks/use-income';
import { useGoals } from '@/hooks/use-goals';
import { useDebts } from '@/hooks/use-debts';
import { useExpenses } from '@/hooks/use-expenses';
import { isSameMonth, parseISO } from 'date-fns';
import { useSidebar } from '@/context/sidebar-context';
import { FloatingActionButton } from './floating-action-button';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { state, isMobile } = useSidebar();
  
  const { incomes } = useIncome();
  const { goals, contributionHistory } = useGoals();
  const { debts, debtPayments } = useDebts();
  const { expenses } = useExpenses();


  const { availableBalance, committedDebtPayment } = useMemo(() => {
    const totalIncome = (incomes || []).reduce((acc, income) => acc + income.amount, 0);
    const totalContributions = (contributionHistory || []).reduce((acc, c) => acc + c.amount, 0);
    const totalDebtPaymentsMade = (debtPayments || []).reduce((acc, p) => acc + p.amount, 0);
    const totalExpenses = (expenses || []).reduce((acc, e) => acc + e.amount, 0);
    
    const now = new Date();
    const debtIdsPaidThisMonth = new Set(
        (debtPayments || []).filter(p => p.date && isSameMonth(parseISO(p.date), now)).map(p => p.debtId)
    );

    const monthlyDebtCommitment = (debts || [])
      .filter(debt => !debtIdsPaidThisMonth.has(debt.id))
      .reduce((acc, debt) => acc + debt.monthlyPayment, 0);
    
    const totalDeductions = totalContributions + totalDebtPaymentsMade + totalExpenses;

    const balance = totalIncome - totalDeductions - monthlyDebtCommitment;

    return {
      availableBalance: balance,
      committedDebtPayment: monthlyDebtCommitment
    };
  }, [incomes, goals, debts, debtPayments, contributionHistory, expenses]);


  return (
    <div className="flex min-h-screen w-full">
      <Sidebar>
        <Nav />
      </Sidebar>

      <div className={cn(
        "flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out",
        !isMobile && state === 'expanded' && "md:ml-[var(--sidebar-width)]",
        !isMobile && state === 'collapsed' && "md:ml-[var(--sidebar-width-icon)]"
      )}>
        <AppHeader availableBalance={availableBalance} committedDebtPayment={committedDebtPayment} />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
            {children}
        </main>
        <FloatingActionButton />
      </div>
    </div>
  );
}
