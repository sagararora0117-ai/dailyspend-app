import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ExpenseService } from '../services/expenseService';
import { Expense } from '../db/database';
import { formatCurrency, getTodayDate, getCurrentMonth } from '../utils/dateUtils';
import ExpenseCard from '../components/ExpenseCard';
import SearchBar from '../components/SearchBar';

interface Stats {
  today: number;
  thisMonth: number;
  total: number;
}

const Home: React.FC = () => {
  const { theme, currency } = useAppContext();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<Stats>({ today: 0, thisMonth: 0, total: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const allExpenses = await ExpenseService.getAllExpenses();
      setExpenses(allExpenses);
      setFilteredExpenses(allExpenses);

      // Calculate stats
      const today = getTodayDate();
      const todayExpenses = allExpenses.filter((exp) => exp.date === today);
      const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      const month = getCurrentMonth();
      const monthTotal = await ExpenseService.getMonthlyTotal(month);

      const total = await ExpenseService.getTotalExpenses();

      setStats({
        today: todayTotal,
        thisMonth: monthTotal,
        total,
      });
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredExpenses(expenses);
    } else {
      const results = await ExpenseService.searchExpenses(query);
      setFilteredExpenses(results);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      await ExpenseService.deleteExpense(id);
      await loadExpenses();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Daily Spend</h1>
        <p style={{ color: theme.textSecondary, fontSize: '14px' }}>Track your expenses</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div
          style={{
            backgroundColor: theme.surface,
            padding: '16px',
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
          }}
        >
          <p style={{ color: theme.textSecondary, fontSize: '12px', marginBottom: '8px' }}>Today</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: theme.primary }}>
            {formatCurrency(stats.today, currency)}
          </p>
        </div>
        <div
          style={{
            backgroundColor: theme.surface,
            padding: '16px',
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
          }}
        >
          <p style={{ color: theme.textSecondary, fontSize: '12px', marginBottom: '8px' }}>This Month</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: theme.secondary }}>
            {formatCurrency(stats.thisMonth, currency)}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Expenses List */}
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          {searchQuery ? 'Search Results' : 'Recent Expenses'}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: theme.textSecondary }}>
            Loading...
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: theme.textSecondary }}>
            {searchQuery ? 'No expenses found' : 'No expenses yet. Add one to get started!'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onDelete={() => expense.id && handleDeleteExpense(expense.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
