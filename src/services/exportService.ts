import { ExpenseService } from './expenseService';
import { Expense } from '../db/database';

export class ExportService {
  static async exportExpensesToCSV() {
    const expenses = await ExpenseService.getAllExpenses();
    const csv = this.generateCSV(expenses);
    return csv;
  }

  static async exportExpensesByDateRangeToCSV(startDate: string, endDate: string) {
    const expenses = await ExpenseService.getExpensesByDateRange(startDate, endDate);
    const csv = this.generateCSV(expenses);
    return csv;
  }

  private static generateCSV(expenses: Expense[]): string {
    const headers = ['Date', 'Title', 'Category', 'Amount', 'Description'];
    const rows = expenses.map((exp) => [
      exp.date,
      `"${exp.title}"`,
      exp.category,
      exp.amount.toFixed(2),
      `"${exp.description || ''}"`,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csv;
  }

  static downloadCSV(csv: string, filename: string = 'expenses.csv') {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
