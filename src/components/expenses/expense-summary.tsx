'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/context/currency-context";
import type { Expense } from "@/lib/types";
import { useMemo } from "react";
import { TrendingDown, MinusCircle } from "lucide-react";
import { isSameMonth, parseISO } from "date-fns";

interface ExpenseSummaryProps {
    expenses: Expense[];
}

export function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const { formatCurrency } = useCurrency();
  const now = new Date();

  const { expenseThisMonth, totalExpense } = useMemo(() => {
    const expenseThisMonth = (expenses || [])
        .filter(expense => isSameMonth(parseISO(expense.date), now))
        .reduce((acc, expense) => acc + expense.amount, 0);
    
    const totalExpense = (expenses || []).reduce((acc, expense) => acc + expense.amount, 0);
    
    return { expenseThisMonth, totalExpense };
  }, [expenses, now]);

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glassmorphic bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos del Mes 🗓️</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(expenseThisMonth)}</div>
            <p className="text-xs text-muted-foreground">en el mes actual</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic bg-orange-50/50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Total Histórico</CardTitle>
            <MinusCircle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpense)}</div>
            <p className="text-xs text-muted-foreground">desde el inicio</p>
          </CardContent>
        </Card>
      </div>
  );
}
