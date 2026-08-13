import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ExpenseService } from '../services/expenseService';
import { CategoryService } from '../services/categoryService';
import { Category, Expense } from '../db/database';
import { getTodayDate } from '../utils/dateUtils';

interface AddExpenseProps {
  onSave: () => void;
  editingExpense?: Expense;
}

const AddExpense: React.FC<AddExpenseProps> = ({ onSave, editingExpense }) => {
  const { theme, currency } = useAppContext();
  const [formData, setFormData] = useState({
    title: editingExpense?.title || '',
    amount: editingExpense?.amount?.toString() || '',
    category: editingExpense?.category || 'Food',
    date: editingExpense?.date || getTodayDate(),
    description: editingExpense?.description || '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await CategoryService.getAllCategories();
      setCategories(cats);
      if (cats.length > 0 && !editingExpense) {
        setFormData((prev) => ({ ...prev, category: cats[0].name }));
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Please enter an expense title');
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (!formData.date) {
      setError('Please select a date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const expenseData = {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description.trim(),
      };

      if (editingExpense && editingExpense.id) {
        await ExpenseService.updateExpense(editingExpense.id, expenseData);
      } else {
        await ExpenseService.addExpense(expenseData);
      }

      onSave();
    } catch (error) {
      console.error('Failed to save expense:', error);
      setError('Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        {editingExpense ? 'Edit Expense' : 'Add Expense'}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: theme.error,
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Coffee"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.surface,
              color: theme.text,
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Amount */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
            Amount ({currency})
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.surface,
              color: theme.text,
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.surface,
              color: theme.text,
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.surface,
              color: theme.text,
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add any additional notes..."
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.surface,
              color: theme.text,
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: theme.primary,
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? 'Saving...' : editingExpense ? 'Update' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
