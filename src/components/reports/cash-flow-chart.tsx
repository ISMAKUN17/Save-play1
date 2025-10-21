'use client';

import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, YAxis, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useCurrency } from '@/context/currency-context';
import { useMemo } from 'react';
import { subMonths, format, startOfMonth, parseISO, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { useIncome } from '@/hooks/use-income';
import { useDebts } from '@/hooks/use-debts';
import { useExpenses } from '@/hooks/use-expenses';

const chartConfig = {
  ingresos: {
    label: 'Ingresos 💰',
    color: 'hsl(var(--chart-2))',
  },
  gastos: {
    label: 'Gastos 📉',
    color: 'hsl(var(--chart-5))',
  },
  deudas: {
    label: 'Pagos Deudas ⛓️',
    color: 'hsl(var(--chart-1))',
  },
} as const;

export function CashFlowChart({ timeRange }: { timeRange: string }) {
    const { formatCurrency } = useCurrency();
    const { incomes } = useIncome();
    const { debtPayments } = useDebts();
    const { expenses } = useExpenses();

    const chartData = useMemo(() => {
        const now = new Date();
        const months = Array.from({ length: 6 }).map((_, i) => subMonths(now, i)).reverse();

        return months.map(monthStart => {
            const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
            const interval = { start: startOfMonth(monthStart), end: monthEnd };

            const monthlyIncomes = (incomes || [])
                .filter(income => isWithinInterval(parseISO(income.date), interval))
                .reduce((sum, income) => sum + income.amount, 0);

            const monthlyDebtPayments = (debtPayments || [])
                .filter(payment => isWithinInterval(parseISO(payment.date), interval))
                .reduce((sum, payment) => sum + payment.amount, 0);
            
            const monthlyExpenses = (expenses || [])
                .filter(expense => isWithinInterval(parseISO(expense.date), interval))
                .reduce((sum, expense) => sum + expense.amount, 0);

            return {
                month: format(monthStart, 'MMM yy', { locale: es }),
                ingresos: monthlyIncomes,
                gastos: monthlyExpenses,
                deudas: monthlyDebtPayments,
            };
        });
    }, [timeRange, incomes, debtPayments, expenses]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
       <ResponsiveContainer width="100%" height={300}>
            <AreaChart
                data={chartData}
                margin={{
                    top: 10,
                    right: 30,
                    left: 10,
                    bottom: 0,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                />
                 <YAxis
                    tickFormatter={(value) => formatCurrency(Number(value))}
                    fontSize={12}
                    width={80}
                />
                <ChartTooltip 
                    cursor={false} 
                    content={<ChartTooltipContent formatter={(value, name) => `${formatCurrency(Number(value))}`}/>}
                />
                <Legend />
                <Area type="monotone" dataKey="ingresos" stackId="1" stroke="var(--color-ingresos)" fill="var(--color-ingresos)" fillOpacity={0.4} />
                <Area type="monotone" dataKey="gastos" stackId="1" stroke="var(--color-gastos)" fill="var(--color-gastos)" fillOpacity={0.4} />
                <Area type="monotone" dataKey="deudas" stackId="1" stroke="var(--color-deudas)" fill="var(--color-deudas)" fillOpacity={0.4} />
            </AreaChart>
        </ResponsiveContainer>
    </ChartContainer>
  );
}
