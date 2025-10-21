'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, Wallet, PieChart, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/context/sidebar-context';
import { AddIncomeDialog } from '../income/add-income-dialog';
import { useIncome } from '@/hooks/use-income';

const menuItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/goals', icon: Target, label: 'Metas' },
  { href: '/income', icon: Wallet, label: 'Ingresos' },
  { href: '/reports', icon: PieChart, label: 'Reportes' },
  { href: '/settings', icon: Settings, label: 'Config' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { addIncome } = useIncome();

  if (!isMobile) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 px-2 pb-4 bg-background/70 backdrop-blur-xl border-t border-border/50 z-50 flex items-center justify-around md:hidden">
      {menuItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {index === 2 && (
             <div className="-mt-14">
                <AddIncomeDialog onAddIncome={addIncome}>
                    <button className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center neumorphic-raised focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
                        <Plus className="w-8 h-8" />
                    </button>
                </AddIncomeDialog>
             </div>
          )}
          <Link href={item.href} passHref>
            <div
              className={cn(
                'flex flex-col items-center justify-center text-muted-foreground w-16 transition-all duration-300',
                isActive(item.href) && 'text-primary animate-bounce-short'
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </div>
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}
