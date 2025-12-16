import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import 'dayjs/locale/ru';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../lib/format';
import { useThemeController } from '../context/ThemeContext';
dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.locale('ru');
const formatDateLabel = (date) => {
    const today = dayjs().startOf('day');
    const yesterday = dayjs().subtract(1, 'day').startOf('day');
    const dateStart = date.startOf('day');
    if (dateStart.isSame(today)) {
        return 'СЕГОДНЯ';
    }
    if (dateStart.isSame(yesterday)) {
        return 'ВЧЕРА';
    }
    return date.format('DD.MM');
};
export const OperationsList = ({ items, loading, onDelete }) => {
    const { palette } = useThemeController();
    const incomeColor = palette.isDark ? '#22c55e' : '#4EBB5B';
    if (loading) {
        return _jsx("div", { className: "card", children: "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438..." });
    }
    if (!items.length) {
        return (_jsx("div", { className: "card empty-state", children: "\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0439. \u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u00AB\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C\u00BB, \u0447\u0442\u043E\u0431\u044B \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0435\u0440\u0432\u0443\u044E \u0437\u0430\u043F\u0438\u0441\u044C." }));
    }
    // Группируем операции по дням
    const groupedOperations = items.reduce((groups, operation) => {
        if (!operation.created_at)
            return groups;
        // Извлекаем дату из строки (первые 10 символов: YYYY-MM-DD)
        const dateStr = operation.created_at.trim();
        let dateKey = '';
        // Парсим дату из строки формата "YYYY-MM-DD HH:mm:ss" или "YYYY-MM-DD"
        if (dateStr.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
            // Берем только часть с датой (первые 10 символов: YYYY-MM-DD)
            dateKey = dateStr.substring(0, 10);
        }
        else {
            // Если формат другой, пытаемся парсить через dayjs
            const parsed = dayjs(dateStr);
            if (parsed.isValid()) {
                dateKey = parsed.format('YYYY-MM-DD');
            }
        }
        if (!dateKey) {
            console.warn('Не удалось извлечь дату из операции:', operation);
            return groups;
        }
        if (!groups[dateKey]) {
            // Создаем dayjs объект из даты (формат YYYY-MM-DD) для определения метки
            const dateObj = dayjs(dateKey);
            if (!dateObj.isValid()) {
                console.warn('Некорректная дата:', dateKey, 'для операции:', operation);
                return groups;
            }
            groups[dateKey] = {
                date: dateKey,
                dateLabel: formatDateLabel(dateObj),
                operations: [],
                dayTotal: 0
            };
        }
        groups[dateKey].operations.push(operation);
        const value = operation.type ? operation.value : -operation.value;
        groups[dateKey].dayTotal += value;
        return groups;
    }, {});
    // Сортируем группы по дате (новые сверху)
    const sortedGroups = Object.values(groupedOperations).sort((a, b) => {
        return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
    });
    // Сортируем операции внутри каждой группы по времени (новые сверху)
    sortedGroups.forEach(group => {
        group.operations.sort((a, b) => {
            const dateA = a.created_at ? dayjs(a.created_at).valueOf() : 0;
            const dateB = b.created_at ? dayjs(b.created_at).valueOf() : 0;
            return dateB - dateA;
        });
    });
    return (_jsx(_Fragment, { children: sortedGroups.map((group, groupIndex) => (_jsxs("div", { className: "card", style: { marginTop: groupIndex > 0 ? '1rem' : 0 }, children: [_jsxs("div", { style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: '0.75rem',
                        marginBottom: '0.75rem',
                        borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
                    }, children: [_jsx("div", { style: { color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }, children: group.dateLabel }), _jsxs("div", { style: {
                                color: group.dayTotal >= 0 ? incomeColor : 'var(--text-color)',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }, children: [group.dayTotal >= 0 ? '+' : '', formatCurrency(Math.abs(group.dayTotal))] })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.65rem' }, children: group.operations.map((operation) => {
                        const sign = operation.type ? '+' : '-';
                        return (_jsxs("div", { style: {
                                background: 'var(--card-muted)',
                                borderRadius: '12px',
                                padding: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }, children: [_jsx("div", { children: _jsx("div", { style: { fontWeight: '600', color: 'var(--text-color)' }, children: operation.where }) }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsxs("div", { style: {
                                                fontWeight: '600',
                                                fontSize: '1rem',
                                                color: operation.type ? incomeColor : 'var(--text-color)'
                                            }, children: [sign, formatCurrency(operation.value)] }), _jsx("button", { onClick: () => onDelete(operation), "aria-label": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u044E", style: {
                                                color: '#475569',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }, children: _jsx(Trash2, { size: 20 }) })] })] }, `${operation.id ?? operation.where}-${operation.where}-${operation.value}-${operation.created_at}`));
                    }) })] }, group.date))) }));
};
