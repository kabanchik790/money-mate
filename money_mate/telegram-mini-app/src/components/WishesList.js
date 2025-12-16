import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../lib/format';
dayjs.extend(localizedFormat);
dayjs.locale('ru');
export const WishesList = ({ items, loading, onDelete }) => {
    if (loading) {
        return _jsx("div", { className: "card", children: "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u0436\u0435\u043B\u0430\u043D\u0438\u044F..." });
    }
    if (!items.length) {
        return (_jsx("div", { className: "card empty-state", children: "\u0421\u043F\u0438\u0441\u043E\u043A \u043F\u0443\u0441\u0442. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0436\u0435\u043B\u0430\u0435\u043C\u0443\u044E \u043F\u043E\u043A\u0443\u043F\u043A\u0443 \u0447\u0435\u0440\u0435\u0437 \u043A\u043D\u043E\u043F\u043A\u0443 \u043D\u0438\u0436\u0435." }));
    }
    return (_jsx("div", { className: "card", children: _jsx("div", { className: "list", children: items.map((wish) => {
                const date = wish.created_at ? dayjs(wish.created_at).format('DD MMM, HH:mm') : '—';
                return (_jsxs("div", { className: "list-item", children: [_jsxs("div", { children: [_jsx("div", { className: "list-item__title", children: wish.what }), _jsx("div", { className: "list-item__subtitle", children: date })] }), _jsxs("div", { className: "actions", children: [_jsx("div", { className: "list-item__value", children: formatCurrency(wish.value) }), _jsx("button", { onClick: () => onDelete(wish), "aria-label": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0436\u0435\u043B\u0430\u043D\u0438\u0435", style: { color: '#475569' }, children: _jsx(Trash2, { size: 20 }) })] })] }, `${wish.id ?? wish.what}-${wish.what}-${wish.value}-${wish.created_at}`));
            }) }) }));
};
