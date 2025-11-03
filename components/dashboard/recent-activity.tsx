'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/context/currency-context";
import { useMemo } from "react";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useGoals } from "@/hooks/use-goals";

export function RecentActivity() {
  const { contributionHistory } = useGoals();
  const { formatCurrency } = useCurrency();

  const recentContributions = useMemo(() => {
    // Assuming contributionHistory is available from useGoals hook
    // and it's sorted by date descending
    return contributionHistory?.slice(0, 5) || [];
  }, [contributionHistory]);
  
  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Tus Últimos Power-Ups ⚡</CardTitle>
      </CardHeader>
      <CardContent>
        {recentContributions.length > 0 ? (
          <ul className="space-y-4">
            {recentContributions.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⬆️</span>
                  <div>
                    <p className="font-semibold">Aporte a {c.goalName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(c.date), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-green-500">{formatCurrency(c.amount)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aún no tienes movimientos. ¡Haz tu primer aporte!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
