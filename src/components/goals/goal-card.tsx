'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { differenceInDays, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Goal } from '@/lib/types';
import { AddContributionDialog } from './add-contribution-dialog';
import { useCurrency } from '@/context/currency-context';
import { Calendar, Coins, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '../ui/button';

interface GoalCardProps {
  goal: Goal;
  onAddContribution: (goalId: string, amount: number) => Promise<boolean>;
  onDelete: (goalId: string) => Promise<void>;
}

export function GoalCard({ goal, onAddContribution, onDelete }: GoalCardProps) {
  const { formatCurrency } = useCurrency();
  const { id, name, emoji, savedAmount, totalAmount, deadline, status } = goal;

  const progress = useMemo(() => {
    if (totalAmount === 0) return 0;
    return Math.min(Math.round((savedAmount / totalAmount) * 100), 100);
  }, [savedAmount, totalAmount]);
  
  const daysLeft = useMemo(() => {
    const today = new Date();
    const deadlineDate = parseISO(deadline);
    if (deadlineDate < today) return 0;
    return differenceInDays(deadlineDate, today);
  }, [deadline]);

  const remainingAmount = useMemo(() => totalAmount - savedAmount, [totalAmount, savedAmount]);
  const isCompleted = status === 'archived';

  return (
    <Card className={`glassmorphic flex flex-col justify-between relative ${isCompleted ? 'opacity-70' : ''}`}>
       {status === 'active' && (
         <AlertDialog>
          <AlertDialogTrigger asChild>
             <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
             </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glassmorphic">
              <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro de que quieres eliminar esta meta?</AlertDialogTitle>
              <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente la meta y sus contribuciones asociadas.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(id)}>Sí, eliminar</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
       )}

      <CardHeader className="text-center pb-4">
        <div className="text-5xl mb-2">{emoji}</div>
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {isCompleted ? '¡Completada! 🎉' : `Finaliza el ${format(parseISO(deadline), "PPP", { locale: es })}`}
        </p>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>{formatCurrency(savedAmount)}</span>
                <span>{formatCurrency(totalAmount)}</span>
            </div>
            <Progress value={progress} className="h-3 neumorphic-inset" />
            <div className="text-right text-sm font-bold text-primary">{progress}% Completado</div>
        </div>

        <div className="flex justify-around text-sm text-center">
            <div className="flex flex-col items-center gap-1">
                <Coins className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">{formatCurrency(remainingAmount > 0 ? remainingAmount : 0)}</span>
                <span className="text-xs text-muted-foreground">Faltan</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">{daysLeft}</span>
                <span className="text-xs text-muted-foreground">Días restantes</span>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        {!isCompleted && (
           <AddContributionDialog goal={goal} onAddContribution={onAddContribution} />
        )}
      </CardFooter>
    </Card>
  );
}
