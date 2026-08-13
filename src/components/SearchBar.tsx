import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { theme } = useAppContext();
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder="Search expenses..."
        value={query}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '12px 16px',
          paddingRight: '40px',
          borderRadius: '8px',
          border: `1px solid ${theme.border}`,
          backgroundColor: theme.surface,
          color: theme.text,
          fontSize: '14px',
          transition: 'border-color 0.3s ease',
        }}
      />
      {query && (
        <button
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'transparent',
            color: theme.textSecondary,
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
