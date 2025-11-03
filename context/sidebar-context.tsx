'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePathname } from 'next/navigation';

type SidebarState = 'expanded' | 'collapsed';

interface SidebarContextType {
  state: SidebarState;
  setState: (state: SidebarState) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SidebarState>('expanded');
  const [openMobile, setOpenMobile] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      // Keep desktop sidebar expanded by default
      setState('expanded');
      setOpenMobile(false);
    }
  }, [isMobile]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile]);


  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(prev => !prev);
    } else {
      setState(prevState => prevState === 'expanded' ? 'collapsed' : 'expanded');
    }
  }, [isMobile]);

  const value = useMemo(() => ({
    state,
    setState,
    openMobile,
    setOpenMobile,
    toggleSidebar,
    isMobile,
  }), [state, openMobile, toggleSidebar, isMobile]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
