'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/context/currency-context";
import type { Income } from "@/lib/types";
import { useMemo } from "react";
import { Calendar, TrendingUp } from "lucide-react";
import { isSameDay, isSameMonth, parseISO } from "date-fns";

interface IncomeSummaryProps {
    incomes: Income[];
}

export function IncomeSummary({ incomes }: IncomeSummaryProps) {
  const { formatCurrency } = useCurrency();
  const now = new Date();

  const { incomeToday, incomeThisMonth } = useMemo(() => {
    const incomeToday = incomes
        .filter(income => isSameDay(parseISO(income.date), now))
        .reduce((acc, income) => acc + income.amount, 0);

    const incomeThisMonth = incomes
        .filter(income => isSameMonth(parseISO(income.date), now))
        .reduce((acc, income) => acc + income.amount, 0);
    
    return { incomeToday, incomeThisMonth };
  }, [incomes, now]);

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes 🗓️</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(incomeThisMonth)}</div>
            <p className="text-xs text-muted-foreground">en el mes actual</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos de Hoy ☀️</CardTitle>
            <Calendar className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(incomeToday)}</div>
            <p className="text-xs text-muted-foreground">registrados hoy</p>
          </CardContent>
        </Card>
      </div>
  );
}
