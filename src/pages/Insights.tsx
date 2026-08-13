import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ExpenseService } from '../services/expenseService';
import { CategoryService } from '../services/categoryService';
import { formatCurrency, getCurrentMonth, getMonthStart, getMonthEnd } from '../utils/dateUtils';
// @ts-expect-error - recharts types not fully compatible with strict TypeScript
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface CategoryStats {
  name: string;
  amount: number;
  percentage: number;
  icon: string;
}

interface DailyData {
  date: string;
  amount: number;
}

const Insights: React.FC = () => {
  const { theme, currency } = useAppContext();
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [totalMonth, setTotalMonth] = useState(0);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  useEffect(() => {
    loadInsights();
  }, [selectedMonth]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const categories = await CategoryService.getAllCategories();
      const monthStart = getMonthStart(selectedMonth);
      const monthEnd = getMonthEnd(selectedMonth);
      const expenses = await ExpenseService.getExpensesByDateRange(monthStart, monthEnd);

      // Calculate category totals
      const categoryTotals: { [key: string]: number } = {};
      let total = 0;

      expenses.forEach((exp) => {
        if (!categoryTotals[exp.category]) {
          categoryTotals[exp.category] = 0;
        }
        categoryTotals[exp.category] += exp.amount;
        total += exp.amount;
      });

      const stats = categories
        .filter((cat) => categoryTotals[cat.name])
        .map((cat) => ({
          name: cat.name,
          amount: categoryTotals[cat.name],
          percentage: total > 0 ? (categoryTotals[cat.name] / total) * 100 : 0,
          icon: cat.icon,
        }))
        .sort((a, b) => b.amount - a.amount);

      setCategoryStats(stats);
      setTotalMonth(total);

      // Calculate daily data
      const dailyTotals: { [key: string]: number } = {};
      expenses.forEach((exp) => {
        if (!dailyTotals[exp.date]) {
          dailyTotals[exp.date] = 0;
        }
        dailyTotals[exp.date] += exp.amount;
      });

      const daily = Object.entries(dailyTotals)
        .map(([date, amount]) => ({
          date: date.slice(5),
          amount: parseFloat(amount.toFixed(2)),
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30);

      setDailyData(daily);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444'];

  const handlePreviousMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: theme.textSecondary }}>
        Loading insights...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Insights</h1>

      {/* Month Selector */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          backgroundColor: theme.surface,
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid ${theme.border}`,
        }}
      >
        <button
          onClick={handlePreviousMonth}
          style={{
            backgroundColor: theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ← Prev
        </button>
        <span style={{ fontWeight: '600', fontSize: '14px' }}>
          {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button
          onClick={handleNextMonth}
          style={{
            backgroundColor: theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Next →
        </button>
      </div>

      {/* Total */}
      <div
        style={{
          backgroundColor: theme.surface,
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${theme.border}`,
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: theme.textSecondary, fontSize: '14px', marginBottom: '8px' }}>Total Spent This Month</p>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: theme.error }}>
          {formatCurrency(totalMonth, currency)}
        </p>
      </div>

      {/* Pie Chart */}
      {categoryStats.length > 0 && (
        <div
          style={{
            backgroundColor: theme.surface,
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>By Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryStats} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {categoryStats.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categoryStats.map((stat, index) => (
              <div key={stat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: COLORS[index % COLORS.length],
                      borderRadius: '2px',
                    }}
                  />
                  <span style={{ fontSize: '14px' }}>
                    {stat.icon} {stat.name}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>{formatCurrency(stat.amount, currency)}</p>
                  <p style={{ fontSize: '12px', color: theme.textSecondary }}>{stat.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Trend */}
      {dailyData.length > 0 && (
        <div
          style={{
            backgroundColor: theme.surface,
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Daily Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
              <XAxis dataKey="date" stroke={theme.textSecondary} />
              <YAxis stroke={theme.textSecondary} />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke={theme.primary} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {categoryStats.length === 0 && dailyData.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: theme.textSecondary }}>
          No expenses this month. Add some expenses to see insights!
        </div>
      )}
    </div>
  );
};

export default Insights;
