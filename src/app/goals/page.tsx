'use client';

import { AppShell } from '@/components/dashboard/app-shell';
import { useGoals } from '@/hooks/use-goals';
import { GoalCard } from '@/components/goals/goal-card';
import { AddGoalDialog } from '@/components/goals/add-goal-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function GoalsPage() {
  const { goals, addGoal, addContribution, deleteGoal, isLoading } = useGoals();

  const activeGoals = goals.filter(g => g.status === 'active');
  const archivedGoals = goals.filter(g => g.status === 'archived');

  return (
    <AppShell>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Tus Metas 🎯</h1>
        <AddGoalDialog onAddGoal={addGoal} />
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto neumorphic-inset p-2 mb-8">
          <TabsTrigger value="active" className="py-2">
            Metas Activas 🔥
          </TabsTrigger>
          <TabsTrigger value="archived" className="py-2">
            Metas Archivadas 📚
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-64 rounded-lg" />
            </div>
          ) : activeGoals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeGoals.map((goal) => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal} 
                  onAddContribution={addContribution}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card/60 rounded-lg glassmorphic">
              <h2 className="text-2xl font-bold mb-4">¡Aún no tienes metas activas!</h2>
              <p className="text-muted-foreground mb-6">Crea tu primera meta de ahorro y empieza a jugar.</p>
              <AddGoalDialog onAddGoal={addGoal} />
            </div>
          )}
        </TabsContent>
        <TabsContent value="archived">
           {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Skeleton className="h-64 rounded-lg" />
            </div>
          ) : archivedGoals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {archivedGoals.map((goal) => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal} 
                  onAddContribution={addContribution}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card/60 rounded-lg glassmorphic">
              <h2 className="text-2xl font-bold mb-4">No tienes metas archivadas</h2>
              <p className="text-muted-foreground mb-6">Cuando completes una meta, aparecerá aquí.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
