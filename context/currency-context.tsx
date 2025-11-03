'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';

type Currency = 'USD' | 'DOP';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
  convertToUSD: (amount: number, fromCurrency: Currency) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const USD_TO_DOP_RATE = 59; // Tasa de cambio fija

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD');

  const formatCurrency = (amount: number) => {
    const convertedAmount = currency === 'DOP' ? amount * USD_TO_DOP_RATE : amount;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol',
    });
    // Replace default currency code with desired display
    if (currency === 'DOP') {
        return `RD${formatter.format(convertedAmount).replace('DOP', '')}`;
    }
    return formatter.format(convertedAmount);
  };
  
  const convertToUSD = (amount: number, fromCurrency: Currency) => {
    if (fromCurrency === 'DOP') {
      return amount / USD_TO_DOP_RATE;
    }
    return amount;
  };

  const value = useMemo(() => ({
    currency,
    setCurrency,
    formatCurrency,
    convertToUSD,
  }), [currency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
