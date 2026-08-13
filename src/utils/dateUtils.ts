import { format, parse, startOfMonth, endOfMonth, isToday, isYesterday } from 'date-fns';
import { currencySymbol, DEFAULT_CURRENCY_CODE } from './currency';

export const formatDate = (dateStr: string): string => {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
};

export const formatDateShort = (dateStr: string): string => {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  return format(date, 'MMM d');
};

// Formats an amount using Intl.NumberFormat (two decimals), falling back to the
// legacy toFixed(2) if Intl is unavailable.
const formatAmount = (amount: number): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return amount.toFixed(2);
  }
};

export const formatCurrency = (amount: number, currency: string = DEFAULT_CURRENCY_CODE): string => {
  // Resolve the ISO code if possible; Intl number formatting handles the digits
  // while the deterministic symbol table keeps the presentation identical to
  // the previous `${symbol}${12.34}` behavior across every currency.
  return `${currencySymbol(currency)}${formatAmount(amount)}`;
};

export const getTodayDate = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getCurrentMonth = (): string => {
  return format(new Date(), 'yyyy-MM');
};

export const getMonthStart = (month: string): string => {
  const date = parse(month, 'yyyy-MM', new Date());
  return format(startOfMonth(date), 'yyyy-MM-dd');
};

export const getMonthEnd = (month: string): string => {
  const date = parse(month, 'yyyy-MM', new Date());
  return format(endOfMonth(date), 'yyyy-MM-dd');
};

export const getMonthDisplayName = (month: string): string => {
  const date = parse(month, 'yyyy-MM', new Date());
  return format(date, 'MMMM yyyy');
};

export const parseDate = (dateStr: string): Date => {
  return parse(dateStr, 'yyyy-MM-dd', new Date());
};

export const getDaysInMonth = (month: string): number => {
  const date = parse(month, 'yyyy-MM', new Date());
  return endOfMonth(date).getDate();
};
