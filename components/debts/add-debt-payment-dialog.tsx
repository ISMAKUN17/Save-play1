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
import type { Debt } from '@/lib/types';
import { Loader2, Receipt } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCurrency } from '@/context/currency-context';

interface AddDebtPaymentDialogProps {
  debt: Debt;
  onAddPayment: (debtId: string, amount: number) => Promise<void>;
}

export function AddDebtPaymentDialog({ debt, onAddPayment }: AddDebtPaymentDialogProps) {
  const { currency, convertToUSD, formatCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(debt.monthlyPayment.toString());
  const [paymentCurrency, setPaymentCurrency] = useState<'USD' | 'DOP'>(currency);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddPayment = async () => {
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Monto inválido',
        description: 'Por favor, ingresa un número positivo.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const amountInUSD = convertToUSD(paymentAmount, paymentCurrency);
      await onAddPayment(debt.id, amountInUSD);

      toast({
        title: '¡Pago Registrado! ✅',
        description: `¡Un eslabón menos en tu cadena ${debt.emoji}!`,
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al registrar el pago',
        description: error.message || 'No se pudo registrar el pago. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full neumorphic-raised" variant="destructive" size="sm">
          <Receipt className="mr-2 h-4 w-4" />
          Registrar Pago
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glassmorphic">
        <DialogHeader>
          <DialogTitle>
            Pagar: <span className="font-bold">{debt.emoji} {debt.name}</span>
          </DialogTitle>
          <DialogDescription>
            Registra un pago para reducir esta deuda.
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
              onChange={(e) => setAmount(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="col-span-2 neumorphic-inset"
              placeholder="Ej: 500"
            />
             <Select value={paymentCurrency} onValueChange={(value) => setPaymentCurrency(value as 'USD' | 'DOP')}>
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
          <Button onClick={handleAddPayment} disabled={isLoading} className="w-full neumorphic-raised">
             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Pagando...' : 'Confirmar Pago ✅'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
