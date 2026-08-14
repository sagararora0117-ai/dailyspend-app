import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { SettingsService } from '../services/settingsService';
import { ExportService } from '../services/exportService';
import { CategoryService } from '../services/categoryService';
import { BudgetService } from '../services/budgetService';
import { Category, Budget } from '../db/database';
import { formatCurrency, getCurrentMonth } from '../utils/dateUtils';
import { CURRENCY_METADATA } from '../utils/currency';

const Settings: React.FC = () => {
  const { theme, toggleDarkMode, currency, setCurrency, isDarkMode } = useAppContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const cats = await CategoryService.getAllCategories();
      setCategories(cats);

      const currentMonth = getCurrentMonth();
      const bud = await BudgetService.getBudgetsByMonth(currentMonth);
      setBudgets(bud);

      const monthlyBudgetAmount = await SettingsService.getMonthlyBudget();
      setMonthlyBudget(monthlyBudgetAmount.toString());
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDarkModeToggle = async () => {
    await toggleDarkMode();
  };

  const handleExportCSV = async () => {
    setExporting(true);
    setExportMessage(null);
    try {
      const csv = await ExportService.exportExpensesToCSV();
      const filename = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
      const result = await ExportService.exportAndShare(csv, filename);
      if (result === 'shared') {
        setExportMessage({ type: 'success', text: 'CSV shared — use “Save to Files” to keep it.' });
      } else if (result === 'downloaded') {
        setExportMessage({ type: 'success', text: 'CSV downloaded.' });
      }
      // 'cancelled' -> user dismissed the share sheet; no message needed.
    } catch (error) {
      console.error('Failed to export CSV:', error);
      setExportMessage({ type: 'error', text: 'Export failed. Please try again.' });
    } finally {
      setExporting(false);
    }
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    try {
      await CategoryService.addCategory({
        name,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        icon: '📌',
      });
      setNewCategoryName('');
      setCategoryError('');
      setShowAddCategory(false);
      await loadSettings();
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : 'Failed to add category.');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await CategoryService.deleteCategory(id);
        await loadSettings();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleAddBudget = async () => {
    if (!newBudgetCategory || !newBudgetAmount) return;

    try {
      const currentMonth = getCurrentMonth();
      await BudgetService.addBudget({
        month: currentMonth,
        category: newBudgetCategory,
        limit: parseFloat(newBudgetAmount),
      });
      setNewBudgetCategory('');
      setNewBudgetAmount('');
      setShowAddBudget(false);
      await loadSettings();
    } catch (error) {
      console.error('Failed to add budget:', error);
    }
  };

  const handleDeleteBudget = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await BudgetService.deleteBudget(id);
        await loadSettings();
      } catch (error) {
        console.error('Failed to delete budget:', error);
      }
    }
  };

  const handleSetMonthlyBudget = async () => {
    try {
      if (monthlyBudget) {
        await SettingsService.setMonthlyBudget(parseFloat(monthlyBudget));
      }
    } catch (error) {
      console.error('Failed to set monthly budget:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: theme.textSecondary }}>
        Loading settings...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Settings</h1>

      {/* Dark Mode */}
      <div
        style={{
          backgroundColor: theme.surface,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${theme.border}`,
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>Dark Mode</p>
          <p style={{ fontSize: '12px', color: theme.textSecondary }}>Toggle dark theme</p>
        </div>
        <button
          onClick={handleDarkModeToggle}
          style={{
            backgroundColor: isDarkMode ? theme.primary : theme.border,
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
          }}
        >
          {isDarkMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Currency */}
      <div
        style={{
          backgroundColor: theme.surface,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${theme.border}`,
          marginBottom: '16px',
        }}
      >
        <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>Currency</p>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '6px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.background,
            color: theme.text,
            fontSize: '14px',
          }}
        >
          {CURRENCY_METADATA.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} ({c.code})
            </option>
          ))}
        </select>
      </div>

      {/* Monthly Budget */}
      <div
        style={{
          backgroundColor: theme.surface,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${theme.border}`,
          marginBottom: '16px',
        }}
      >
        <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>Monthly Budget</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(e.target.value)}
            placeholder="Enter amount"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.background,
              color: theme.text,
              fontSize: '14px',
            }}
          />
          <button
            onClick={handleSetMonthlyBudget}
            style={{
              backgroundColor: theme.primary,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Export */}
      <div
        style={{
          backgroundColor: theme.surface,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${theme.border}`,
          marginBottom: '16px',
        }}
      >
        <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>Export Data</p>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            backgroundColor: theme.success,
            color: 'white',
            border: 'none',
            cursor: exporting ? 'progress' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            opacity: exporting ? 0.7 : 1,
          }}
        >
          {exporting ? '⏳ Preparing…' : '📥 Export to CSV'}
        </button>
        {exportMessage && (
          <p
            role="status"
            style={{
              color: exportMessage.type === 'success' ? theme.success : theme.error,
              fontSize: '12px',
              marginTop: '8px',
            }}
          >
            {exportMessage.text}
          </p>
        )}
      </div>

      {/* Categories */}
      <div
        style={{
          backgroundColor: theme.surface,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${theme.border}`,
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>Categories</p>
          <button
            onClick={() => setShowAddCategory(!showAddCategory)}
            style={{
              backgroundColor: theme.primary,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            ➕ Add
          </button>
        </div>

        {showAddCategory && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  setCategoryError('');
                }}
                placeholder="Category name"
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.background,
                  color: theme.text,
                  fontSize: '12px',
                }}
              />
              <button
                onClick={handleAddCategory}
                style={{
                  backgroundColor: theme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                Add
              </button>
            </div>
            {categoryError && (
              <p style={{ color: theme.error, fontSize: '12px', marginTop: '6px' }}>{categoryError}</p>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                backgroundColor: theme.background,
                borderRadius: '6px',
                border: `1px solid ${theme.border}`,
              }}
            >
              <span style={{ fontSize: '14px' }}>
                {cat.icon} {cat.name}
              </span>
              <button
                onClick={() => cat.id && handleDeleteCategory(cat.id)}
                style={{
                  backgroundColor: theme.error,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Budgets */}
      <div
        style={{
          backgroundColor: theme.surface,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${theme.border}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>Category Budgets</p>
          <button
            onClick={() => setShowAddBudget(!showAddBudget)}
            style={{
              backgroundColor: theme.primary,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            ➕ Add
          </button>
        </div>

        {showAddBudget && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            <select
              value={newBudgetCategory}
              onChange={(e) => setNewBudgetCategory(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.background,
                color: theme.text,
                fontSize: '12px',
              }}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                value={newBudgetAmount}
                onChange={(e) => setNewBudgetAmount(e.target.value)}
                placeholder="Budget amount"
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.background,
                  color: theme.text,
                  fontSize: '12px',
                }}
              />
              <button
                onClick={handleAddBudget}
                style={{
                  backgroundColor: theme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {budgets.map((budget) => (
            <div
              key={budget.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                backgroundColor: theme.background,
                borderRadius: '6px',
                border: `1px solid ${theme.border}`,
              }}
            >
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600' }}>{budget.category}</p>
                <p style={{ fontSize: '11px', color: theme.textSecondary }}>
                  {formatCurrency(budget.spent, currency)} / {formatCurrency(budget.limit, currency)}
                </p>
              </div>
              <button
                onClick={() => budget.id && handleDeleteBudget(budget.id)}
                style={{
                  backgroundColor: theme.error,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {budgets.length === 0 && (
          <p style={{ fontSize: '12px', color: theme.textSecondary, textAlign: 'center', marginTop: '12px' }}>
            No budgets set. Create one to track category spending!
          </p>
        )}
      </div>
    </div>
  );
};

export default Settings;
