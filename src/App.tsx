import React, { useEffect } from 'react';
import { useAppContext } from './context/AppContext';
import { globalStyles } from './utils/theme';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import AddExpense from './pages/AddExpense';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';

type Page = 'home' | 'add-expense' | 'insights' | 'settings' | 'feedback';

const App: React.FC = () => {
  const { isInitialized, theme } = useAppContext();
  const [currentPage, setCurrentPage] = React.useState<Page>('home');

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(`${import.meta.env.BASE_URL}serviceWorker.js`)
        .catch((error) => console.log('SW registration failed:', error));
    }

    // Check URL parameters for shortcuts
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    if (action === 'add-expense') {
      setCurrentPage('add-expense');
    } else if (action === 'insights') {
      setCurrentPage('insights');
    }
  }, []);

  useEffect(() => {
    // Add global styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = globalStyles;
    document.head.appendChild(styleSheet);
  }, []);

  if (!isInitialized) {
    return (
      <div style={{
        backgroundColor: theme.background,
        color: theme.text,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        Loading...
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'add-expense':
        return <AddExpense onSave={() => setCurrentPage('home')} />;
      case 'insights':
        return <Insights />;
      case 'settings':
        return <Settings />;
      case 'feedback':
        return <Feedback />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div style={{
      backgroundColor: theme.background,
      color: theme.text,
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    }}>
      <main style={{
        flex: 1,
        overflow: 'auto',
        paddingBottom: '80px',
      }}>
        {renderPage()}
      </main>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default App;
