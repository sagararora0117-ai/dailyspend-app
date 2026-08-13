export const lightTheme = {
  primary: '#6366F1',
  secondary: '#EC4899',
  background: '#FFFFFF',
  surface: '#F3F4F6',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const darkTheme = {
  primary: '#818CF8',
  secondary: '#F472B6',
  background: '#111827',
  surface: '#1F2937',
  text: '#F3F4F6',
  textSecondary: '#D1D5DB',
  border: '#374151',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
};

export type Theme = typeof lightTheme;

export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};

export const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    width: 100%;
    height: 100%;
  }

  input, textarea, select {
    font-family: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    font-family: inherit;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #CBD5E1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #94A3B8;
  }
`;
