import { createContext, useContext, type ReactNode } from 'react';
import { useTelegramTheme, type ThemeController } from '../hooks/useTelegramTheme';

const ThemeContext = createContext<ThemeController | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const controller = useTelegramTheme();
  return <ThemeContext.Provider value={controller}>{children}</ThemeContext.Provider>;
};

export const useThemeController = (): ThemeController => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeController must be used inside ThemeProvider');
  }
  return ctx;
};

