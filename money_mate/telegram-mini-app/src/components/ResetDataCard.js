import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
export const ResetDataCard = () => {
    const resetData = useFinanceStore((state) => state.resetData);
    const pending = useFinanceStore((state) => state.mutationPending);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const handleReset = async () => {
        await resetData();
        setConfirmVisible(false);
    };
    return (_jsxs("section", { className: "card", children: [_jsxs("div", { className: "chip danger", children: [_jsx(AlertTriangle, { size: 16 }), "\u041E\u043F\u0430\u0441\u043D\u0430\u044F \u0437\u043E\u043D\u0430"] }), _jsx("h3", { style: { marginTop: '0.75rem' }, children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u0441\u0435 \u0434\u0430\u043D\u043D\u044B\u0435" }), _jsx("p", { className: "muted", children: "\u0423\u0434\u0430\u043B\u0438\u0442 \u0432\u0441\u0435 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438, \u0436\u0435\u043B\u0430\u043D\u0438\u044F \u0438 \u0441\u0443\u043C\u043C\u044B. \u042D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C." }), confirmVisible ? (_jsxs("div", { style: { display: 'flex', gap: '0.75rem', marginTop: '1rem' }, children: [_jsx("button", { className: "primary-btn", onClick: handleReset, disabled: pending, children: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u044E" }), _jsx("button", { className: "outline-btn", onClick: () => setConfirmVisible(false), disabled: pending, children: "\u041E\u0442\u043C\u0435\u043D\u0430" })] })) : (_jsx("button", { className: "primary-btn", style: { marginTop: '1rem' }, onClick: () => setConfirmVisible(true), children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435" }))] }));
};
