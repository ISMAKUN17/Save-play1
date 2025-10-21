'use client';

import { useState } from 'react';
import { AppShell } from '@/components/dashboard/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileDown } from 'lucide-react';
import { GoalPerformanceChart } from '@/components/reports/goal-performance-chart';
import { CashFlowChart } from '@/components/reports/cash-flow-chart';
import { IncomeDistributionChart } from '@/components/reports/income-distribution-chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';


export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('last-3-months');
  const { toast } = useToast();

  const handleExport = (type: string) => {
    toast({
      title: 'Exportación Iniciada 🚀',
      description: `Se está generando tu reporte de ${type}. Esto puede tardar unos momentos.`,
    });
    // Placeholder for actual export logic
    console.log(`Exporting ${type} for time range: ${timeRange}`);
  };

  return (
    <AppShell>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Tus Reportes 📈</h1>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] neumorphic-raised">
              <SelectValue placeholder="Rango de tiempo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-30-days">Últimos 30 días</SelectItem>
              <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
              <SelectItem value="this-year">Este año</SelectItem>
              <SelectItem value="all-time">Desde el inicio</SelectItem>
            </SelectContent>
          </Select>
          
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="neumorphic-raised">
                <Download className="mr-2" />
                Exportar Datos
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleExport('Ingresos')}>
                <FileDown className="mr-2" /> Ingresos
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleExport('Deudas y Pagos')}>
                <FileDown className="mr-2" /> Deudas y Pagos
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleExport('Metas')}>
                <FileDown className="mr-2" /> Metas
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleExport('Balance General')}>
                <FileDown className="mr-2" /> Balance General
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      <div className="space-y-8">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Rendimiento de Metas (El Progreso del Juego 🎮)</CardTitle>
          </CardHeader>
          <CardContent>
            <GoalPerformanceChart timeRange={timeRange} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
             <Card className="glassmorphic h-full">
              <CardHeader>
                <CardTitle>Flujo de Efectivo (Ingresos vs. Compromisos ⚖️)</CardTitle>
              </CardHeader>
              <CardContent>
                <CashFlowChart timeRange={timeRange} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="glassmorphic h-full">
              <CardHeader>
                <CardTitle>Distribución de Ingresos (Mes Anterior) 🗺️</CardTitle>
              </CardHeader>
              <CardContent>
                <IncomeDistributionChart />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
