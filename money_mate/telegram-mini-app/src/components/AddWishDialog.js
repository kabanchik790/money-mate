import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useFinanceStore } from '../store/financeStore';
export const AddWishDialog = ({ open, onClose }) => {
    const addWish = useFinanceStore((state) => state.addWish);
    const pending = useFinanceStore((state) => state.mutationPending);
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [error, setError] = useState(null);
    if (!open)
        return null;
    const handleSubmit = async (event) => {
        event.preventDefault();
        const numericValue = Number(String(amount).replace(',', '.'));
        if (!numericValue || numericValue <= 0) {
            setError('Введите сумму больше 0');
            return;
        }
        setError(null);
        await addWish({
            value: numericValue,
            what: title
        });
        setAmount('');
        setTitle('');
        onClose();
    };
    return (_jsx("div", { className: "dialog-backdrop", role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "dialog", children: [_jsx("h3", { children: "\u041D\u043E\u0432\u044B\u0439 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0441\u043F\u0438\u0441\u043A\u0430 \u0436\u0435\u043B\u0430\u043D\u0438\u0439" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "field", children: [_jsx("label", { children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 / \u0446\u0435\u043B\u044C" }), _jsx("input", { type: "text", placeholder: "\u041F\u043B\u0430\u043D\u0448\u0435\u0442, \u043E\u0442\u043F\u0443\u0441\u043A...", value: title, onChange: (event) => setTitle(event.target.value) })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C, \u20BD" }), _jsx("input", { type: "number", inputMode: "decimal", placeholder: "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 15000", value: amount, onChange: (event) => setAmount(event.target.value), required: true })] }), error ? _jsx("div", { className: "error-text", children: error }) : null, _jsx("button", { className: "primary-btn", type: "submit", disabled: pending, children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" }), _jsx("button", { type: "button", className: "outline-btn", onClick: onClose, children: "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C" })] })] }) }));
};
