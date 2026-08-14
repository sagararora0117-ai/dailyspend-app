import { ExpenseService } from './expenseService';
import { Expense } from '../db/database';

// Subset of the Web Share API Level 2 types kept local so this builds cleanly
// against any TypeScript lib version.
interface ShareWithFiles {
  canShare?: (data: { files?: File[]; title?: string; text?: string }) => boolean;
  share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
}

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

  /**
   * Legacy download (data URI + anchor.download). Kept for backward
   * compatibility; not reliable on iOS PWA, use exportAndShare instead.
   */
  static downloadCSV(csv: string, filename: string = 'expenses.csv') {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /**
   * Cross-platform export. Prefers the native share sheet with a CSV file,
   * which works reliably on iOS Safari / standalone iOS PWA and Android,
   * falling back to a Blob-URL download for desktop/Android.
   *
   * Fully client-side (Blob, URL.createObjectURL, Web Share API) - no backend.
   *
   * @returns 'shared'  - the native share sheet was opened (user can pick
   *                      "Save to Files" on iOS).
   *          'downloaded' - a Blob-URL download was triggered.
   *          'cancelled' - the user dismissed the share sheet.
   */
  static async exportAndShare(csv: string, filename: string): Promise<'shared' | 'downloaded' | 'cancelled'> {
    // Blob with a UTF-8 BOM so Excel/Numbers open the CSV with correct encoding.
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const file = new File([blob], filename, { type: 'text/csv;charset=utf-8' });
    const shareApi = typeof navigator !== 'undefined'
      ? (navigator as Navigator & ShareWithFiles)
      : undefined;

    // 1) Native share sheet with a file (iOS Safari / installed PWA, Android).
    if (shareApi?.canShare?.({ files: [file] }) === true) {
      try {
        await shareApi.share?.({
          files: [file],
          title: 'Daily Spend expenses',
          text: 'Your expenses exported as CSV.',
        });
        return 'shared';
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return 'cancelled'; // user dismissed the sheet - not an error
        }
        // Any other share failure -> fall through to a download below.
      }
    }

    // 2) Blob-URL + anchor.download fallback (desktop / Android / older iOS).
    return this.downloadBlob(blob, filename);
  }

  private static downloadBlob(blob: Blob, filename: string): 'downloaded' {
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return 'downloaded';
  }
}
