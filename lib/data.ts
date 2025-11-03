'use client';
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  serverTimestamp,
} from 'firebase/database';
import { database as db } from '@/firebase';
import type { Goal, Contribution, Income, Debt, DebtPayment, Expense, Category } from './types';
import { getAuth } from 'firebase/auth';

const getCurrentUserId = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user found.');
  }
  return user.uid;
};

// Helper to convert snapshot to array
const snapshotToArr = (snapshot: any) => {
  const arr: any[] = [];
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot: any) => {
      arr.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
  }
  return arr;
};


// GOALS
export async function addGoal(goal: Omit<Goal, 'id' | 'savedAmount' | 'status' | 'userId'>): Promise<void> {
  const userId = getCurrentUserId();
  const goalsRef = ref(db, `goals/${userId}`);
  const newGoalRef = push(goalsRef);
  await set(newGoalRef, {
    ...goal,
    userId,
    savedAmount: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
  });
}

export async function addContribution(goalId: string, amount: number): Promise<void> {
  const userId = getCurrentUserId();
  const goalRef = ref(db, `goals/${userId}/${goalId}`);
  const goalSnap = await get(goalRef);

  if (!goalSnap.exists()) {
    throw new Error('Goal not found or access denied.');
  }
  
  const goal = goalSnap.val() as Goal;
  if (goal.status === 'archived') {
    throw new Error('Cannot contribute to an archived goal.');
  }

  const newSavedAmount = goal.savedAmount + amount;
  
  // Add contribution
  const contribRef = ref(db, `contributions/${userId}`);
  const newContribRef = push(contribRef);
  await set(newContribRef, {
    userId,
    goalId,
    amount,
    date: new Date().toISOString(),
    goalName: goal.name, // Denormalize goal name for easier lookup
  });
  
  // Update goal's saved amount
  await update(goalRef, { savedAmount: newSavedAmount });
}


export async function deleteGoal(goalId: string): Promise<void> {
  const userId = getCurrentUserId();
  const goalRef = ref(db, `goals/${userId}/${goalId}`);
  const goalSnap = await get(goalRef);
  
  if (!goalSnap.exists()) {
    throw new Error('Goal not found or access denied.');
  }
  
  // Also delete related contributions
  const contribRef = ref(db, `contributions/${userId}`);
  const q = query(contribRef, orderByChild('goalId'), equalTo(goalId));
  const contribsSnap = await get(q);
  
  const updates: Record<string, null> = {};
  updates[`/goals/${userId}/${goalId}`] = null;
  if (contribsSnap.exists()) {
    contribsSnap.forEach((child) => {
        updates[`/contributions/${userId}/${child.key}`] = null;
    });
  }
  await update(ref(db), updates);
}

export async function archiveGoal(goalId: string): Promise<void> {
    const userId = getCurrentUserId();
    const goalRef = ref(db, `goals/${userId}/${goalId}`);
    await update(goalRef, { status: 'archived' });
}


// INCOMES
export async function addIncome(income: Omit<Income, 'id' | 'userId'>): Promise<void> {
  const userId = getCurrentUserId();
  const incomesRef = ref(db, `incomes/${userId}`);
  const newIncomeRef = push(incomesRef);
  await set(newIncomeRef, {
    ...income,
    userId,
    createdAt: new Date().toISOString(),
  });
}

export async function updateIncome(incomeId: string, income: Omit<Income, 'id' | 'userId'>): Promise<void> {
  const userId = getCurrentUserId();
  const incomeRef = ref(db, `incomes/${userId}/${incomeId}`);
  await update(incomeRef, income);
}

export async function deleteIncome(incomeId: string): Promise<void> {
  const userId = getCurrentUserId();
  const incomeRef = ref(db, `incomes/${userId}/${incomeId}`);
  await remove(incomeRef);
}


// EXPENSES
export async function addExpense(expense: Omit<Expense, 'id' | 'userId'>): Promise<void> {
  const userId = getCurrentUserId();
  const expensesRef = ref(db, `expenses/${userId}`);
  const newExpenseRef = push(expensesRef);
  await set(newExpenseRef, {
    ...expense,
    userId,
    createdAt: new Date().toISOString(),
  });
}

export async function updateExpense(expenseId: string, expense: Omit<Expense, 'id' | 'userId'>): Promise<void> {
    const userId = getCurrentUserId();
    const expenseRef = ref(db, `expenses/${userId}/${expenseId}`);
    await update(expenseRef, expense);
}

export async function deleteExpense(expenseId: string): Promise<void> {
    const userId = getCurrentUserId();
    const expenseRef = ref(db, `expenses/${userId}/${expenseId}`);
    await remove(expenseRef);
}


// DEBTS
export async function addDebt(debt: Omit<Debt, 'id' | 'paidAmount' | 'userId'>): Promise<void> {
  const userId = getCurrentUserId();
  const debtsRef = ref(db, `debts/${userId}`);
  const newDebtRef = push(debtsRef);
  await set(newDebtRef, {
    ...debt,
    userId,
    paidAmount: 0,
    createdAt: new Date().toISOString(),
  });
}

export async function updateDebt(debtId: string, debt: Omit<Debt, 'id' | 'paidAmount' | 'userId'>): Promise<void> {
    const userId = getCurrentUserId();
    const debtRef = ref(db, `debts/${userId}/${debtId}`);
    await update(debtRef, debt);
}

export async function deleteDebt(debtId: string): Promise<void> {
    const userId = getCurrentUserId();
    // Also delete related payments
    const paymentRef = ref(db, `debtPayments/${userId}`);
    const q = query(paymentRef, orderByChild('debtId'), equalTo(debtId));
    const paymentsSnap = await get(q);

    const updates: Record<string, null> = {};
    updates[`/debts/${userId}/${debtId}`] = null;
    if (paymentsSnap.exists()) {
        paymentsSnap.forEach((child) => {
            updates[`/debtPayments/${userId}/${child.key}`] = null;
        });
    }
    await update(ref(db), updates);
}

export async function addDebtPayment(debtId: string, amount: number): Promise<void> {
    const userId = getCurrentUserId();
    const debtRef = ref(db, `debts/${userId}/${debtId}`);
    const debtSnap = await get(debtRef);

    if (!debtSnap.exists()) {
        throw new Error('Debt not found or access denied.');
    }
    
    const debt = debtSnap.val() as Debt;
    const newPaidAmount = debt.paidAmount + amount;

    // Add debt payment record
    const paymentRef = ref(db, `debtPayments/${userId}`);
    const newPaymentRef = push(paymentRef);
    await set(newPaymentRef, {
        userId,
        debtId,
        amount,
        date: new Date().toISOString(),
        debtName: debt.name,
    });

    // Update debt's paid amount
    await update(debtRef, { paidAmount: newPaidAmount });
}

// CATEGORIES
export async function addIncomeCategory(category: Omit<Category, 'id' | 'userId'>): Promise<void> {
  const userId = getCurrentUserId();
  const catRef = ref(db, `incomeCategories/${userId}`);
  const newCatRef = push(catRef);
  await set(newCatRef, { ...category, userId });
}
export async function updateIncomeCategory(id: string, category: Partial<Omit<Category, 'id' | 'userId'>>): Promise<void> {
  const userId = getCurrentUserId();
  await update(ref(db, `incomeCategories/${userId}/${id}`), category);
}
export async function deleteIncomeCategory(id: string): Promise<void> {
  const userId = getCurrentUserId();
  await remove(ref(db, `incomeCategories/${userId}/${id}`));
}

export async function addExpenseCategory(category: Omit<Category, 'id' | 'userId'>): Promise<void> {
  const userId = getCurrentUserId();
  const catRef = ref(db, `expenseCategories/${userId}`);
  const newCatRef = push(catRef);
  await set(newCatRef, { ...category, userId });
}
export async function updateExpenseCategory(id: string, category: Partial<Omit<Category, 'id' | 'userId'>>): Promise<void> {
  const userId = getCurrentUserId();
  await update(ref(db, `expenseCategories/${userId}/${id}`), category);
}
export async function deleteExpenseCategory(id: string): Promise<void> {
  const userId = getCurrentUserId();
  await remove(ref(db, `expenseCategories/${userId}/${id}`));
}
