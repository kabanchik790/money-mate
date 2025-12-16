import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useThemeController } from '../context/ThemeContext';
const options = [
    { label: 'Системная', value: 'system', description: 'Использовать тему Telegram' },
    { label: 'Светлая', value: 'light', description: 'Всегда светлый режим' },
    { label: 'Тёмная', value: 'dark', description: 'Всегда тёмный режим' }
];
export const ThemeSelector = () => {
    const { choice, setChoice } = useThemeController();
    return (_jsxs("section", { className: "card", children: [_jsx("h3", { style: { marginTop: 0 }, children: "\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435" }), _jsx("p", { className: "muted", style: { marginBottom: '1rem' }, children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u0442\u0435 \u0432\u043D\u0435\u0448\u043D\u0438\u0439 \u0432\u0438\u0434 \u043C\u0438\u043D\u0438-\u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F." }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' }, children: options.map((option) => {
                    const active = option.value === choice;
                    return (_jsxs("button", { type: "button", className: `toggle-btn ${active ? 'active' : ''}`, style: {
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            textAlign: 'left'
                        }, onClick: () => setChoice(option.value), children: [_jsx("strong", { children: option.label }), _jsx("span", { className: "muted", children: option.description })] }, option.value));
                }) })] }));
};
