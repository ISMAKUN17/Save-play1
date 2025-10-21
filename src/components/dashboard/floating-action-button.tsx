'use client';

import React from 'react';
import { useSidebar } from '@/context/sidebar-context';
import { AddIncomeDialog } from '../income/add-income-dialog';
import { useIncome } from '@/hooks/use-income';
import { Plus } from 'lucide-react';

export function FloatingActionButton() {
  const { isMobile } = useSidebar();
  const { addIncome } = useIncome();

  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AddIncomeDialog onAddIncome={addIncome}>
        <button className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center neumorphic-raised shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
          <Plus className="w-8 h-8" />
        </button>
      </AddIncomeDialog>
    </div>
  );
}
