'use client';

import type { Expense } from '@/lib/types';
import * as data from '@/lib/data';
import { useUser } from '@/firebase/auth/use-user';
import { useList } from '@/firebase/database/use-list';

export function useExpenses() {
  const { user } = useUser();
  const userId = user?.uid;
  
  const { data: expenses = [], loading: isLoading } = useList<Expense>(userId ? `expenses/${userId}` : null);

  const handleSave = async (expense: Omit<Expense, 'id' | 'userId'>, id?: string) => {
    if (!userId) throw new Error("User not authenticated");
    if (id) {
        await data.updateExpense(id, expense);
    } else {
        await data.addExpense(expense);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!userId) throw new Error("User not authenticated");
    await data.deleteExpense(id);
  };

  return {
    expenses,
    addExpense: handleSave,
    updateExpense: handleSave,
    deleteExpense,
    isLoading,
  };
}
