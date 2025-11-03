'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Goal } from '@/lib/types';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCurrency } from '@/context/currency-context';
import { useCelebration } from '@/context/celebration-context';

interface AddContributionDialogProps {
  goal: Goal;
  onAddContribution: (goalId: string, amount: number) => Promise<boolean>;
}

export function AddContributionDialog({ goal, onAddContribution }: AddContributionDialogProps) {
  const { currency, convertToUSD, formatCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [contributionCurrency, setContributionCurrency] = useState<'USD' | 'DOP'>(currency);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { celebrate } = useCelebration();

  const handleAddContribution = async () => {
    const contributionAmount = parseFloat(amount);
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Monto inválido',
        description: 'Por favor, ingresa un número positivo.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const amountInUSD = convertToUSD(contributionAmount, contributionCurrency);
      const isCompleted = await onAddContribution(goal.id, amountInUSD);

      const formattedAmount = new Intl.NumberFormat(contributionCurrency === 'DOP' ? 'es-DO' : 'en-US', {
        style: 'currency',
        currency: contributionCurrency,
      }).format(contributionAmount);
      
      if (isCompleted) {
        toast({
          title: '¡Meta Completada! 🎉🏆',
          description: `¡Felicidades! Has alcanzado tu meta "${goal.name}" ${goal.emoji}.`,
        });
        celebrate();
      } else {
        toast({
          title: '¡Aporte exitoso! ✨',
          description: `¡Genial! 🥳 ${formattedAmount} más cerca de tu ${goal.emoji}!`,
        });
      }

      setOpen(false);
      setAmount('');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al aportar',
        description: error.message || 'No se pudo registrar el aporte. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full neumorphic-raised" variant="default" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Aportar Rápido 💸
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glassmorphic">
        <DialogHeader>
          <DialogTitle>
            Aportar a: <span className="font-bold">{goal.emoji} {goal.name}</span>
          </DialogTitle>
           <DialogDescription>
            ¡Cada pequeño aporte te acerca a tu objetivo!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Monto
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-2 neumorphic-inset"
              placeholder="Ej: 500"
            />
             <Select value={contributionCurrency} onValueChange={(value) => setContributionCurrency(value as 'USD' | 'DOP')}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="DOP">DOP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddContribution} disabled={isLoading} className="w-full neumorphic-raised">
            {isLoading ? 'Aportando...' : 'Confirmar Aporte ✅'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
