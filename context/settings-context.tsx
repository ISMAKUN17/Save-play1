'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

type Theme = 'light' | 'dark';
type AccentColor = 'primary' | 'blue' | 'purple' | 'green' | 'rose';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const accentColorMap: Record<string, Record<string, string>> = {
  light: {
    primary: '39 100% 50%',
    blue: '217 91% 60%',
    purple: '262 84% 60%',
    green: '142 71% 45%',
    rose: '330 80% 65%',
  },
  dark: {
    primary: '262 84% 60%',
    blue: '217 91% 60%',
    purple: '262 84% 60%',
    green: '142 71% 45%',
    rose: '330 80% 65%',
  },
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [accentColor, setAccentColor] = useState<AccentColor>('primary');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
      metaColorScheme.setAttribute('content', theme);
    } else {
        const meta = document.createElement('meta');
        meta.name = 'color-scheme';
        meta.content = theme;
        document.head.appendChild(meta);
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const resolvedColor = accentColorMap[theme][accentColor] || accentColorMap[theme]['primary'];
    root.style.setProperty('--primary', resolvedColor);
    root.style.setProperty('--ring', resolvedColor);
  }, [accentColor, theme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    accentColor,
    setAccentColor,
  }), [theme, accentColor]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
