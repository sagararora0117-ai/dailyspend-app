import React, { createContext, useContext, useState, useEffect } from 'react';
import { SettingsService } from '../services/settingsService';
import { initializeCategories, initializeSettings } from '../db/database';
import { Theme, getTheme } from '../utils/theme';

interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
  currency: string;
  setCurrency: (currency: string) => void;
  isInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currency, setCurrencyState] = useState('$');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeCategories();
        await initializeSettings();
        const darkMode = await SettingsService.getDarkMode();
        const curr = await SettingsService.getCurrency();
        setIsDarkMode(darkMode);
        setCurrencyState(curr);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    await SettingsService.toggleDarkMode();
  };

  const setCurrency = async (newCurrency: string) => {
    setCurrencyState(newCurrency);
    await SettingsService.setCurrency(newCurrency);
  };

  const theme = getTheme(isDarkMode);

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        theme,
        currency,
        setCurrency,
        isInitialized,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
