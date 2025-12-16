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
  // Инициализируем onboardingComplete сразу из localStorage, чтобы избежать пустого экрана
  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('moneymate_onboarding_completed');
  });

  useEffect(() => {
    // Инициализируем Telegram User ID для Supabase
    try {
      const user = WebApp.initDataUnsafe?.user;
      if (user?.id) {
        setTelegramUserId(user.id);
      }
    } catch (error) {
      console.warn('Failed to initialize Telegram User ID:', error);
    }

    // Блокируем закрытие приложения по свайпу в контентной области
    try {
      WebApp.enableClosingConfirmation?.();
      // Отключаем стандартное поведение свайпа вниз для контента
      WebApp.BackButton?.hide?.();
    } catch (error) {
      console.warn('Failed to configure WebApp closing:', error);
    }

    fetchOperations();
    fetchWishes();
  }, [fetchOperations, fetchWishes]);

  return (
    <div className="app-shell">
      <Onboarding onComplete={() => setOnboardingComplete(true)} />
      {/* Показываем контент сразу, если onboarding не нужен */}
      {onboardingComplete ? (
        <>
          <main className="page">
            <ErrorBanner message={error} />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
          <NavigationBar />
        </>
      ) : null}
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <HashRouter>
      <AppContent />
    </HashRouter>
  </ThemeProvider>
);

export default App;

