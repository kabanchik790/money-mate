import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import { useTelegramTheme } from '../hooks/useTelegramTheme';
const ThemeContext = createContext(null);
export const ThemeProvider = ({ children }) => {
    const controller = useTelegramTheme();
    return _jsx(ThemeContext.Provider, { value: controller, children: children });
};
export const useThemeController = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useThemeController must be used inside ThemeProvider');
    }
    return ctx;
};
