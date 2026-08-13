import { db, Budget } from '../db/database';
import { ExpenseService } from './expenseService';

export class BudgetService {
  static async addBudget(budget: Omit<Budget, 'id' | 'spent' | 'createdAt' | 'updatedAt'>) {
    const existing = await db.budgets
      .where('month')
      .equals(budget.month)
      .and((b) => b.category === budget.category)
      .first();

    if (existing) {
      return this.updateBudget(existing.id!, budget);
    }

    return db.budgets.add({
      ...budget,
      spent: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  static async updateBudget(id: number, updates: Partial<Omit<Budget, 'id' | 'createdAt'>>) {
    return db.budgets.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  static async deleteBudget(id: number) {
    return db.budgets.delete(id);
  }

  static async getBudget(id: number) {
    return db.budgets.get(id);
  }

  static async getBudgetsByMonth(month: string) {
    return db.budgets.where('month').equals(month).toArray();
  }

  static async getBudgetByMonthAndCategory(month: string, category: string) {
    return db.budgets
      .where('month')
      .equals(month)
      .and((b) => b.category === category)
      .first();
  }

  static async updateBudgetSpent(month: string) {
    const budgets = await this.getBudgetsByMonth(month);
    for (const budget of budgets) {
      const spent = await ExpenseService.getMonthlyTotal(month);
      if (budget.id) {
        await this.updateBudget(budget.id, { spent });
      }
    }
  }

  static async getAllBudgets() {
    return db.budgets.toArray();
  }
}
