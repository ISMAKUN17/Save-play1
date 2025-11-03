'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/context/currency-context";
import { useMemo } from "react";
import { AreaChart, Banknote, Landmark, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { isSameDay, isSameMonth, parseISO } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, Cell, PieChart } from "recharts";
import { useGoals } from "@/hooks/use-goals";
import { useIncome } from "@/hooks/use-income";
import { useDebts } from "@/hooks/use-debts";
import { useExpenses } from "@/hooks/use-expenses";

const CHART_CONFIG = {
  saved: { label: "Ahorrado", color: "hsl(var(--primary))" },
  remaining: { label: "Restante", color: "hsl(var(--muted))" },
};

export function FinancialSummary() {
  const { goals } = useGoals();
  const { incomes } = useIncome();
  const { debts } = useDebts();
  const { expenses } = useExpenses();
  const { formatCurrency } = useCurrency();
  const now = new Date();

  const { totalSaved, totalIncome, incomeThisMonth, totalDebt, expensesThisMonth } = useMemo(() => {
    const totalSaved = (goals || []).reduce((acc, goal) => acc + goal.savedAmount, 0);
    const totalIncome = (incomes || []).reduce((acc, income) => acc + income.amount, 0);
    
    const incomeThisMonth = (incomes || [])
        .filter(income => isSameMonth(parseISO(income.date), now))
        .reduce((acc, income) => acc + income.amount, 0);

    const totalDebt = (debts || []).reduce((acc, debt) => acc + (debt.totalAmount - debt.paidAmount), 0);

    const expensesThisMonth = (expenses || [])
        .filter(expense => isSameMonth(parseISO(expense.date), now))
        .reduce((acc, expense) => acc + expense.amount, 0);

    return { totalSaved, totalIncome, incomeThisMonth, totalDebt, expensesThisMonth };
  }, [goals, incomes, debts, expenses, now]);
  
  const savingsPercentage = totalIncome > 0 ? (totalSaved / totalIncome) * 100 : 0;
  
  const chartData = [
    { name: 'saved', value: savingsPercentage, fill: 'hsl(var(--primary))' },
    { name: 'remaining', value: 100 - savingsPercentage, fill: 'hsl(var(--muted))' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tu Potencial de Ahorro Hoy 💎</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos (Mes)</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(incomeThisMonth)}</div>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos (Mes)</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(expensesThisMonth)}</div>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ahorrado Total</CardTitle>
            <Banknote className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSaved)}</div>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deudas Totales</CardTitle>
            <Landmark className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDebt)}</div>
          </CardContent>
        </Card>
        <Card className="glassmorphic flex flex-col col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Ahorro Histórico</CardTitle>
            <AreaChart className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center relative">
            <ChartContainer
                config={CHART_CONFIG}
                className="mx-auto aspect-square h-full w-full"
              >
              <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={30}
                  outerRadius={40}
                  strokeWidth={2}
                >
                    {chartData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                </Pie>
              </PieChart>
            </ChartContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-bold text-lg">{`${savingsPercentage.toFixed(0)}%`}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
