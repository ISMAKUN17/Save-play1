'use client';

import { CurrencyProvider } from '@/context/currency-context';
import { SettingsProvider } from '@/context/settings-context';
import { SidebarProvider } from '@/context/sidebar-context';
import { Toaster } from './ui/toaster';
import { CelebrationProvider } from '@/context/celebration-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AppLoader } from './app-loader';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
        <SettingsProvider>
          <SidebarProvider>
            <CurrencyProvider>
              <CelebrationProvider>
                <AppLoader>
                  {children}
                </AppLoader>
                <Toaster />
              </CelebrationProvider>
            </CurrencyProvider>
          </SidebarProvider>
        </SettingsProvider>
    </FirebaseClientProvider>
  );
}
