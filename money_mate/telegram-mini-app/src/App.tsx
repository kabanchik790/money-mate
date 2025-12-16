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
    } catch (error) {
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

  return (
    <div className="app-shell">
      <Onboarding onComplete={() => setOnboardingComplete(true)} />
      {onboardingComplete && (
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
      )}
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

