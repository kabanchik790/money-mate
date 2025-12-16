import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useThemeController } from '../context/ThemeContext';
import { ThemeSelector } from '../components/ThemeSelector';
import { ResetDataCard } from '../components/ResetDataCard';
const SettingsPage = () => {
    const { telegramUser } = useThemeController();
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "card", children: [_jsx("h3", { style: { marginTop: 0 }, children: "Telegram" }), telegramUser ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "list-item__title", children: [telegramUser.first_name, " ", telegramUser.last_name ?? ''] }), _jsxs("div", { className: "muted", children: ["@", telegramUser.username ?? 'без никнейма'] }), _jsxs("p", { className: "muted", style: { marginTop: '0.5rem' }, children: ["ID \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F: ", telegramUser.id] })] })) : (_jsx("p", { className: "muted", children: "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043C\u0438\u043D\u0438-\u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0432\u043D\u0443\u0442\u0440\u0438 Telegram, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u043F\u0440\u043E\u0444\u0438\u043B\u044F." }))] }), _jsx(ThemeSelector, {}), _jsx(ResetDataCard, {})] }));
};
export default SettingsPage;
