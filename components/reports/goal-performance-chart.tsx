'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useGoals } from '@/hooks/use-goals';
import { useMemo } from 'react';
import { useCurrency } from '@/context/currency-context';

const chartConfig = {
  total: {
    label: 'Meta Total',
    color: 'hsl(var(--muted))',
  },
  real: {
    label: 'Ahorro Real',
    color: 'hsl(var(--primary))',
  },
} as const;

export function GoalPerformanceChart({ timeRange }: { timeRange: string }) {
  const { goals } = useGoals();
  const { formatCurrency } = useCurrency();

  const chartData = useMemo(() => {
    // Filter active goals to show performance on ongoing efforts
    const activeGoals = goals.filter(g => g.status === 'active');
    
    return activeGoals.slice(0, 5).map(goal => {
      return {
        name: `${goal.emoji} ${goal.name}`,
        total: goal.totalAmount,
        real: goal.savedAmount,
      };
    });
  }, [goals, timeRange]);

  if (chartData.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay datos de metas activas para mostrar.</p>
  }

  return (
     <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.substring(0, 15) + (value.length > 15 ? '...' : '')}
          />
          <YAxis
             tickFormatter={(value) => formatCurrency(Number(value))}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: 'hsl(var(--muted) / 0.2)' }}
           />
           <Legend />
          <Bar dataKey="total" fill="var(--color-total)" radius={4} />
          <Bar dataKey="real" fill="var(--color-real)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
