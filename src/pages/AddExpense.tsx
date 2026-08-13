import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ExpenseService } from '../services/expenseService';
import { CategoryService } from '../services/categoryService';
import { suggestExpenseCategory } from '../services/expenseSuggestionService';
import { Category, Expense } from '../db/database';
import { getTodayDate } from '../utils/dateUtils';

interface AddExpenseProps {
  onSave: () => void;
  editingExpense?: Expense;
}

const subcategories: Record<string, string[]> = {
  Food: ['Groceries', 'Dining Out', 'Food Delivery', 'Coffee & Snacks'],
  Transport: ['Taxi/Cab', 'Fuel', 'Public Transport', 'Parking'],
  Entertainment: ['Subscriptions', 'Movies', 'Games', 'Events'],
  Shopping: ['Clothing', 'Electronics', 'Home', 'Personal Care'],
  Bills: ['Electricity', 'Internet', 'Phone', 'Water'],
  Health: ['Medicines', 'Doctor', 'Fitness', 'Insurance'],
  Other: [],
};

const fieldStyle = (theme: ReturnType<typeof useAppContext>['theme']): React.CSSProperties => ({
  width: '100%', minHeight: '48px', padding: '12px', borderRadius: '10px',
  border: `1px solid ${theme.border}`, backgroundColor: theme.surface, color: theme.text,
  fontSize: '16px', boxSizing: 'border-box', fontFamily: 'inherit',
});

const AddExpense: React.FC<AddExpenseProps> = ({ onSave, editingExpense }) => {
  const { theme, currency } = useAppContext();
  const amountRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    amount: editingExpense?.amount?.toString() || '',
    category: editingExpense?.category || '',
    subcategory: editingExpense?.subcategory || '',
    description: editingExpense?.description || '',
    date: editingExpense?.date || getTodayDate(),
    time: editingExpense?.time || '',
    paymentMethod: editingExpense?.paymentMethod || '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { amountRef.current?.focus(); }, []);
  useEffect(() => {
    CategoryService.getAllCategories().then((cats) => {
      setCategories(cats);
      if (!editingExpense && !formData.category && cats[0]) setFormData((current) => ({ ...current, category: cats[0].name }));
    }).catch(() => setError('Categories could not be loaded. Please try again.'));
  }, [editingExpense, formData.category]);

  const suggestion = useMemo(() => suggestExpenseCategory(formData.description), [formData.description]);
  const availableSubcategories = subcategories[formData.category] || [];
  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value, ...(name === 'category' ? { subcategory: '' } : {}) }));
    setError('');
  };
  const useSuggestion = () => {
    if (!suggestion) return;
    setFormData((current) => ({ ...current, category: suggestion.category, subcategory: suggestion.subcategory }));
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const amount = Number(formData.amount);
    if (!Number.isFinite(amount) || amount <= 0) return setError('Enter an amount greater than zero.');
    if (!formData.category) return setError('Select a category.');
    if (!formData.date) return setError('Select a date.');
    const title = formData.description.trim() || formData.subcategory || formData.category;
    const expenseData = {
      title, amount, category: formData.category, subcategory: formData.subcategory || undefined,
      date: formData.date, time: formData.time || undefined, paymentMethod: formData.paymentMethod || undefined,
      description: formData.description.trim() || undefined,
    };
    try {
      setLoading(true);
      if (editingExpense?.id) await ExpenseService.updateExpense(editingExpense.id, expenseData);
      else await ExpenseService.addExpense(expenseData);
      setSaved(true);
      window.setTimeout(onSave, 450);
    } catch (saveError) {
      console.error('Failed to save expense:', saveError);
      setError('Your expense was not saved. Please try again.');
      setLoading(false);
    }
  };
  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' };

  return <div style={{ padding: '20px 20px calc(100px + env(safe-area-inset-bottom))', maxWidth: '500px', margin: '0 auto' }}>
    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h1>
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {error && <div role="alert" style={{ backgroundColor: theme.error, color: 'white', padding: '12px', borderRadius: '10px' }}>{error}</div>}
      {saved && <div role="status" style={{ backgroundColor: theme.success, color: 'white', padding: '12px', borderRadius: '10px' }}>Expense saved</div>}
      <div><label htmlFor="amount" style={labelStyle}>Amount ({currency})</label><input ref={amountRef} id="amount" type="number" name="amount" value={formData.amount} onChange={change} inputMode="decimal" placeholder="0.00" min="0.01" step="0.01" required style={{ ...fieldStyle(theme), fontSize: '28px', fontWeight: 700, padding: '16px' }} /></div>
      <div><label htmlFor="category" style={labelStyle}>Category</label><select id="category" name="category" value={formData.category} onChange={change} required style={fieldStyle(theme)}>{categories.map((category) => <option key={category.id} value={category.name}>{category.icon} {category.name}</option>)}</select></div>
      {availableSubcategories.length > 0 && <div><label htmlFor="subcategory" style={labelStyle}>Subcategory</label><select id="subcategory" name="subcategory" value={formData.subcategory} onChange={change} style={fieldStyle(theme)}><option value="">Select subcategory (optional)</option>{availableSubcategories.map((subcategory) => <option key={subcategory} value={subcategory}>{subcategory}</option>)}</select></div>}
      <div><label htmlFor="description" style={labelStyle}>Description (optional)</label><textarea id="description" name="description" value={formData.description} onChange={change} placeholder="e.g., Swiggy dinner" rows={3} style={{ ...fieldStyle(theme), minHeight: '96px', resize: 'vertical' }} />
        {suggestion && <div style={{ marginTop: '8px', padding: '10px', borderRadius: '10px', backgroundColor: theme.background, border: `1px solid ${theme.border}`, fontSize: '14px' }}>Suggested category: <strong>{suggestion.subcategory}</strong><button type="button" onClick={useSuggestion} style={{ marginLeft: '10px', border: 'none', borderRadius: '6px', padding: '6px 8px', color: 'white', backgroundColor: theme.primary, cursor: 'pointer' }}>Use suggestion</button></div>}</div>
      <div><label htmlFor="date" style={labelStyle}>Date</label><input id="date" type="date" name="date" value={formData.date} onChange={change} required style={fieldStyle(theme)} /></div>
      <div><label htmlFor="time" style={labelStyle}>Time (optional)</label><input id="time" type="time" name="time" value={formData.time} onChange={change} style={fieldStyle(theme)} /></div>
      <div><label htmlFor="paymentMethod" style={labelStyle}>Payment method (optional)</label><select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={change} style={fieldStyle(theme)}><option value="">Select payment method</option>{['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'].map((method) => <option key={method} value={method}>{method}</option>)}</select></div>
      <button type="submit" disabled={loading || saved} style={{ minHeight: '52px', marginTop: '8px', borderRadius: '10px', border: 'none', backgroundColor: theme.primary, color: 'white', fontSize: '16px', fontWeight: 700, cursor: loading || saved ? 'not-allowed' : 'pointer', opacity: loading || saved ? 0.6 : 1 }}>{loading ? 'Saving…' : editingExpense ? 'Update expense' : 'Save expense'}</button>
    </form>
  </div>;
};

export default AddExpense;
