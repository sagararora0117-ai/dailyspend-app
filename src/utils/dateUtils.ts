import { format, parse, startOfMonth, endOfMonth, isToday, isYesterday } from 'date-fns';

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

export const formatCurrency = (amount: number, currency: string = '$'): string => {
  return `${currency}${amount.toFixed(2)}`;
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
