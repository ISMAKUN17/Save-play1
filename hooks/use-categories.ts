'use client';

import type { Category } from '@/lib/types';
import * as data from '@/lib/data';
import { useUser } from '@/firebase/auth/use-user';
import { useList } from '@/firebase/database/use-list';
import { useToast } from './use-toast';

const categoryDetailsStyles: { [key: string]: string } = {
    'Salario': 'bg-blue-100 text-blue-800',
    'Ingreso Extra': 'bg-green-100 text-green-800',
    'Regalo': 'bg-yellow-100 text-yellow-800',
    'Venta': 'bg-purple-100 text-purple-800',
    'Comida': 'bg-orange-100 text-orange-800',
    'Vivienda/Renta': 'bg-blue-100 text-blue-800',
    'Ocio': 'bg-purple-100 text-purple-800',
    'Transporte': 'bg-yellow-100 text-yellow-800',
    'Salud': 'bg-red-100 text-red-800',
    'Servicios': 'bg-cyan-100 text-cyan-800',
    'Otro': 'bg-gray-100 text-gray-800',
};

export function useCategories() {
  const { user } = useUser();
  const userId = user?.uid;
  const { toast } = useToast();
  
  const { data: incomeCategories = [], loading: incomeLoading } = useList<Category>(userId ? `incomeCategories/${userId}` : null, 'order');
  const { data: expenseCategories = [], loading: expenseLoading } = useList<Category>(userId ? `expenseCategories/${userId}` : null, 'order');

  const isLoading = incomeLoading || expenseLoading;

  const handleAddCategory = async (type: 'income' | 'expense', category: Omit<Category, 'id' | 'userId' | 'order'>, order: number) => {
    if (!userId) throw new Error("User not authenticated");
    const categoryWithOrder = { ...category, order };
    if (type === 'income') {
        await data.addIncomeCategory(categoryWithOrder);
    } else {
        await data.addExpenseCategory(categoryWithOrder);
    }
  };

  const handleUpdateCategory = async (type: 'income' | 'expense', category: Omit<Category, 'id' | 'userId' | 'order'>, id: string) => {
     if (!userId) throw new Error("User not authenticated");
    if (type === 'income') {
        await data.updateIncomeCategory(id, category);
    } else {
        await data.updateExpenseCategory(id, category);
    }
  };

  const handleDeleteCategory = async (type: 'income' | 'expense', id: string) => {
    if (!userId) throw new Error("User not authenticated");
    if (type === 'income') {
        await data.deleteIncomeCategory(id);
    } else {
        await data.deleteExpenseCategory(id);
    }
  };

  const handleReorder = async (type: 'income' | 'expense', fromIndex: number, toIndex: number) => {
    const categories = type === 'income' ? [...incomeCategories] : [...expenseCategories];
    if (toIndex < 0 || toIndex >= categories.length) return;

    const item = categories[fromIndex];
    const otherItem = categories[toIndex];

    try {
      if (type === 'income') {
        await data.updateIncomeCategory(item.id, { order: toIndex });
        await data.updateIncomeCategory(otherItem.id, { order: fromIndex });
      } else {
        await data.updateExpenseCategory(item.id, { order: toIndex });
        await data.updateExpenseCategory(otherItem.id, { order: fromIndex });
      }
    } catch(e) {
      toast({
        variant: 'destructive',
        title: 'Error al reordenar',
        description: 'No se pudo guardar el nuevo orden. Inténtalo de nuevo.',
      });
    }
  };

  const getCategoryDetails = (type: 'income' | 'expense', name: string) => {
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    const category = categories.find(c => c.name === name);
    
    return {
        label: category?.name || name,
        emoji: category?.emoji || (type === 'income' ? '💰' : '💸'),
        className: categoryDetailsStyles[name] || 'bg-gray-100 text-gray-800',
    };
  };

  return {
    incomeCategories,
    expenseCategories,
    isLoading,
    addIncomeCategory: (cat: Omit<Category, 'id' | 'userId' | 'order'>, order: number) => handleAddCategory('income', cat, order),
    updateIncomeCategory: (cat: Omit<Category, 'id' | 'userId' | 'order'>, id: string) => handleUpdateCategory('income', cat, id),
    deleteIncomeCategory: (id: string) => handleDeleteCategory('income', id),
    reorderIncomeCategories: (from: number, to: number) => handleReorder('income', from, to),
    addExpenseCategory: (cat: Omit<Category, 'id' | 'userId' | 'order'>, order: number) => handleAddCategory('expense', cat, order),
    updateExpenseCategory: (cat: Omit<Category, 'id' | 'userId' | 'order'>, id: string) => handleUpdateCategory('expense', cat, id),
    deleteExpenseCategory: (id: string) => handleDeleteCategory('expense', id),
    reorderExpenseCategories: (from: number, to: number) => handleReorder('expense', from, to),
    getCategoryDetails,
  };
}
