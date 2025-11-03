
'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCurrency } from '@/context/currency-context';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Banknote, ShieldAlert, User, Settings, LogOut, Gamepad2 } from 'lucide-react';
import { Card } from '../ui/card';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useSidebar } from '@/context/sidebar-context';

interface AppHeaderProps {
  availableBalance: number;
  committedDebtPayment: number;
}

export function AppHeader({ availableBalance, committedDebtPayment }: AppHeaderProps) {
  const { currency, setCurrency, formatCurrency } = useCurrency();
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const { state } = useSidebar();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: '¡Hasta pronto! 👋',
        description: 'Has cerrado sesión.',
      });
      // useUser hook will handle redirect
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error al cerrar sesión',
        description: 'No se pudo cerrar la sesión. Inténtalo de nuevo.',
      });
    }
  }

  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-30 p-2 md:p-4 border-b flex justify-between items-center w-full bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className={`flex items-center gap-3 transition-all duration-300 md:hidden`}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center neumorphic-raised">
            <Gamepad2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className={`text-lg font-bold tracking-tighter text-foreground overflow-hidden`}>
            Save &amp; Play
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {committedDebtPayment > 0 && (
          <Card className="neumorphic-raised p-2 flex items-center gap-2 bg-amber-100 dark:bg-amber-900/50">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <div className="hidden md:block">
              <div className="text-sm font-bold">{formatCurrency(committedDebtPayment)}</div>
              <p className="text-xs text-muted-foreground">Reservado para deudas ⛓️</p>
            </div>
          </Card>
        )}
        <Card className="neumorphic-raised p-2 flex items-center gap-2">
           <Banknote className="h-5 w-5 text-green-500" />
           <div>
            <div className="text-sm font-bold">{formatCurrency(availableBalance)}</div>
            <p className="text-xs text-muted-foreground">Disponible</p>
           </div>
        </Card>
        <Select value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'DOP')}>
          <SelectTrigger className="w-[100px] md:w-[120px] neumorphic-raised text-xs md:text-sm">
            <SelectValue placeholder="Moneda" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="DOP">DOP (RD$)</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Avatar className="cursor-pointer neumorphic-raised h-8 w-8 md:h-10 md:w-10">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.email}`} data-ai-hint="person face" />
                <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
              </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 glassmorphic" align="end">
            <DropdownMenuLabel>
              <p className="font-bold">Mi Cuenta</p>
              <p className="text-xs text-muted-foreground font-normal truncate">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/20 focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}
