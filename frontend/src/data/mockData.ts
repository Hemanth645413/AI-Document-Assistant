import type { Order, RevenuePoint, CategoryTotal, StatSummary } from '../types';

const CUSTOMERS = [
  'Ava Thompson', 'Liam Chen', 'Sofia Rossi', 'Noah Patel', 'Mia Johansson',
  'Ethan Kim', 'Zara Ahmed', 'Lucas Silva', 'Emma Novak', 'Ravi Kumar',
];

const PRODUCTS: { name: string; category: string; price: number }[] = [
  { name: 'Wireless Keyboard', category: 'Accessories', price: 59 },
  { name: 'Studio Monitor', category: 'Audio', price: 249 },
  { name: '27" Display', category: 'Displays', price: 399 },
  { name: 'USB-C Hub', category: 'Accessories', price: 39 },
  { name: 'Noise-Cancelling Headset', category: 'Audio', price: 179 },
  { name: 'Ergonomic Chair', category: 'Furniture', price: 429 },
  { name: 'Standing Desk', category: 'Furniture', price: 599 },
  { name: '4K Webcam', category: 'Accessories', price: 89 },
];

const STATUSES: Order['status'][] = ['Paid', 'Pending', 'Refunded'];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const rand = seededRandom(42);

export function generateOrders(count = 60): Order[] {
  const orders: Order[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const product = PRODUCTS[Math.floor(rand() * PRODUCTS.length)];
    const daysAgo = Math.floor(rand() * 90);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    orders.push({
      id: i + 1,
      customer: CUSTOMERS[Math.floor(rand() * CUSTOMERS.length)],
      product: product.name,
      category: product.category,
      amount: Math.round(product.price * (0.9 + rand() * 0.3)),
      status: STATUSES[Math.floor(rand() * STATUSES.length)],
      date: date.toISOString().slice(0, 10),
    });
  }

  return orders.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function buildRevenueTrend(orders: Order[]): RevenuePoint[] {
  const monthTotals = new Map<string, number>();
  const monthOrder: string[] = [];

  for (const order of orders) {
    if (order.status === 'Refunded') continue;
    const label = new Date(order.date).toLocaleDateString('en-US', { month: 'short' });
    if (!monthTotals.has(label)) {
      monthTotals.set(label, 0);
      monthOrder.push(label);
    }
    monthTotals.set(label, monthTotals.get(label)! + order.amount);
  }

  return monthOrder
    .reverse()
    .map((label) => ({ label, revenue: monthTotals.get(label) ?? 0 }));
}

export function buildCategoryTotals(orders: Order[]): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const order of orders) {
    if (order.status === 'Refunded') continue;
    totals.set(order.category, (totals.get(order.category) ?? 0) + order.amount);
  }
  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function buildStatSummary(orders: Order[]): StatSummary[] {
  const paidOrders = orders.filter((o) => o.status !== 'Refunded');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const avgOrderValue = paidOrders.length ? totalRevenue / paidOrders.length : 0;

  return [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, delta: 8.2 },
    { label: 'Orders', value: orders.length.toString(), delta: 4.5 },
    { label: 'Avg. Order Value', value: `$${avgOrderValue.toFixed(0)}`, delta: -1.3 },
    { label: 'Pending Orders', value: pendingCount.toString(), delta: 2.1 },
  ];
}
