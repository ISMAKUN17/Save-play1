export type Goal = {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  totalAmount: number;
  savedAmount: number;
  deadline: string; // ISO 8601 string
  status: 'active' | 'archived';
};

export type Contribution = {
  id: string;
  userId: string;
  goalId: string;
  goalName: string;
  amount: number;
  date: string; // ISO 8601 string
};

export type Income = {
    id: string;
    userId: string;
    type: string; // References Category name
    amount: number; // Stored in USD
    originalAmount: number;
    currency: 'USD' | 'DOP';
    date: string; // ISO 8601 string
    description?: string;
    createdAt: string; // ISO 8601 string
};

export type Expense = {
    id: string;
    userId: string;
    type: string; // References Category name
    amount: number; // Stored in USD
    originalAmount: number;
    currency: 'USD' | 'DOP';
    date: string; // ISO 8601 string
    description?: string;
    createdAt: string; // ISO 8601 string
};

export type Debt = {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  totalAmount: number;
  paidAmount: number;
  monthlyPayment: number;
  dueDate: number; // Day of the month
};

export type DebtPayment = {
  id: string;
  userId: string;
  debtId: string;
  debtName: string;
  amount: number;
  date: string; // ISO 8601 string
};

export type Category = {
    id: string;
    userId: string;
    name: string;
    emoji: string;
    order: number;
};
