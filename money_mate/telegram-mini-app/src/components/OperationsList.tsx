import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import 'dayjs/locale/ru';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../lib/format';
import { useThemeController } from '../context/ThemeContext';
import { type OperationRecord } from '../types/finance';

dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.locale('ru');

type OperationsListProps = {
  items: OperationRecord[];
  loading?: boolean;
  onDelete: (operation: OperationRecord) => void;
};

type GroupedOperations = {
  date: string;
  dateLabel: string;
  operations: OperationRecord[];
  dayTotal: number;
};

const formatDateLabel = (date: dayjs.Dayjs): string => {
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

export const OperationsList = ({ items, loading, onDelete }: OperationsListProps) => {
  const { palette } = useThemeController();
  const incomeColor = palette.isDark ? '#22c55e' : '#4EBB5B';
  
  if (loading) {
    return <div className="card">Загружаем операции...</div>;
  }

  if (!items.length) {
    return (
      <div className="card empty-state">
        Пока нет операций. Нажмите «Добавить», чтобы создать первую запись.
      </div>
    );
  }

  // Группируем операции по дням
  const groupedOperations = items.reduce((groups, operation) => {
    if (!operation.created_at) return groups;
    
    // Извлекаем дату из строки (первые 10 символов: YYYY-MM-DD)
    const dateStr = operation.created_at.trim();
    let dateKey: string = '';
    
    // Парсим дату из строки формата "YYYY-MM-DD HH:mm:ss" или "YYYY-MM-DD"
    if (dateStr.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      // Берем только часть с датой (первые 10 символов: YYYY-MM-DD)
      dateKey = dateStr.substring(0, 10);
    } else {
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
  }, {} as Record<string, GroupedOperations>);

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

  return (
    <>
      {sortedGroups.map((group, groupIndex) => (
        <div key={group.date} className="card" style={{ marginTop: groupIndex > 0 ? '1rem' : 0 }}>
          {/* Заголовок дня */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '0.75rem',
              marginBottom: '0.75rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
            }}
          >
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>
              {group.dateLabel}
            </div>
            <div
              style={{
                color: group.dayTotal >= 0 ? incomeColor : 'var(--text-color)',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              {group.dayTotal >= 0 ? '+' : ''}{formatCurrency(Math.abs(group.dayTotal))}
            </div>
          </div>

          {/* Операции дня */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {group.operations.map((operation) => {
              const sign = operation.type ? '+' : '-';
              return (
                <div
                  key={`${operation.id ?? operation.where}-${operation.where}-${operation.value}-${operation.created_at}`}
                  style={{
                    background: 'var(--card-muted)',
                    borderRadius: '12px',
                    padding: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-color)' }}>
                      {operation.where}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        fontWeight: '600',
                        fontSize: '1rem',
                        color: operation.type ? incomeColor : 'var(--text-color)'
                      }}
                    >
                      {sign}
                      {formatCurrency(operation.value)}
                    </div>
                    <button
                      onClick={() => onDelete(operation)}
                      aria-label="Удалить операцию"
                      style={{
                        color: '#475569',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

