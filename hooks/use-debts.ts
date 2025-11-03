'use client';

import type { Debt, DebtPayment } from '@/lib/types';
import * as data from '@/lib/data';
import { useUser } from '@/firebase/auth/use-user';
import { useList } from '@/firebase/database/use-list';

export function useDebts() {
  const { user } = useUser();
  const userId = user?.uid;
  
  const { data: debts = [], loading: debtsLoading } = useList<Debt>(userId ? `debts/${userId}` : null);
  const { data: debtPayments = [], loading: paymentsLoading } = useList<DebtPayment>(userId ? `debtPayments/${userId}` : null);

  const isLoading = debtsLoading || paymentsLoading;
  
  const handleSave = async (debt: Omit<Debt, 'id' | 'paidAmount' | 'userId'>, id?: string) => {
    if (!user?.uid) throw new Error("User not authenticated");
    if (id) {
      await data.updateDebt(id, debt);
    } else {
      await data.addDebt(debt);
    }
  };

  const deleteDebt = async (debtId: string) => {
    if (!user?.uid) throw new Error("User not authenticated");
    await data.deleteDebt(debtId);
  }

  const addDebtPayment = async (debtId: string, amount: number) => {
     if (!user?.uid) throw new Error("User not authenticated");
    await data.addDebtPayment(debtId, amount);
  };

  return {
    debts,
    debtPayments,
    addDebt: handleSave,
    updateDebt: handleSave,
    deleteDebt,
    addDebtPayment,
    isLoading,
  };
}
