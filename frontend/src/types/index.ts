export interface Order {
  id: number;
  customer: string;
  product: string;
  category: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Refunded';
  date: string; // ISO date
}

export interface RevenuePoint {
  label: string; // e.g. month short name
  revenue: number;
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface StatSummary {
  label: string;
  value: string;
  delta: number; // percentage change, can be negative
}
