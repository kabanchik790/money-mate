import { useState } from 'react';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';

type AddOperationDialogProps = {
  open: boolean;
  onClose: () => void;
};

type DateOption = 'today' | 'yesterday' | 'custom';

export const AddOperationDialog = ({ open, onClose }: AddOperationDialogProps) => {
  const addOperation = useFinanceStore((state) => state.addOperation);
  const pending = useFinanceStore((state) => state.mutationPending);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [isIncome, setIsIncome] = useState(true);
  const [dateOption, setDateOption] = useState<DateOption>('today');
  const [customDate, setCustomDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const getSelectedDate = (): string | undefined => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true">
      <div className="dialog">
        <h3>Новая операция</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Сумма, ₽</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="Например 5000"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Категория / комментарий</label>
            <input
              type="text"
              placeholder="Зарплата, магазин, подписка..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="field">
            <label>Тип операции</label>
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-btn ${isIncome ? 'active' : ''}`}
                onClick={() => setIsIncome(true)}
              >
                Доход
              </button>
              <button
                type="button"
                className={`toggle-btn ${!isIncome ? 'active' : ''}`}
                onClick={() => setIsIncome(false)}
              >
                Расход
              </button>
            </div>
          </div>
          <div className="field">
            <label>Дата операции</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`toggle-btn ${dateOption === 'today' ? 'active' : ''}`}
                  onClick={() => {
                    setDateOption('today');
                    setShowDatePicker(false);
                  }}
                >
                  Сегодня
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${dateOption === 'yesterday' ? 'active' : ''}`}
                  onClick={() => {
                    setDateOption('yesterday');
                    setShowDatePicker(false);
                  }}
                >
                  Вчера
                </button>
              </div>
              <button
                type="button"
                className={`toggle-btn ${dateOption === 'custom' ? 'active' : ''}`}
                onClick={() => {
                  setDateOption('custom');
                  setShowDatePicker(!showDatePicker);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Calendar size={18} />
                {dateOption === 'custom' && customDate
                  ? dayjs(customDate).format('DD.MM.YYYY')
                  : 'Выбрать дату'}
              </button>
              {showDatePicker && dateOption === 'custom' && (
                <input
                  type="date"
                  value={customDate}
                  max={maxDate}
                  onChange={(e) => {
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
                  }}
                  style={{
                    border: '1px solid rgba(148, 163, 184, 0.4)',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    fontSize: '1rem',
                    background: 'var(--card-muted)',
                    color: 'var(--text-color)',
                    width: '100%'
                  }}
                />
              )}
            </div>
          </div>
          {error ? <div className="error-text">{error}</div> : null}
          <button className="primary-btn" type="submit" disabled={pending}>
            Сохранить
          </button>
          <button type="button" className="outline-btn" onClick={onClose}>
            Отменить
          </button>
        </form>
      </div>
    </div>
  );
};

