import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { ThemeProvider } from './context/ThemeContext';
import { useFinanceStore } from './store/financeStore';
import { setTelegramUserId } from './lib/supabase';
import DashboardPage from './pages/Dashboard';
import WishlistPage from './pages/Wishlist';
import SettingsPage from './pages/Settings';
import { NavigationBar } from './components/NavigationBar';
import { ErrorBanner } from './components/ErrorBanner';
import { Onboarding } from './components/Onboarding';
const AppContent = () => {
    const fetchOperations = useFinanceStore((state) => state.fetchOperations);
    const fetchWishes = useFinanceStore((state) => state.fetchWishes);
    const error = useFinanceStore((state) => state.error);
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    useEffect(() => {
        // Инициализируем Telegram User ID для Supabase
        try {
            const user = WebApp.initDataUnsafe?.user;
            if (user?.id) {
                setTelegramUserId(user.id);
            }
        }
        catch (error) {
            console.warn('Failed to initialize Telegram User ID:', error);
        }
        fetchOperations();
        fetchWishes();
        // Проверяем, был ли onboarding уже показан
        const completed = localStorage.getItem('moneymate_onboarding_completed');
        if (completed) {
            setOnboardingComplete(true);
        }
    }, [fetchOperations, fetchWishes]);
    return (_jsxs("div", { className: "app-shell", children: [_jsx(Onboarding, { onComplete: () => setOnboardingComplete(true) }), onboardingComplete && (_jsxs(_Fragment, { children: [_jsxs("main", { className: "page", children: [_jsx(ErrorBanner, { message: error }), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/wishlist", element: _jsx(WishlistPage, {}) }), _jsx(Route, { path: "/settings", element: _jsx(SettingsPage, {}) })] })] }), _jsx(NavigationBar, {})] }))] }));
};
const App = () => (_jsx(ThemeProvider, { children: _jsx(HashRouter, { children: _jsx(AppContent, {}) }) }));
export default App;
