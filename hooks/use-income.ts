'use client';

import type { Income } from '@/lib/types';
import * as data from '@/lib/data';
import { useUser } from '@/firebase/auth/use-user';
import { useList } from '@/firebase/database/use-list';

export function useIncome() {
  const { user } = useUser();
  const userId = user?.uid;
  
  const { data: incomes = [], loading: isLoading } = useList<Income>(userId ? `incomes/${userId}` : null);

  const addIncome = async (income: Omit<Income, 'id' | 'userId'>) => {
    if (!userId) throw new Error("User not authenticated");
    await data.addIncome(income);
  };
  
  const handleSave = async (income: Omit<Income, 'id' | 'userId'>, id?: string) => {
    if (!userId) throw new Error("User not authenticated");
    if (id) {
        await data.updateIncome(id, income);
    } else {
        await data.addIncome(income);
    }
  };

  const deleteIncome = async (id: string) => {
    if (!userId) throw new Error("User not authenticated");
    await data.deleteIncome(id);
  };

  return {
    incomes,
    addIncome: handleSave,
    updateIncome: handleSave,
    deleteIncome,
    isLoading,
  };
}
