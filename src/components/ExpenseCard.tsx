import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Expense } from '../db/database';
import { formatDate, formatCurrency } from '../utils/dateUtils';

interface ExpenseCardProps {
  expense: Expense;
  onDelete: () => void;
  onEdit?: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onDelete, onEdit }) => {
  const { theme, currency } = useAppContext();

  return (
    <div
      style={{
        backgroundColor: theme.surface,
        padding: '16px',
        borderRadius: '12px',
        border: `1px solid ${theme.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '20px' }}>
            {expense.category === 'Food' && '🍔'}
            {expense.category === 'Transport' && '🚗'}
            {expense.category === 'Entertainment' && '🎬'}
            {expense.category === 'Shopping' && '🛍️'}
            {expense.category === 'Bills' && '📄'}
            {expense.category === 'Health' && '🏥'}
            {expense.category === 'Other' && '📌'}
          </span>
          <div>
            <p style={{ fontWeight: '600', fontSize: '14px' }}>{expense.title}</p>
            <p style={{ fontSize: '12px', color: theme.textSecondary }}>
              {expense.category} • {formatDate(expense.date)}
            </p>
          </div>
        </div>
        {expense.description && (
          <p style={{ fontSize: '12px', color: theme.textSecondary, marginLeft: '28px' }}>
            {expense.description}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <p style={{ fontWeight: '700', fontSize: '16px', color: theme.error, minWidth: '70px', textAlign: 'right' }}>
          {formatCurrency(expense.amount, currency)}
        </p>
        <div style={{ display: 'flex', gap: '4px' }}>
          {onEdit && (
            <button
              onClick={onEdit}
              style={{
                backgroundColor: theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              ✏️
            </button>
          )}
          <button
            onClick={onDelete}
            style={{
              backgroundColor: theme.error,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
