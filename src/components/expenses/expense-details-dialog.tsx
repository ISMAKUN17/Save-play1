'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import type { Expense } from '@/lib/types';
import { useCurrency } from '@/context/currency-context';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '../ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { AddExpenseDialog } from './add-expense-dialog';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/use-categories';

interface ExpenseDetailsDialogProps {
  expense: Expense;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (expense: Omit<Expense, "id" | "userId">, id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ExpenseDetailsDialog({ expense, isOpen, onOpenChange, onUpdate, onDelete }: ExpenseDetailsDialogProps) {
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();
  const { getCategoryDetails } = useCategories();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatOriginalAmount = (amount: number, currency: 'USD' | 'DOP') => {
    return new Intl.NumberFormat(currency === 'DOP' ? 'es-DO' : 'en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
  }
  
  const handleDelete = async () => {
    try {
        await onDelete(expense.id);
        toast({
            title: '¡Gasto Eliminado! 🗑️',
            description: 'El registro de gasto ha sido eliminado permanentemente.',
        });
        onOpenChange(false);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error al eliminar',
            description: 'No se pudo eliminar el gasto. Inténtalo de nuevo.',
        });
    }
  }

  const categoryDetails = getCategoryDetails('expense', expense.type);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glassmorphic">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="outline" className={`border-0 text-base ${categoryDetails.className}`}>
                {categoryDetails.emoji} {categoryDetails.label}
            </Badge>
          </DialogTitle>
           <DialogDescription>
            Detalles de la transacción
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Monto Original:</span>
                <span className="font-bold">{formatOriginalAmount(expense.originalAmount, expense.currency)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Monto en Balance:</span>
                <span className="font-bold text-red-600">- {formatCurrency(expense.amount)}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha:</span>
                <span className="font-medium">{format(parseISO(expense.date), "PPP", { locale: es })}</span>
            </div>
            {expense.description && (
                <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground">Descripción:</span>
                    <p className="p-2 bg-muted/50 rounded-md">{expense.description}</p>
                </div>
            )}
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
            <AddExpenseDialog expense={expense} onSave={onUpdate}>
                <Button variant="outline" className="w-full neumorphic-raised">
                    <Edit className="mr-2" /> Editar
                </Button>
            </AddExpenseDialog>
             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                     <Button variant="destructive" className="w-full neumorphic-raised">
                        <Trash2 className="mr-2" /> Eliminar
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glassmorphic">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de que quieres eliminar este gasto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente de tu historial.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Sí, eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
