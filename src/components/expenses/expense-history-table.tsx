'use client';

import { useState } from "react";
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
import type { Expense } from "@/lib/types";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { ExpenseDetailsDialog } from "./expense-details-dialog";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExpenseHistoryTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onUpdate: (expense: Omit<Expense, "id" | "userId">, id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}


export function ExpenseHistoryTable({ expenses, isLoading, onUpdate, onDelete }: ExpenseHistoryTableProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const { getCategoryDetails } = useCategories();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const formatOriginalAmount = (amount: number, currency: 'USD' | 'DOP') => {
    return new Intl.NumberFormat(currency === 'DOP' ? 'es-DO' : 'en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
  }

  const paginatedExpenses = expenses.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(expenses.length / rowsPerPage);

  return (
    <>
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Historial de Gastos 📜</CardTitle>
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
              ) : paginatedExpenses.length > 0 ? (
                paginatedExpenses.map((expense) => {
                  const categoryDetails = getCategoryDetails('expense', expense.type);
                  return (
                    <TableRow key={expense.id} onClick={() => setSelectedExpense(expense)} className="cursor-pointer">
                      <TableCell>{format(parseISO(expense.date), "dd MMM, yyyy", { locale: es })}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-0 ${categoryDetails.className}`}>
                          {categoryDetails.emoji} {categoryDetails.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{expense.description || '-'}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatOriginalAmount(expense.originalAmount, expense.currency)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-red-600">
                        - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expense.amount)}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No hay gastos registrados todavía.
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
      {selectedExpense && (
        <ExpenseDetailsDialog
          expense={selectedExpense}
          isOpen={!!selectedExpense}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedExpense(null);
            }
          }}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
