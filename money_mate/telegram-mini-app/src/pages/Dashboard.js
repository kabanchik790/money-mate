import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useFinanceStore } from '../store/financeStore';
import { StatsPanel } from '../components/StatsPanel';
import { MonthSelector } from '../components/MonthSelector';
import { OperationsList } from '../components/OperationsList';
import { AddOperationDialog } from '../components/AddOperationDialog';
const DashboardPage = () => {
    const operations = useFinanceStore((state) => state.operations);
    const loading = useFinanceStore((state) => state.operationsLoading);
    const deleteOperation = useFinanceStore((state) => state.deleteOperation);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    // Фильтруем операции по выбранному месяцу
    const filteredOperations = useMemo(() => {
        return operations.filter((op) => {
            if (!op.created_at)
                return false;
            // Извлекаем дату из строки (первые 10 символов: YYYY-MM-DD)
            const dateStr = op.created_at.substring(0, 10);
            const opDate = dayjs(dateStr);
            if (!opDate.isValid())
                return false;
            return opDate.year() === selectedDate.year() && opDate.month() === selectedDate.month();
        });
    }, [operations, selectedDate]);
    // Доходы и расходы только для выбранного месяца
    const { income, expense } = useMemo(() => {
        const incomeTotal = filteredOperations
            .filter((op) => op.type)
            .reduce((acc, op) => acc + (op.value ?? 0), 0);
        const expenseTotal = filteredOperations
            .filter((op) => !op.type)
            .reduce((acc, op) => acc + (op.value ?? 0), 0);
        return {
            income: incomeTotal,
            expense: expenseTotal
        };
    }, [filteredOperations]);
    // Общий баланс для всех операций
    const balance = useMemo(() => {
        const incomeTotal = operations
            .filter((op) => op.type)
            .reduce((acc, op) => acc + (op.value ?? 0), 0);
        const expenseTotal = operations
            .filter((op) => !op.type)
            .reduce((acc, op) => acc + (op.value ?? 0), 0);
        return incomeTotal - expenseTotal;
    }, [operations]);
    return (_jsxs(_Fragment, { children: [_jsx(StatsPanel, { balance: balance, incomeTotal: income, expenseTotal: expense }), _jsx(MonthSelector, { currentDate: selectedDate, onDateChange: setSelectedDate, operationsCount: filteredOperations.length }), _jsx("h3", { style: { paddingLeft: '1.25rem', marginTop: '1.5rem', marginBottom: '1.0rem' }, children: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438" }), _jsx("div", { style: { paddingBottom: '6rem' }, children: _jsx(OperationsList, { items: filteredOperations, loading: loading, onDelete: deleteOperation }) }), _jsx("button", { className: "primary-btn", style: {
                    position: 'fixed',
                    bottom: '6rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    maxWidth: '640px',
                    width: 'calc(100% - 2rem)',
                    zIndex: 40,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }, onClick: () => setDialogOpen(true), children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u044E" }), _jsx(AddOperationDialog, { open: dialogOpen, onClose: () => setDialogOpen(false) })] }));
};
export default DashboardPage;
