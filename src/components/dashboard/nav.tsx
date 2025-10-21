
'use client';

import {
  LayoutDashboard,
  Target,
  Wallet,
  Bomb,
  PieChart,
  Settings,
  Gamepad2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSettings } from '@/context/settings-context';
import { useSidebar } from '@/context/sidebar-context';
import { cn } from '@/lib/utils';
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const menuItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard', emoji: '🏠' },
  { href: '/goals', icon: Target, label: 'Metas', emoji: '🎯' },
  { href: '/income', icon: Wallet, label: 'Ingresos', emoji: '💰' },
  { href: '/debts', icon: Bomb, label: 'Deudas', emoji: '⛓️' },
  { href: '/reports', icon: PieChart, label: 'Reportes', emoji: '📈' },
  { href: '/settings', icon: Settings, label: 'Config', emoji: '⚙️' },
];

export function Nav() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile, state, openMobile } = useSidebar();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (isMobile) {
    return (
      <div className={cn(
        "absolute top-16 left-4 z-50 flex flex-col gap-3 transition-all duration-300 ease-in-out",
        !openMobile && "pointer-events-none"
      )}>
        {menuItems.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleLinkClick}
            className={cn(
              "flex items-center gap-3 w-48 p-3 rounded-full neumorphic-raised bg-background/80 backdrop-blur-lg text-foreground transition-all duration-300",
              openMobile 
                ? `opacity-100 translate-y-0 delay-${index * 50}` 
                : `opacity-0 -translate-y-4`
            )}
            style={{
              transitionDelay: `${index * 30}ms`
            }}
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>
    );
  }


  return (
    <div className="flex flex-col h-full">
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center neumorphic-raised">
            <Gamepad2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className={`text-xl font-bold tracking-tighter text-foreground overflow-hidden transition-all duration-300 ${state === 'collapsed' ? 'w-0' : 'w-auto'}`}>
            Save &amp; Play
          </h1>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1 px-2 py-2 space-y-2">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
             <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                onClick={handleLinkClick}
                className={`
                  justify-start items-center
                  neumorphic-raised text-sidebar-foreground
                  data-[active=true]:neumorphic-inset 
                  data-[active=true]:text-primary-foreground
                `}
                style={{
                  backgroundColor: isActive(item.href) ? `hsl(var(--primary))` : undefined,
                } as React.CSSProperties}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl transition-transform duration-300 ${isActive(item.href) ? 'scale-110' : ''}`}>{item.emoji}</span>
                    <span className={`overflow-hidden transition-all duration-200 ${state === 'collapsed' ? 'w-0' : 'w-auto'}`}>{item.label}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
