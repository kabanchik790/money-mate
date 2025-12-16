import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
export const AddOperationDialog = ({ open, onClose }) => {
    const addOperation = useFinanceStore((state) => state.addOperation);
    const pending = useFinanceStore((state) => state.mutationPending);
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [isIncome, setIsIncome] = useState(true);
    const [dateOption, setDateOption] = useState('today');
    const [customDate, setCustomDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [error, setError] = useState(null);
    if (!open)
        return null;
    const getSelectedDate = () => {
        if (dateOption === 'today') {
            return undefined; // Текущая дата по умолчанию
        }
        if (dateOption === 'yesterday') {
            return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        }
        if (dateOption === 'custom') {
            return customDate;
        }
        return undefined;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const numericValue = Number(String(amount).replace(',', '.'));
        if (!numericValue || numericValue <= 0) {
            setError('Введите сумму больше 0');
            return;
        }
        const selectedDate = getSelectedDate();
        const selectedDateObj = selectedDate ? dayjs(selectedDate) : dayjs();
        // Проверка на будущую дату
        if (selectedDateObj.isAfter(dayjs(), 'day')) {
            setError('Нельзя выбрать дату из будущего');
            return;
        }
        setError(null);
        await addOperation({
            value: numericValue,
            where: title,
            isIncome,
            date: selectedDate
        });
        setAmount('');
        setTitle('');
        setDateOption('today');
        setCustomDate(dayjs().format('YYYY-MM-DD'));
        setShowDatePicker(false);
        onClose();
    };
    const today = dayjs();
    const yesterday = today.subtract(1, 'day');
    const maxDate = today.format('YYYY-MM-DD');
    return (_jsx("div", { className: "dialog-backdrop", role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "dialog", children: [_jsx("h3", { children: "\u041D\u043E\u0432\u0430\u044F \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u044F" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "field", children: [_jsx("label", { children: "\u0421\u0443\u043C\u043C\u0430, \u20BD" }), _jsx("input", { type: "number", inputMode: "decimal", placeholder: "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 5000", value: amount, onChange: (event) => setAmount(event.target.value), required: true })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F / \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439" }), _jsx("input", { type: "text", placeholder: "\u0417\u0430\u0440\u043F\u043B\u0430\u0442\u0430, \u043C\u0430\u0433\u0430\u0437\u0438\u043D, \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0430...", value: title, onChange: (event) => setTitle(event.target.value) })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: "\u0422\u0438\u043F \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438" }), _jsxs("div", { className: "toggle-group", children: [_jsx("button", { type: "button", className: `toggle-btn ${isIncome ? 'active' : ''}`, onClick: () => setIsIncome(true), children: "\u0414\u043E\u0445\u043E\u0434" }), _jsx("button", { type: "button", className: `toggle-btn ${!isIncome ? 'active' : ''}`, onClick: () => setIsIncome(false), children: "\u0420\u0430\u0441\u0445\u043E\u0434" })] })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: "\u0414\u0430\u0442\u0430 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438" }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' }, children: [_jsxs("div", { className: "toggle-group", children: [_jsx("button", { type: "button", className: `toggle-btn ${dateOption === 'today' ? 'active' : ''}`, onClick: () => {
                                                        setDateOption('today');
                                                        setShowDatePicker(false);
                                                    }, children: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F" }), _jsx("button", { type: "button", className: `toggle-btn ${dateOption === 'yesterday' ? 'active' : ''}`, onClick: () => {
                                                        setDateOption('yesterday');
                                                        setShowDatePicker(false);
                                                    }, children: "\u0412\u0447\u0435\u0440\u0430" })] }), _jsxs("button", { type: "button", className: `toggle-btn ${dateOption === 'custom' ? 'active' : ''}`, onClick: () => {
                                                setDateOption('custom');
                                                setShowDatePicker(!showDatePicker);
                                            }, style: {
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }, children: [_jsx(Calendar, { size: 18 }), dateOption === 'custom' && customDate
                                                    ? dayjs(customDate).format('DD.MM.YYYY')
                                                    : 'Выбрать дату'] }), showDatePicker && dateOption === 'custom' && (_jsx("input", { type: "date", value: customDate, max: maxDate, onChange: (e) => {
                                                const selectedDate = e.target.value;
                                                const selectedDateObj = dayjs(selectedDate);
                                                // Проверка на будущую дату
                                                if (selectedDateObj.isAfter(dayjs(), 'day')) {
                                                    setError('Нельзя выбрать дату из будущего');
                                                    return;
                                                }
                                                setCustomDate(selectedDate);
                                                setError(null);
                                                setShowDatePicker(false);
                                            }, style: {
                                                border: '1px solid rgba(148, 163, 184, 0.4)',
                                                borderRadius: '12px',
                                                padding: '0.85rem 1rem',
                                                fontSize: '1rem',
                                                background: 'var(--card-muted)',
                                                color: 'var(--text-color)',
                                                width: '100%'
                                            } }))] })] }), error ? _jsx("div", { className: "error-text", children: error }) : null, _jsx("button", { className: "primary-btn", type: "submit", disabled: pending, children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" }), _jsx("button", { type: "button", className: "outline-btn", onClick: onClose, children: "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C" })] })] }) }));
};
