'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategories } from '@/hooks/use-categories';
import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
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
import { CategoryFormDialog } from './category-form';

export function CategorySettings() {
  const {
    incomeCategories,
    expenseCategories,
    addIncomeCategory,
    updateIncomeCategory,
    deleteIncomeCategory,
    addExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    isLoading,
  } = useCategories();

  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle>Gestión de Categorías 🏷️</CardTitle>
        <CardDescription>
          Personaliza los tipos de ingresos y gastos para que se ajusten a tu vida.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Income Categories */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tipos de Ingresos 💰</h3>
            <CategoryFormDialog onSave={addIncomeCategory} categoryType="income" />
          </div>
          <div className="border rounded-lg p-4 space-y-2 neumorphic-inset">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
            ) : (
              incomeCategories.map(cat => (
                <div key={cat.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                  <span className="font-medium">{cat.emoji} {cat.name}</span>
                  <div className="flex items-center gap-2">
                    <CategoryFormDialog category={cat} onSave={updateIncomeCategory} categoryType="income">
                       <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                       </Button>
                    </CategoryFormDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                           <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                       <AlertDialogContent className="glassmorphic">
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Seguro que quieres eliminar "{cat.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Las transacciones existentes no se verán afectadas, pero no podrás usar esta categoría para nuevas transacciones.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteIncomeCategory(cat.id)}>Sí, eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tipos de Gastos ➖💸</h3>
             <CategoryFormDialog onSave={addExpenseCategory} categoryType="expense" />
          </div>
          <div className="border rounded-lg p-4 space-y-2 neumorphic-inset">
             {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
            ) : (
              expenseCategories.map(cat => (
                <div key={cat.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                  <span className="font-medium">{cat.emoji} {cat.name}</span>
                  <div className="flex items-center gap-2">
                    <CategoryFormDialog category={cat} onSave={updateExpenseCategory} categoryType="expense">
                       <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                       </Button>
                    </CategoryFormDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                           <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glassmorphic">
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Seguro que quieres eliminar "{cat.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Las transacciones existentes no se verán afectadas, pero no podrás usar esta categoría para nuevas transacciones.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteExpenseCategory(cat.id)}>Sí, eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
