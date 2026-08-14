import React, { useEffect, useState } from 'react';
import { useAppContext } from './context/AppContext';
import { globalStyles } from './utils/theme';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import AddExpense from './pages/AddExpense';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';
import { registerUserName } from './services/supabase';

type Page = 'home' | 'add-expense' | 'insights' | 'settings' | 'feedback';

const USER_NAME_STORAGE_KEY = 'dailyspend_user_name';

const App: React.FC = () => {
  const { isInitialized, theme } = useAppContext();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem(USER_NAME_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [nameInput, setNameInput] = useState('');
  const [registering, setRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState('');

  useEffect(() => {
    // Register the service worker and check for a newer version
    // whenever the app opens.
    if ('serviceWorker' in navigator) {
      let refreshing = false;

      navigator.serviceWorker
        .register(`${import.meta.env.BASE_URL}serviceWorker.js`)
        .then((registration) => {
          return registration.update();
        })
        .catch((error) => {
          console.log('SW registration/update failed:', error);
        });

      const handleControllerChange = () => {
        if (refreshing) {
          return;
        }

        refreshing = true;
        window.location.reload();
      };

      navigator.serviceWorker.addEventListener(
        'controllerchange',
        handleControllerChange
      );

      return () => {
        navigator.serviceWorker.removeEventListener(
          'controllerchange',
          handleControllerChange
        );
      };
    }

    return undefined;
  }, []);

  useEffect(() => {
    // Check URL parameters for shortcuts.
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');

    if (action === 'add-expense') {
      setCurrentPage('add-expense');
    } else if (action === 'insights') {
      setCurrentPage('insights');
    }
  }, []);

  useEffect(() => {
    // Add global styles.
    const styleSheet = document.createElement('style');
    styleSheet.textContent = globalStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleNameSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanName = nameInput.trim();

    if (!cleanName) {
      setRegistrationError('Please enter your name.');
      return;
    }

    if (cleanName.length > 100) {
      setRegistrationError('Name must be 100 characters or less.');
      return;
    }

    setRegistering(true);
    setRegistrationError('');

    try {
      await registerUserName(cleanName);

      localStorage.setItem(USER_NAME_STORAGE_KEY, cleanName);
      setUserName(cleanName);
      setNameInput('');
    } catch (error) {
      console.error('Name registration failed:', error);

      setRegistrationError(
        error instanceof Error
          ? error.message
          : 'Unable to register your name. Please try again.'
      );
    } finally {
      setRegistering(false);
    }
  };

  if (!isInitialized) {
    return (
      <div
        style={{
          backgroundColor: theme.background,
          color: theme.text,
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        width: '100%',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <main
        style={{
          flex: 1,
          overflow: 'auto',
          paddingBottom: '80px',
        }}
      >
        {renderPage()}
      </main>

      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {!userName && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: theme.surface,
              color: theme.text,
              borderRadius: '18px',
              padding: '28px 22px',
              boxSizing: 'border-box',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                fontSize: '42px',
                marginBottom: '8px',
              }}
            >
              👋
            </div>

            <h1
              style={{
                textAlign: 'center',
                fontSize: '24px',
                margin: '0 0 8px',
                fontWeight: 700,
              }}
            >
              Welcome to Daily Spend
            </h1>

            <p
              style={{
                textAlign: 'center',
                color: theme.textSecondary,
                fontSize: '14px',
                margin: '0 0 24px',
                lineHeight: 1.5,
              }}
            >
              What should we call you?
            </p>

            <form
              onSubmit={handleNameSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <input
                type="text"
                value={nameInput}
                onChange={(event) => {
                  setNameInput(event.target.value);
                  setRegistrationError('');
                }}
                placeholder="Enter your name"
                maxLength={100}
                autoFocus
                disabled={registering}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '14px',
                  borderRadius: '10px',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.background,
                  color: theme.text,
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />

              {registrationError && (
                <p
                  role="alert"
                  style={{
                    color: theme.error,
                    fontSize: '13px',
                    margin: 0,
                    textAlign: 'center',
                  }}
                >
                  {registrationError}
                </p>
              )}

              <button
                type="submit"
                disabled={registering}
                style={{
                  width: '100%',
                  minHeight: '48px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: theme.primary,
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: registering ? 'wait' : 'pointer',
                  opacity: registering ? 0.7 : 1,
                }}
              >
                {registering ? 'Saving...' : 'Continue'}
              </button>
            </form>

            <p
              style={{
                color: theme.textSecondary,
                fontSize: '11px',
                textAlign: 'center',
                margin: '16px 0 0',
                lineHeight: 1.4,
              }}
            >
              We only ask for your name.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;