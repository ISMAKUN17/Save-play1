'use client';

import type { Category } from '@/lib/types';
import * as data from '@/lib/data';
import { useUser } from '@/firebase/auth/use-user';
import { useList } from '@/firebase/database/use-list';
import { useMemo } from 'react';

const defaultIncomeCategories: Omit<Category, 'id' | 'userId'>[] = [
    { name: 'Salario', emoji: '💼' },
    { name: 'Ingreso Extra', emoji: '🎁' },
    { name: 'Regalo', emoji: '🎉' },
    { name: 'Venta', emoji: '🏷️' },
];

const defaultExpenseCategories: Omit<Category, 'id' | 'userId'>[] = [
    { name: 'Comida', emoji: '🍔' },
    { name: 'Vivienda/Renta', emoji: '🏡' },
    { name: 'Ocio', emoji: '🕹️' },
    { name: 'Transporte', emoji: '🚌' },
    { name: 'Salud', emoji: '❤️‍🩹' },
    { name: 'Servicios', emoji: '💡' },
    { name: 'Otro', emoji: '🤷' },
];


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
  
  const { data: incomeCategories = [], loading: incomeLoading } = useList<Category>(userId ? `incomeCategories/${userId}` : null);
  const { data: expenseCategories = [], loading: expenseLoading } = useList<Category>(userId ? `expenseCategories/${userId}` : null);

  const isLoading = incomeLoading || expenseLoading;

  const handleAddCategory = async (type: 'income' | 'expense', category: Omit<Category, 'id' | 'userId'>) => {
    if (!userId) throw new Error("User not authenticated");
    if (type === 'income') {
        await data.addIncomeCategory(category);
    } else {
        await data.addExpenseCategory(category);
    }
  };

  const handleUpdateCategory = async (type: 'income' | 'expense', category: Omit<Category, 'id' | 'userId'>, id: string) => {
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
    addIncomeCategory: (cat: Omit<Category, 'id' | 'userId'>) => handleAddCategory('income', cat),
    updateIncomeCategory: (cat: Omit<Category, 'id' | 'userId'>, id: string) => handleUpdateCategory('income', cat, id),
    deleteIncomeCategory: (id: string) => handleDeleteCategory('income', id),
    addExpenseCategory: (cat: Omit<Category, 'id' | 'userId'>) => handleAddCategory('expense', cat),
    updateExpenseCategory: (cat: Omit<Category, 'id' | 'userId'>, id: string) => handleUpdateCategory('expense', cat, id),
    deleteExpenseCategory: (id: string) => handleDeleteCategory('expense', id),
    getCategoryDetails,
  };
}
