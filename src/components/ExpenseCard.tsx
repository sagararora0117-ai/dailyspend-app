import React, { useState } from 'react';
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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirmation(false);
    onDelete();
  };

  return (
    <>
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
              {expense.category === 'Health' && '🩺'}
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
          <p
            style={{
              fontWeight: '700',
              fontSize: '16px',
              color: theme.error,
              minWidth: '70px',
              textAlign: 'right',
            }}
          >
            {formatCurrency(expense.amount, currency)}
          </p>

          <div style={{ display: 'flex', gap: '4px' }}>
            {onEdit && (
              <button
                onClick={onEdit}
                aria-label="Edit expense"
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
              onClick={() => setShowDeleteConfirmation(true)}
              aria-label="Delete expense"
              style={{
                backgroundColor: theme.surface,
                color: theme.textSecondary,
                border: `1px solid ${theme.border}`,
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

      {showDeleteConfirmation && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-expense-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000,
          }}
          onClick={() => setShowDeleteConfirmation(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              backgroundColor: theme.surface,
              borderRadius: '14px',
              padding: '20px',
              boxSizing: 'border-box',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="delete-expense-title"
              style={{
                fontSize: '20px',
                margin: '0 0 12px',
                color: theme.text,
              }}
            >
              Delete Expense?
            </h2>

            <div
              style={{
                backgroundColor: theme.background,
                border: `1px solid ${theme.border}`,
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '14px',
              }}
            >
              <p style={{ fontWeight: '600', margin: '0 0 4px' }}>
                {expense.title}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: theme.textSecondary,
                  margin: '0 0 4px',
                }}
              >
                {expense.category} • {formatDate(expense.date)}
              </p>
              <p
                style={{
                  fontWeight: '700',
                  fontSize: '18px',
                  color: theme.error,
                  margin: 0,
                }}
              >
                {formatCurrency(expense.amount, currency)}
              </p>
            </div>

            <p
              style={{
                fontSize: '14px',
                color: theme.textSecondary,
                margin: '0 0 18px',
              }}
            >
              This expense will be permanently deleted.
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={() => setShowDeleteConfirmation(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.surface,
                  color: theme.text,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: theme.error,
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpenseCard;