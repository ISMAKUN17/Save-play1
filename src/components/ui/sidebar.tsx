'use client';

import * as React from 'react';
import { PanelLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSidebar } from '@/context/sidebar-context';
import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, children, ...props }, ref) => {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <div
        className={cn(
          'fixed inset-0 z-40 transition-opacity',
          openMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpenMobile(false)}
        />
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("group peer hidden md:block", className)}
      data-state={useSidebar().state}
      data-collapsible={useSidebar().state === 'collapsed' ? 'icon' : ''}
      {...props}
    >
      <div
        className={cn(
          'duration-200 fixed inset-y-0 z-20 flex h-svh flex-col bg-sidebar text-sidebar-foreground transition-[width] ease-in-out',
          'left-0',
          'w-[var(--sidebar-width-icon)] group-data-[state=expanded]:w-[var(--sidebar-width)]'
        )}
      >
        <div data-sidebar="sidebar" className="flex h-full w-full flex-col">
          {children}
        </div>
      </div>
    </div>
  );
});
Sidebar.displayName = 'Sidebar';


const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar, openMobile } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn('h-8 w-8 z-50', className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <div className="relative h-5 w-5">
        <PanelLeft
          className={cn(
            'absolute transition-all duration-300',
            openMobile ? 'transform rotate-90 opacity-0' : 'transform rotate-0 opacity-100',
             'md:hidden'
          )}
        />
        <X
          className={cn(
            'absolute transition-all duration-300',
            openMobile ? 'transform rotate-0 opacity-100' : 'transform -rotate-90 opacity-0',
            'md:hidden'
          )}
        />
        <PanelLeft className="hidden md:block"/>
      </div>
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        'flex items-center justify-between p-2',
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
});
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-2 mt-auto', className)}
      {...props}
    />
  );
});
SidebarFooter.displayName = 'SidebarFooter';

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto',
        className
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = 'SidebarContent';

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn('flex w-full min-w-0 flex-col gap-1', className)}
    {...props}
  />
));
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn('group/menu-item relative', className)}
    {...props}
  />
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent focus-visible:ring-2 active:bg-sidebar-accent disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-[var(--primary-active)] data-[active=true]:font-medium data-[active=true]:text-primary-foreground data-[state=open]:hover:bg-sidebar-accent',
  {
    variants: {
      variant: {
        default: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      },
      size: {
        default: 'h-10 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = 'default',
      size = 'default',
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const { isMobile, state } = useSidebar();

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === 'string') {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            hidden={state !== 'collapsed' || isMobile}
            {...tooltip}
          >
           {tooltip.children}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';


export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
};