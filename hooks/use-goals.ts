'use client';

import type { Goal, Contribution } from '@/lib/types';
import * as data from '@/lib/data';
import { useUser } from '@/firebase/auth/use-user';
import { useList } from '@/firebase/database/use-list';

export function useGoals() {
  const { user } = useUser();
  const userId = user?.uid;

  const { data: goals = [], loading: goalsLoading } = useList<Goal>(userId ? `goals/${userId}` : null);
  const { data: contributionHistory = [], loading: contribLoading } = useList<Contribution>(userId ? `contributions/${userId}` : null);
  
  const isLoading = goalsLoading || contribLoading;

  const addGoal = async (goal: Omit<Goal, 'id' |'userId' | 'savedAmount' | 'status'>) => {
    if (!userId) throw new Error("User not authenticated");
    await data.addGoal(goal);
  };

  const addContribution = async (goalId: string, amount: number): Promise<boolean> => {
    if (!userId) throw new Error("User not authenticated");
    
    const goalBefore = goals.find(g => g.id === goalId);
    if (!goalBefore) return false;

    const wasCompleted = goalBefore.savedAmount >= goalBefore.totalAmount;
    
    await data.addContribution(goalId, amount);

    // After the data operation, the useList hook will eventually update the state.
    // We check the "future" state to see if it's completed.
    const goalAfter = { ...goalBefore, savedAmount: goalBefore.savedAmount + amount };
    const isNowCompleted = goalAfter.savedAmount >= goalAfter.totalAmount;

    if (!wasCompleted && isNowCompleted) {
      await data.archiveGoal(goalId);
       return true; // Indicates the goal was just completed
    }
    
    return false; // Indicates the goal was not just completed
  };
  
  const deleteGoal = async (goalId: string) => {
    if (!userId) throw new Error("User not authenticated");
    await data.deleteGoal(goalId);
  };

  return {
    goals,
    contributionHistory,
    addGoal,
    addContribution,
    deleteGoal,
    isLoading,
  };
}
