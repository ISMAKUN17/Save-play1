'use client';

import { AppShell } from '@/components/dashboard/app-shell';
import { IncomeSummary } from '@/components/income/income-summary';
import { IncomeHistoryTable } from '@/components/income/income-history-table';
import { AddIncomeDialog } from '@/components/income/add-income-dialog';
import { useIncome } from '@/hooks/use-income';
import { AddExpenseDialog } from '@/components/expenses/add-expense-dialog';
import { useExpenses } from '@/hooks/use-expenses';
import { ExpenseHistoryTable } from '@/components/expenses/expense-history-table';
import { TrendingDown } from 'lucide-react';

export default function IncomePage() {
  const { incomes, addIncome, updateIncome, deleteIncome, isLoading: incomeLoading } = useIncome();
  const { expenses, addExpense, updateExpense, deleteExpense, isLoading: expenseLoading } = useExpenses();

  return (
    <AppShell>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">Tus Ingresos y Gastos 💸</h1>
        <div className="flex gap-2">
          <AddIncomeDialog onSave={addIncome} />
          <AddExpenseDialog onSave={addExpense}>
             <button className="neumorphic-raised inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
                <TrendingDown className="mr-2 h-4 w-4" />
                Agregar Gasto ➖💸
             </button>
          </AddExpenseDialog>
        </div>
      </div>

      <div className="space-y-8">
        <IncomeSummary incomes={incomes} />
        <IncomeHistoryTable incomes={incomes} isLoading={incomeLoading} onUpdate={updateIncome} onDelete={deleteIncome} />
        <ExpenseHistoryTable 
          expenses={expenses} 
          isLoading={expenseLoading}
          onUpdate={updateExpense}
          onDelete={deleteExpense}
        />
      </div>
    </AppShell>
  );
}
