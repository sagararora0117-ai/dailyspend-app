import { db, Expense } from '../db/database';

export class ExpenseService {
  static async addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) {
    return db.expenses.add({
      ...expense,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  static async updateExpense(id: number, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) {
    return db.expenses.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  static async deleteExpense(id: number) {
    return db.expenses.delete(id);
  }

  static async getExpense(id: number) {
    return db.expenses.get(id);
  }

  static async getAllExpenses() {
    return db.expenses.orderBy('createdAt').reverse().toArray();
  }

  static async getExpensesByCategory(category: string) {
    return db.expenses
      .where('category')
      .equals(category)
      .reverse()
      .toArray();
  }

  static async getExpensesByDateRange(startDate: string, endDate: string) {
    return db.expenses
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  }

  static async searchExpenses(query: string) {
    const allExpenses = await db.expenses.toArray();
    const lowerQuery = query.toLowerCase();
    return allExpenses.filter(
      (exp) =>
        exp.title.toLowerCase().includes(lowerQuery) ||
        exp.category.toLowerCase().includes(lowerQuery) ||
        exp.description?.toLowerCase().includes(lowerQuery)
    );
  }

  static async getMonthlyTotal(month: string): Promise<number> {
    const expenses = await db.expenses
      .where('date')
      .startsWithIgnoreCase(month)
      .toArray();
    return expenses.reduce((total, exp) => total + exp.amount, 0);
  }

  static async getCategoryTotal(category: string): Promise<number> {
    const expenses = await db.expenses
      .where('category')
      .equals(category)
      .toArray();
    return expenses.reduce((total, exp) => total + exp.amount, 0);
  }

  static async getTotalExpenses(): Promise<number> {
    const expenses = await db.expenses.toArray();
    return expenses.reduce((total, exp) => total + exp.amount, 0);
  }
}
