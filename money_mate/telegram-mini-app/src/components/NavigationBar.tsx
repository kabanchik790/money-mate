import { NavLink } from 'react-router-dom';
import { Home, Heart, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Главная', icon: Home },
  { to: '/wishlist', label: 'Желания', icon: Heart },
  { to: '/settings', label: 'Настройки', icon: Settings }
];

export const NavigationBar = () => (
  <nav className="bottom-nav">
    <div className="bottom-nav__inner">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav__btn ${isActive ? 'active' : ''}`}
        >
          <Icon size={20} strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </div>
  </nav>
);

