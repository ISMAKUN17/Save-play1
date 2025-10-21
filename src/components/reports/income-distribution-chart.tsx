'use client';

import { Pie, PieChart, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { useMemo } from 'react';
import { useCurrency } from '@/context/currency-context';
import { useGoals } from '@/hooks/use-goals';
import { useDebts } from '@/hooks/use-debts';
import { useIncome } from '@/hooks/use-income';
import { subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { useExpenses } from '@/hooks/use-expenses';


const chartConfig = {
  ahorro: { label: 'Ahorro 🎯', color: 'hsl(var(--chart-2))' },
  deuda: { label: 'Deuda ⛓️', color: 'hsl(var(--chart-1))' },
  gastos: { label: 'Gastos 📉', color: 'hsl(var(--chart-5))' },
  disponible: { label: 'Disponible 🤷', color: 'hsl(var(--muted))' },
} as const;

export function IncomeDistributionChart() {
  const { formatCurrency } = useCurrency();
  const { contributionHistory } = useGoals();
  const { debtPayments } = useDebts();
  const { incomes } = useIncome();
  const { expenses } = useExpenses();
    
  const chartData = useMemo(() => {
    const now = new Date();
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));
    const interval = { start: lastMonthStart, end: lastMonthEnd };

    const totalIncomeLastMonth = incomes
      .filter(i => isWithinInterval(parseISO(i.date), interval))
      .reduce((sum, i) => sum + i.amount, 0);

    const totalSavingsLastMonth = contributionHistory
      .filter(c => isWithinInterval(parseISO(c.date), interval))
      .reduce((sum, c) => sum + c.amount, 0);
    
    const totalDebtPaymentsLastMonth = debtPayments
      .filter(p => isWithinInterval(parseISO(p.date), interval))
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalExpensesLastMonth = expenses
      .filter(e => isWithinInterval(parseISO(e.date), interval))
      .reduce((sum, e) => sum + e.amount, 0);
    
    const available = totalIncomeLastMonth - totalSavingsLastMonth - totalDebtPaymentsLastMonth - totalExpensesLastMonth;

    return [
      { category: 'ahorro', amount: totalSavingsLastMonth, fill: 'var(--color-ahorro)' },
      { category: 'deuda', amount: totalDebtPaymentsLastMonth, fill: 'var(--color-deuda)' },
      { category: 'gastos', amount: totalExpensesLastMonth, fill: 'var(--color-gastos)' },
      { category: 'disponible', amount: available > 0 ? available : 0, fill: 'var(--color-disponible)' },
    ].filter(d => d.amount > 0);

  }, [incomes, contributionHistory, debtPayments, expenses]);

  const totalAmount = useMemo(() => chartData.reduce((acc, curr) => acc + curr.amount, 0), [chartData]);
  
  if (totalAmount === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay datos del mes anterior para mostrar.</p>
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-square">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(Number(value))} />}
          />
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="category"
            innerRadius={50}
            strokeWidth={5}
            labelLine={false}
            label={({
              payload,
              ...props
            }) => {
              if (totalAmount === 0) return null;
              const percent = (payload.amount / totalAmount) * 100;
              if (percent < 5) return null; // Don't render label for small slices
              return (
                 <text
                  {...props}
                  className="fill-foreground text-sm"
                  textAnchor={props.textAnchor}
                  dominantBaseline="central"
                >
                  {`${percent.toFixed(0)}%`}
                </text>
              )
            }}
          >
             {chartData.map((entry) => (
                <Cell key={`cell-${entry.category}`} fill={entry.fill} />
              ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="category" />}
            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
    </ChartContainer>
  );
}
