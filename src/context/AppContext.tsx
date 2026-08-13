import React, { createContext, useContext, useState, useEffect } from 'react';
import { SettingsService } from '../services/settingsService';
import { initializeCategories, initializeSettings, dedupeCategories } from '../db/database';
import { Theme, getTheme } from '../utils/theme';
import { toCurrencyCode, detectCurrencyFromLocale, DEFAULT_CURRENCY_CODE } from '../utils/currency';

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
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY_CODE);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeCategories();
        await dedupeCategories();
        await initializeSettings();
        const darkMode = await SettingsService.getDarkMode();
        setIsDarkMode(darkMode);

        const storedCurrency = await SettingsService.getCurrency();
        const source = await SettingsService.getCurrencySource();
        let curr: string;

        if (source === 'manual') {
          // The user explicitly picked a currency in Settings - that choice
          // always wins and is never overridden by location detection.
          curr = toCurrencyCode(storedCurrency) ?? storedCurrency ?? DEFAULT_CURRENCY_CODE;
          await SettingsService.setCurrency(curr);
        } else {
          // No manual choice (fresh install, previously auto-detected, or a
          // legacy default like '$'). Base the currency on the user's
          // location/locale on each launch.
          curr = detectCurrencyFromLocale();
          await SettingsService.setCurrency(curr);
          await SettingsService.setCurrencySource('auto');
        }

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
    const code = toCurrencyCode(newCurrency) ?? newCurrency;
    setCurrencyState(code);
    await SettingsService.setCurrency(code);
    await SettingsService.setCurrencySource('manual');
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
