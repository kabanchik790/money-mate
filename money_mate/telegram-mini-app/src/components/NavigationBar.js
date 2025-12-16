import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { Home, Heart, Settings } from 'lucide-react';
const NAV_ITEMS = [
    { to: '/dashboard', label: 'Главная', icon: Home },
    { to: '/wishlist', label: 'Желания', icon: Heart },
    { to: '/settings', label: 'Настройки', icon: Settings }
];
export const NavigationBar = () => (_jsx("nav", { className: "bottom-nav", children: _jsx("div", { className: "bottom-nav__inner", children: NAV_ITEMS.map(({ to, label, icon: Icon }) => (_jsxs(NavLink, { to: to, className: ({ isActive }) => `bottom-nav__btn ${isActive ? 'active' : ''}`, children: [_jsx(Icon, { size: 20, strokeWidth: 2 }), label] }, to))) }) }));
