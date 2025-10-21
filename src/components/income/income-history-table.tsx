'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Income } from "@/lib/types";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { IncomeDetailsDialog } from "./income-details-dialog";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";


interface IncomeHistoryTableProps {
  incomes: Income[];
  isLoading: boolean;
  onUpdate: (income: Omit<Income, "id" | "userId">, id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function IncomeHistoryTable({ incomes, isLoading, onUpdate, onDelete }: IncomeHistoryTableProps) {
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const { getCategoryDetails } = useCategories();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const formatOriginalAmount = (amount: number, currency: 'USD' | 'DOP') => {
    return new Intl.NumberFormat(currency === 'DOP' ? 'es-DO' : 'en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
  }

  const paginatedIncomes = incomes.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(incomes.length / rowsPerPage);

  return (
    <>
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Historial de Power-Ups de Dinero 📜</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Monto Original</TableHead>
                <TableHead className="text-right">Monto en Balance (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={`loading-${i}`}>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                      </TableRow>
                  ))
              ) : paginatedIncomes.length > 0 ? (
                paginatedIncomes.map((income) => {
                  const categoryDetails = getCategoryDetails('income', income.type);
                  return (
                    <TableRow key={income.id} onClick={() => setSelectedIncome(income)} className="cursor-pointer">
                      <TableCell>{format(parseISO(income.date), "dd MMM, yyyy", { locale: es })}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-0 ${categoryDetails.className}`}>
                          {categoryDetails.emoji} {categoryDetails.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{income.description || '-'}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatOriginalAmount(income.originalAmount, income.currency)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(income.amount)}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No hay ingresos registrados todavía.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
         {totalPages > 1 && (
            <CardFooter className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Página {page} de {totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={rowsPerPage.toString()}
                        onValueChange={(value) => {
                            setRowsPerPage(Number(value));
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[120px] neumorphic-raised">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10 por página</SelectItem>
                            <SelectItem value="20">20 por página</SelectItem>
                            <SelectItem value="50">50 por página</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="neumorphic-raised"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="neumorphic-raised"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        )}
      </Card>
      {selectedIncome && (
        <IncomeDetailsDialog
          income={selectedIncome}
          isOpen={!!selectedIncome}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedIncome(null);
            }
          }}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
