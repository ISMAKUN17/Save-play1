import './globals.css';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers';
import type { Metadata } from 'next';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Save & Play',
  description: 'Transforma el ahorro en un juego divertido y visual.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
       <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('antialiased font-sans', poppins.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
