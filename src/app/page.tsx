'use client';

import { AppShell } from '@/components/dashboard/app-shell';
import { FinancialSummary } from '@/components/dashboard/financial-summary';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { SavingsTip } from '@/components/dashboard/savings-tip';
import { GoalCard } from '@/components/goals/goal-card';
import { useGoals } from '@/hooks/use-goals';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { goals, addContribution, deleteGoal, isLoading } = useGoals();

  const featuredGoals = useMemo(() => {
    return [...goals]
      .filter(g => g.status === 'active')
      .sort((a, b) => (b.savedAmount / b.totalAmount) - (a.savedAmount / a.totalAmount))
      .slice(0, 2);
  }, [goals]);

  return (
    <AppShell>
      <div className="grid gap-8">
        <FinancialSummary />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            
            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Skeleton className="h-64 rounded-lg" />
                  <Skeleton className="h-64 rounded-lg" />
               </div>
            ) : featuredGoals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onAddContribution={addContribution} onDelete={deleteGoal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card/60 rounded-lg glassmorphic min-h-[256px] flex flex-col items-center justify-center">
                 <h3 className="text-xl font-bold mb-2">¡Bienvenido a Save & Play!</h3>
                 <p className="text-muted-foreground">Aún no tienes metas activas. ¡Crea una para empezar a jugar!</p>
              </div>
            )}
          </div>
          
          <div className="grid gap-8">
            <SavingsTip />
            <RecentActivity />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
