import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatCurrency } from '../lib/format';
import { useThemeController } from '../context/ThemeContext';
export const StatsPanel = ({ balance, incomeTotal, expenseTotal }) => {
    const { palette } = useThemeController();
    const incomeColor = palette.isDark ? '#22c55e' : '#4EBB5B';
    return (_jsxs("section", { className: "card", children: [_jsx("div", { className: "muted", style: { marginBottom: '0rem' }, children: "\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u0431\u0430\u043B\u0430\u043D\u0441" }), _jsx("h2", { className: "title", style: { marginBottom: '0.75rem', marginTop: '0rem', fontSize: '2.5rem', fontWeight: '700' }, children: formatCurrency(balance) }), _jsxs("div", { className: "stats-grid", children: [_jsxs("article", { className: "stat-card", children: [_jsx("div", { className: "stat-label", children: "\u0414\u043E\u0445\u043E\u0434\u044B" }), _jsx("div", { className: "stat-value", style: { color: incomeColor }, children: formatCurrency(incomeTotal) })] }), _jsxs("article", { className: "stat-card", children: [_jsx("div", { className: "stat-label", children: "\u0420\u0430\u0441\u0445\u043E\u0434\u044B" }), _jsx("div", { className: "stat-value", style: { color: 'var(--text-color)' }, children: formatCurrency(expenseTotal) })] })] })] }));
};
