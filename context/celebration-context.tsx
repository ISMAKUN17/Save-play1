'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface CelebrationContextType {
  celebrate: () => void;
}

const CelebrationContext = createContext<CelebrationContextType | undefined>(undefined);

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
  const [isCelebrating, setIsCelebrating] = useState(false);
  const { width, height } = useWindowSize();

  const celebrate = useCallback(() => {
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 8000); // Celebrate for 8 seconds
  }, []);

  const value = useMemo(() => ({
    celebrate,
  }), [celebrate]);

  return (
    <CelebrationContext.Provider value={value}>
      {children}
      {isCelebrating && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
        />
      )}
    </CelebrationContext.Provider>
  );
}

export function useCelebration() {
  const context = useContext(CelebrationContext);
  if (context === undefined) {
    throw new Error('useCelebration must be used within a CelebrationProvider');
  }
  return context;
}
