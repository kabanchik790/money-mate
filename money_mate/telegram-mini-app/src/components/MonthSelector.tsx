import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

type MonthSelectorProps = {
  currentDate: dayjs.Dayjs;
  onDateChange: (date: dayjs.Dayjs) => void;
  operationsCount: number;
};

export const MonthSelector = ({ currentDate, onDateChange, operationsCount }: MonthSelectorProps) => {
  const monthYear = currentDate.format('MMMM YYYY г.');
  const today = dayjs();
  const isCurrentMonth = currentDate.year() === today.year() && currentDate.month() === today.month();
  const isFutureMonth = currentDate.isAfter(today, 'month');
  
  const handlePrev = () => {
    onDateChange(currentDate.subtract(1, 'month'));
  };

  const handleNext = () => {
    if (!isCurrentMonth && !isFutureMonth) {
      onDateChange(currentDate.add(1, 'month'));
    }
  };

  return (
    <div
      style={{
        background: 'var(--card-color)',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        marginTop: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}
    >
      <button
        onClick={handlePrev}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-color)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem',
          borderRadius: '8px',
          transition: 'background 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--card-muted)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        aria-label="Предыдущий месяц"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-color)', marginBottom: '0.25rem' }}>
          {monthYear}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {operationsCount} {operationsCount === 1 ? 'ОПЕРАЦИЯ' : operationsCount > 1 && operationsCount < 5 ? 'ОПЕРАЦИИ' : 'ОПЕРАЦИЙ'}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={isCurrentMonth || isFutureMonth}
        style={{
          background: 'transparent',
          border: 'none',
          color: isCurrentMonth || isFutureMonth ? 'var(--text-muted)' : 'var(--text-color)',
          cursor: isCurrentMonth || isFutureMonth ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem',
          borderRadius: '8px',
          transition: 'background 0.2s ease',
          opacity: isCurrentMonth || isFutureMonth ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (!isCurrentMonth && !isFutureMonth) {
            e.currentTarget.style.background = 'var(--card-muted)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        aria-label="Следующий месяц"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

