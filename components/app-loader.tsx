
'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { Preloader } from '@/components/preloader';
import { usePathname, useRouter } from 'next/navigation';

const publicPaths = ['/login'];

export function AppLoader({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const [shouldRender, setShouldRender] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (userLoading) {
      setShouldRender(false); // Do not render anything while checking auth
      return;
    }

    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      // If user is not logged in and not on a public path, redirect to login
      router.replace('/login');
    } else if (user && isPublicPath) {
      // If user is logged in and on a public path, redirect to home
      router.replace('/');
    } else {
      // If we are on a valid path for the current user state, allow rendering
      setShouldRender(true);
    }

  }, [user, userLoading, pathname, router]);

  // If we shouldn't render yet (either loading or redirecting), show the preloader.
  if (!shouldRender) {
    return <Preloader loading={true} />;
  }

  // If checks have passed, render the children.
  return <>{children}</>;
}
