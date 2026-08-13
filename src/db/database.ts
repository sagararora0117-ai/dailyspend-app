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

// Initialize default categories.
// Each default is seeded only if a category with the same (case-insensitive)
// name does not already exist, so repeated or concurrent initialization (e.g.
// the dev-mode StrictMode double-mount) can never insert duplicates.
export async function initializeCategories() {
  const defaults: Category[] = [
    { name: 'Food', color: '#FF6B6B', icon: '🍔' },
    { name: 'Transport', color: '#4ECDC4', icon: '🚗' },
    { name: 'Entertainment', color: '#FFE66D', icon: '🎬' },
    { name: 'Shopping', color: '#FF6B9D', icon: '🛍️' },
    { name: 'Bills', color: '#95E1D3', icon: '📄' },
    { name: 'Health', color: '#F38181', icon: '🏥' },
    { name: 'Other', color: '#A8DADC', icon: '📌' },
  ];
  for (const defaultCategory of defaults) {
    const existing = await db.categories
      .where('name')
      .equalsIgnoreCase(defaultCategory.name)
      .first();
    if (!existing) {
      await db.categories.add(defaultCategory);
    }
  }
}

// Removes duplicate categories (case-insensitive), keeping the first row and
// deleting any later rows with the same name. Expenses reference categories by
// name string (not row id), so this cleanup never breaks existing expenses.
export async function dedupeCategories() {
  const all = await db.categories.toArray();
  const seen = new Set<string>();
  const toDelete: number[] = [];

  for (const cat of all) {
    const key = cat.name.trim().toLowerCase();
    if (seen.has(key)) {
      if (cat.id !== undefined) toDelete.push(cat.id);
    } else {
      seen.add(key);
    }
  }

  if (toDelete.length) {
    await db.categories.bulkDelete(toDelete);
  }
}

// Initialize default settings.
// NOTE: 'currency' is intentionally NOT seeded here - its presence means an
// established preference, so it is left for AppContext to create once via
// locale-based auto-detection on a genuinely fresh install.
export async function initializeSettings() {
  const darkMode = await db.settings.get('darkMode');
  if (!darkMode) {
    await db.settings.bulkAdd([
      { key: 'darkMode', value: false },
      { key: 'monthlyBudget', value: 0 },
    ]);
  }
}
