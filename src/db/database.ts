import Dexie, { Table } from 'dexie';

export interface Expense {
  id?: number;
  title: string;
  amount: number;
  category: string;
  subcategory?: string;
  date: string;
  time?: string;
  paymentMethod?: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id?: number;
  name: string;
  color: string;
  icon: string;
}

export interface Budget {
  id?: number;
  month: string; // YYYY-MM
  category: string;
  limit: number;
  spent: number;
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  key: string;
  value: string | boolean | number;
}

export class DailySpendDB extends Dexie {
  expenses!: Table<Expense>;
  categories!: Table<Category>;
  budgets!: Table<Budget>;
  settings!: Table<Settings>;

  constructor() {
    super('DailySpendDB');
    this.version(1).stores({
      expenses: '++id, date, category, createdAt',
      categories: '++id, name',
      budgets: '++id, month, category',
      settings: 'key',
    });
  }
}

export const db = new DailySpendDB();

// Initialize default categories
export async function initializeCategories() {
  const count = await db.categories.count();
  if (count === 0) {
    const defaultCategories: Category[] = [
      { name: 'Food', color: '#FF6B6B', icon: '🍔' },
      { name: 'Transport', color: '#4ECDC4', icon: '🚗' },
      { name: 'Entertainment', color: '#FFE66D', icon: '🎬' },
      { name: 'Shopping', color: '#FF6B9D', icon: '🛍️' },
      { name: 'Bills', color: '#95E1D3', icon: '📄' },
      { name: 'Health', color: '#F38181', icon: '🏥' },
      { name: 'Other', color: '#A8DADC', icon: '📌' },
    ];
    await db.categories.bulkAdd(defaultCategories);
  }
}

// Initialize default settings
export async function initializeSettings() {
  const darkMode = await db.settings.get('darkMode');
  if (!darkMode) {
    await db.settings.bulkAdd([
      { key: 'darkMode', value: false },
      { key: 'currency', value: '$' },
      { key: 'monthlyBudget', value: 0 },
    ]);
  }
}
