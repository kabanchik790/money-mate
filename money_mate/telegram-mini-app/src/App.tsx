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

    fetchOperations();
    fetchWishes();
  }, [fetchOperations, fetchWishes]);

  useEffect(() => {
    // Блокируем закрытие приложения по свайпу в контентной области
    let touchStartY = 0;
    let touchStartTime = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      // Проверяем, что свайп начинается не в nav bar области (верхние 60px)
      const touchY = e.touches[0]?.clientY || 0;
      const isNavBarArea = touchY < 60;
      
      if (!isNavBarArea) {
        touchStartY = touchY;
        touchStartTime = Date.now();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY > 0 && touchStartY >= 60) {
        const touchCurrentY = e.touches[0]?.clientY || 0;
        const deltaY = touchCurrentY - touchStartY;
        const deltaTime = Date.now() - touchStartTime;
        
        // Блокируем свайп вниз (положительный deltaY) в контентной области
        if (deltaY > 10 && deltaTime < 300 && window.scrollY === 0) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    const appShell = document.querySelector('.app-shell');
    if (appShell) {
      appShell.addEventListener('touchstart', handleTouchStart, { passive: true });
      appShell.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (appShell) {
        appShell.removeEventListener('touchstart', handleTouchStart);
        appShell.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  return (
    <div className="app-shell">
      {/* Показываем контент всегда - он будет виден после завершения onboarding */}
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
      {/* Onboarding показывается поверх контента, если нужен */}
      <Onboarding onComplete={() => setOnboardingComplete(true)} />
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

