import { NavLink, useLocation } from 'react-router-dom';
import { Home, Heart, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Главная', icon: Home },
  { to: '/wishlist', label: 'Желания', icon: Heart },
  { to: '/settings', label: 'Настройки', icon: Settings }
];

export const NavigationBar = () => {
  const location = useLocation();
  
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__inner">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          // Проверяем активность: точное совпадение или редирект с "/" на "/dashboard"
          const isActive = location.pathname === to || 
                          (to === '/dashboard' && (location.pathname === '/' || location.pathname === ''));
          
          return (
            <NavLink
              key={to}
              to={to}
              end
              className={`bottom-nav__btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} strokeWidth={2} />
              {label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

