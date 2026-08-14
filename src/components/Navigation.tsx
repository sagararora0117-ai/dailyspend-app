import React from 'react';
import { useAppContext } from '../context/AppContext';

type PageType = 'home' | 'add-expense' | 'insights' | 'settings' | 'feedback';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

interface NavItem {
  id: PageType;
  label: string;
  icon: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const { theme } = useAppContext();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'add-expense', label: 'Add', icon: '➕' },
    { id: 'insights', label: 'Insights', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.surface,
        borderTop: `1px solid ${theme.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '70px',
        zIndex: 1000,
      }}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onPageChange(item.id)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            backgroundColor: 'transparent',
            color: currentPage === item.id ? theme.primary : theme.textSecondary,
            fontSize: '12px',
            fontWeight: currentPage === item.id ? '600' : '400',
            transition: 'color 0.3s ease',
            borderBottom: currentPage === item.id ? `3px solid ${theme.primary}` : 'none',
            padding: '8px',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '24px' }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
